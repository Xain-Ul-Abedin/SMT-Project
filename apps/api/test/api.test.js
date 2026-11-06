const assert = require('assert');
const http = require('http');
const app = require('../src/server');
const { connectDB } = require('../src/config/db');
const { seedDatabase } = require('../src/scripts/seed');

const TEST_PORT = 5002;
const BASE_URL = `http://localhost:${TEST_PORT}/api/v1`;

function makeRequest(method, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(`${BASE_URL}${path}`);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = data ? JSON.parse(data) : {};
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, raw: data });
                }
            });
        });

        req.on('error', reject);

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function runApiIntegrationTests() {
    console.log('==================================================');
    console.log('[TEST SUITE] Phase 3 Core REST API Integration Harness');
    console.log('==================================================\n');

    await connectDB();
    await seedDatabase();

    const server = http.createServer(app);
    await new Promise(resolve => server.listen(TEST_PORT, resolve));
    console.log(`[SETUP] Test Server listening on ${BASE_URL}\n`);

    try {
        // ----------------------------------------------------
        // TEST 1: Admin & Collector Login
        // ----------------------------------------------------
        console.log('[TEST 1: Authentication & Token Issuance]');
        const adminLogin = await makeRequest('POST', '/auth/login', {
            email: 'admin@artsgallery.com',
            password: 'Password123!'
        });
        assert.strictEqual(adminLogin.status, 200, 'Admin login must return 200');
        assert(adminLogin.data.token, 'Admin login must return token');
        assert.strictEqual(adminLogin.data.user.role, 'admin');
        const adminToken = adminLogin.data.token;
        console.log('[PASS] Admin login succeeded, JWT token acquired.');

        const collectorLogin = await makeRequest('POST', '/auth/login', {
            email: 'collector@artsgallery.com',
            password: 'Password123!'
        });
        assert.strictEqual(collectorLogin.status, 200, 'Collector login must return 200');
        assert.strictEqual(collectorLogin.data.user.role, 'customer');
        const collectorToken = collectorLogin.data.token;
        console.log('[PASS] Collector login succeeded, JWT token acquired.\n');

        // ----------------------------------------------------
        // TEST 2: Artist Registration & Token Verification
        // ----------------------------------------------------
        console.log('[TEST 2: Artist Registration & /me Verification]');
        const newArtistEmail = `artist_${Date.now()}@artsgallery.com`;
        const artistReg = await makeRequest('POST', '/auth/register', {
            name: 'Jean-Luc Moreau',
            email: newArtistEmail,
            password: 'Password123!',
            role: 'artist',
            artistProfile: {
                bio: 'Sculptor and mixed-media creator exploring metallic textures.',
                verified: false
            }
        });
        assert.strictEqual(artistReg.status, 201, 'Artist registration must return 201');
        assert.strictEqual(artistReg.data.user.role, 'artist');
        const artistToken = artistReg.data.token;

        const meRes = await makeRequest('GET', '/auth/me', null, artistToken);
        assert.strictEqual(meRes.status, 200);
        assert.strictEqual(meRes.data.user.email, newArtistEmail.toLowerCase());
        console.log('[PASS] Artist registered and authenticated profile retrieved via Bearer header.\n');

        // ----------------------------------------------------
        // TEST 3: Public Catalog Browsing & Faceted Filtering
        // ----------------------------------------------------
        console.log('[TEST 3: Artwork Catalog & Faceted Search]');
        const publicCatalog = await makeRequest('GET', '/artworks');
        assert.strictEqual(publicCatalog.status, 200);
        assert(publicCatalog.data.count >= 10, 'Public catalog must return available artworks');
        console.log(`[PASS] Public catalog retrieved: ${publicCatalog.data.count} available pieces.`);

        const filterOil = await makeRequest('GET', '/artworks?medium=Oil%20on%20Linen');
        assert.strictEqual(filterOil.status, 200);
        assert(filterOil.data.count > 0, 'Oil on Linen filter must return artworks');
        filterOil.data.data.forEach(a => {
            assert.strictEqual(a.medium, 'Oil on Linen', 'All filtered artworks must match medium');
        });
        console.log(`[PASS] Medium faceted search verified (${filterOil.data.count} Oil on Linen artworks).\n`);

        // ----------------------------------------------------
        // TEST 4: Artist Submission & Strict Curation Approval
        // ----------------------------------------------------
        console.log('[TEST 4: Curatorial Workflow (Submission -> Curation -> Approval)]');
        const newSubmission = await makeRequest('POST', '/artworks', {
            title: 'Obsidian Monolith',
            medium: 'Bronze Sculpture',
            dimensions: '22 x 14 x 10 inches',
            priceUSD: '3200.00',
            description: 'Hand-cast bronze monolith with oxidized patina finish.'
        }, artistToken);

        assert.strictEqual(newSubmission.status, 201);
        assert.strictEqual(newSubmission.data.data.status, 'PENDING_APPROVAL', 'Artist upload must be PENDING_APPROVAL');
        const submissionId = newSubmission.data.data.artworkId || newSubmission.data.data._id;
        console.log(`[PASS] Artist submission created in state [PENDING_APPROVAL] (ID: ${submissionId}).`);

        // Admin inspects Pending Curation Queue
        const pendingQueue = await makeRequest('GET', '/curation/pending', null, adminToken);
        assert.strictEqual(pendingQueue.status, 200);
        const inQueue = pendingQueue.data.data.find(a => (a.artworkId === submissionId || a._id === submissionId));
        assert(inQueue !== undefined, 'Submitted artwork must appear in admin pending queue');
        console.log('[PASS] Admin pending curation queue contains the submission.');

        // Admin approves artwork for public exhibition
        const approvalRes = await makeRequest('PUT', `/curation/approve/${submissionId}`, {}, adminToken);
        assert.strictEqual(approvalRes.status, 200);
        assert.strictEqual(approvalRes.data.data.status, 'AVAILABLE', 'Approved artwork status must be AVAILABLE');
        assert(approvalRes.data.data.certificateOfAuthenticity.issued, 'COA must be issued upon approval');
        console.log('[PASS] Admin approved submission; status transitioned to [AVAILABLE] with Certificate of Authenticity.\n');

        // ----------------------------------------------------
        // TEST 5: Collector Checkout & Inventory Lock
        // ----------------------------------------------------
        console.log('[TEST 5: Collector Checkout & Inventory Reservation Lock]');
        // Purchase ART-001 (Solitude in Cobalt)
        const orderRes = await makeRequest('POST', '/orders', {
            items: ['ART-001'],
            shippingAddress: {
                street: '742 Evergreen Terrace',
                city: 'Springfield',
                postalCode: '97477',
                country: 'United States'
            },
            paymentMethod: 'STRIPE_CARD'
        }, collectorToken);

        assert.strictEqual(orderRes.status, 201, 'Order placement must return 201');
        assert.strictEqual(orderRes.data.order.totalCents, 240000, 'Total must equal $2,400.00 in integer cents');
        const orderId = orderRes.data.order.orderId || orderRes.data.order._id;
        console.log(`[PASS] Order [${orderId}] confirmed for $2,400.00 (240000 cents).`);

        // Verify Inventory Invariant Lock: ART-001 must now be RESERVED and stock = 0
        const art001Check = await makeRequest('GET', '/artworks/ART-001');
        assert.strictEqual(art001Check.status, 200);
        assert.strictEqual(art001Check.data.data.status, 'RESERVED', 'Artwork must transition to RESERVED upon purchase');
        assert.strictEqual(art001Check.data.data.stock, 0, 'Artwork stock must decrement to 0');
        console.log('[PASS] Inventory Lockout verified: ART-001 is now [RESERVED], stock is 0.');

        // Verify Conflict: Trying to purchase ART-001 again must fail with 409 Conflict
        const conflictOrder = await makeRequest('POST', '/orders', {
            items: ['ART-001'],
            shippingAddress: {
                street: '123 Duplicate Lane',
                city: 'Metropolis',
                postalCode: '10001'
            }
        }, collectorToken);
        assert.strictEqual(conflictOrder.status, 409, 'Double-purchasing reserved art must return 409 Conflict');
        console.log('[PASS] Double-purchasing prevented with HTTP 409 Acquisition Conflict.\n');

        // ----------------------------------------------------
        // TEST 6: Order Fulfillment & Delivery Lifecycle
        // ----------------------------------------------------
        console.log('[TEST 6: Order Fulfillment Pipeline (Pending -> Delivered -> Sold)]');
        const myOrders = await makeRequest('GET', '/orders/my-orders', null, collectorToken);
        assert.strictEqual(myOrders.status, 200);
        assert(myOrders.data.count >= 1, 'Collector must see their order');
        console.log(`[PASS] Collector order history verified (${myOrders.data.count} order recorded).`);

        // Admin updates status to DELIVERED
        const deliverRes = await makeRequest('PUT', `/orders/${orderId}/status`, {
            shippingStatus: 'DELIVERED',
            trackingNumber: 'TRACK-AG-998822'
        }, adminToken);
        assert.strictEqual(deliverRes.status, 200);
        assert.strictEqual(deliverRes.data.order.shippingStatus, 'DELIVERED');

        // Verify permanent state transition to SOLD
        const artSoldCheck = await makeRequest('GET', '/artworks/ART-001');
        assert.strictEqual(artSoldCheck.data.data.status, 'SOLD', 'Artwork must transition to SOLD upon delivery');
        console.log('[PASS] Order fulfillment completed: Shipping marked [DELIVERED], artwork permanently marked [SOLD].\n');

        // ----------------------------------------------------
        // TEST 7: Verified Collector Review & Rating Submission
        // ----------------------------------------------------
        console.log('[TEST 7: Collector Review & Rating Pipeline]');
        const reviewRes = await makeRequest('POST', '/reviews', {
            artworkId: 'ART-001',
            rating: 5,
            comment: 'Exceptional museum glaze and profound architectural presence.'
        }, collectorToken);
        assert.strictEqual(reviewRes.status, 201);
        assert.strictEqual(reviewRes.data.data.rating, 5);
        console.log('[PASS] Verified review submitted successfully.');

        const getReviews = await makeRequest('GET', '/reviews/artwork/ART-001');
        assert.strictEqual(getReviews.status, 200);
        assert(getReviews.data.count >= 1, 'Review count must be at least 1');
        console.log(`[PASS] Artwork reviews stream verified (${getReviews.data.count} review retrieved).\n`);

        console.log('==================================================');
        console.log('[PASS] All Core REST API Integration Tests Succeeded (100% Green)');
        console.log('==================================================');

    } finally {
        server.close();
    }
}

runApiIntegrationTests()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('[FAIL] API integration test failed:', err);
        process.exit(1);
    });
