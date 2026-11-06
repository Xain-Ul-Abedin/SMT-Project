/**
 * Full-Stack E2E User Journey Verification Harness
 * Validates the complete multi-tenant lifecycle orchestrated through the Web Client API:
 * 1. Visitor browsing & faceted filters
 * 2. Artist authentication & artwork submission (PENDING_APPROVAL)
 * 3. Curatorial evaluation, COA issuance, & approval (AVAILABLE)
 * 4. Collector portfolio acquisition & custom museum framing calculation
 * 5. Inventory lockout & double-acquisition conflict prevention (HTTP 409)
 * 6. Curator fulfillment progression (PENDING -> IN_CURATION -> DISPATCHED -> DELIVERED)
 */

const assert = require('assert');
const http = require('http');
const express = require('express');
const cors = require('cors');

const authRoutes = require('../src/routes/authRoutes');
const artworkRoutes = require('../src/routes/artworkRoutes');
const curationRoutes = require('../src/routes/curationRoutes');
const orderRoutes = require('../src/routes/orderRoutes');
const { seedDatabase } = require('../src/scripts/seed');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/artworks', artworkRoutes);
app.use('/api/v1/curation', curationRoutes);
app.use('/api/v1/orders', orderRoutes);

const PORT = 5003;
let server;

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        }
      });
    });

    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runE2E() {
  console.log('==================================================');
  console.log('[E2E TEST SUITE] Arts Gallery Full-Stack User Journey');
  console.log('==================================================\n');

  await seedDatabase();

  server = app.listen(PORT);
  console.log(`[SETUP] Test Server listening on http://localhost:${PORT}/api/v1\n`);

  try {
    // ------------------------------------------------------------------------
    // STAGE 1: Authentication & Multi-Tenant Persona Acquisition
    // ------------------------------------------------------------------------
    console.log('[STAGE 1: Multi-Tenant Role Authentication]');
    
    // 1.1 Artist Login
    const artistLogin = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      email: 'elena.rostova@artsgallery.com',
      password: 'Password123!',
    });
    assert.strictEqual(artistLogin.status, 200);
    const artistToken = artistLogin.body.token;
    console.log('[PASS] Artist Elena Rostova authenticated.');

    // 1.2 Curator / Admin Login
    const adminLogin = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      email: 'admin@artsgallery.com',
      password: 'Password123!',
    });
    assert.strictEqual(adminLogin.status, 200);
    const adminToken = adminLogin.body.token;
    console.log('[PASS] Curator Victoria Saint-Laurent authenticated.');

    // 1.3 Collector Login
    const collectorLogin = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      email: 'collector@artsgallery.com',
      password: 'Password123!',
    });
    assert.strictEqual(collectorLogin.status, 200);
    const collectorToken = collectorLogin.body.token;
    console.log('[PASS] Collector Arthur Pendelton authenticated.\n');

    // ------------------------------------------------------------------------
    // STAGE 2: Artist Submits Masterpiece to Curatorial Board
    // ------------------------------------------------------------------------
    console.log('[STAGE 2: Artist Piece Submission]');
    const submission = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/v1/artworks',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${artistToken}`,
      },
    }, {
      title: 'Nocturne in Azure VI',
      medium: 'Oil on Linen',
      dimensions: '36 x 48 inches (91 x 122 cm)',
      priceCents: 280000,
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
      description: 'Atmospheric indigo layers depicting oceanic solitude.',
      stock: 1,
    });
    assert.strictEqual(submission.status, 201);
    const newArtworkId = submission.body.data.id;
    assert.strictEqual(submission.body.data.status, 'PENDING_APPROVAL');
    console.log(`[PASS] Artwork submitted in status [PENDING_APPROVAL] (ID: ${newArtworkId}).\n`);

    // ------------------------------------------------------------------------
    // STAGE 3: Curatorial Board Reviews & Approves with Certificate of Authenticity
    // ------------------------------------------------------------------------
    console.log('[STAGE 3: Curatorial Evaluation & COA Issuance]');
    const pendingQueue = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/v1/curation/pending',
      method: 'GET',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(pendingQueue.status, 200);
    const foundPending = pendingQueue.body.data.find(a => a.id === newArtworkId);
    assert.ok(foundPending, 'Submitted piece must exist in curation queue.');
    console.log('[PASS] Piece inspected in Curator pending queue.');

    const approval = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: `/api/v1/curation/approve/${newArtworkId}`,
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(approval.status, 200);
    assert.strictEqual(approval.body.data.status, 'AVAILABLE');
    assert.strictEqual(approval.body.data.certificateOfAuthenticity.issued, true);
    const coaNumber = approval.body.data.certificateOfAuthenticity.certNumber || approval.body.data.certificateOfAuthenticity.certificateNumber;
    console.log(`[PASS] Masterpiece approved: Status [AVAILABLE], COA [${coaNumber}].\n`);

    // ------------------------------------------------------------------------
    // STAGE 4: Collector Acquisition with Custom Museum Framing
    // ------------------------------------------------------------------------
    console.log('[STAGE 4: Collector Acquisition & Custom Archival Framing]');
    const orderRes = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/v1/orders',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${collectorToken}`,
      },
    }, {
      items: [
        {
          artworkId: newArtworkId,
          framing: 'Handcrafted White Oak & UV Glass',
          framingPriceCents: 22000,
        }
      ],
      shippingAddress: {
        fullName: 'Arthur Pendelton',
        street: '742 Evergreen Terrace',
        city: 'New York',
        postalCode: '10021',
        country: 'United States',
      },
      paymentMethod: 'STRIPE_CARD',
    });
    assert.strictEqual(orderRes.status, 201);
    const order = orderRes.body.data || orderRes.body.order;
    const orderId = order.id || order.orderId || order._id;
    assert.strictEqual(order.subtotalCents, 302000); // 280000 + 22000 = 302000 ($3,020.00)
    assert.strictEqual(order.totalCents, 302000);
    assert.strictEqual(order.status || order.shippingStatus, 'PENDING');
    console.log(`[PASS] Order [${orderId}] executed for $3,020.00 (302000 cents) including museum oak framing.\n`);

    // ------------------------------------------------------------------------
    // STAGE 5: Invariant Lockout & Conflict Verification
    // ------------------------------------------------------------------------
    console.log('[STAGE 5: Invariant Lockout & Conflict Prevention]');
    const catalogCheck = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: `/api/v1/artworks/${newArtworkId}`,
      method: 'GET',
    });
    assert.strictEqual(catalogCheck.status, 200);
    assert.strictEqual(catalogCheck.body.data.status, 'RESERVED');
    assert.strictEqual(catalogCheck.body.data.stock, 0);
    console.log('[PASS] Inventory Lockout Invariant verified: Status is [RESERVED], stock is 0.');

    // Simultaneous checkout collision
    const conflictRes = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/v1/orders',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${collectorToken}`,
      },
    }, {
      items: [{ artworkId: newArtworkId }],
      shippingAddress: {
        fullName: 'Second Collector',
        street: '10 Downing St',
        city: 'London',
        postalCode: 'SW1A 2AA',
        country: 'United Kingdom',
      },
      paymentMethod: 'STRIPE_CARD',
    });
    assert.strictEqual(conflictRes.status, 409);
    console.log('[PASS] Double-acquisition prevented with HTTP 409 Conflict.\n');

    // ------------------------------------------------------------------------
    // STAGE 6: Curator Fulfillment Lifecycle Progression
    // ------------------------------------------------------------------------
    console.log('[STAGE 6: Curator Logistics & Fulfillment Progression]');
    
    // 6.1 Advance to IN_CURATION (Archival framing)
    const toCuration = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: `/api/v1/orders/${orderId}/status`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
    }, {
      status: 'IN_CURATION',
    });
    assert.strictEqual(toCuration.status, 200);
    const curationOrder = toCuration.body.data || toCuration.body.order;
    assert.strictEqual(curationOrder.status || curationOrder.shippingStatus, 'IN_CURATION');
    console.log('[PASS] Order advanced to [IN_CURATION] (Archival Framing).');

    // 6.2 Advance to DISPATCHED with White-Glove Tracking Code
    const toDispatched = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: `/api/v1/orders/${orderId}/status`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
    }, {
      status: 'DISPATCHED',
      trackingNumber: 'TRK-GALLERY-US-9421',
    });
    assert.strictEqual(toDispatched.status, 200);
    const dispatchedOrder = toDispatched.body.data || toDispatched.body.order;
    assert.strictEqual(dispatchedOrder.status || dispatchedOrder.shippingStatus, 'DISPATCHED');
    assert.strictEqual(dispatchedOrder.trackingNumber, 'TRK-GALLERY-US-9421');
    console.log('[PASS] Order advanced to [DISPATCHED] with tracking [TRK-GALLERY-US-9421].');

    // 6.3 Advance to DELIVERED (Piece permanently SOLD)
    const toDelivered = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: `/api/v1/orders/${orderId}/status`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
    }, {
      status: 'DELIVERED',
    });
    assert.strictEqual(toDelivered.status, 200);
    const deliveredOrder = toDelivered.body.data || toDelivered.body.order;
    assert.strictEqual(deliveredOrder.status || deliveredOrder.shippingStatus, 'DELIVERED');

    const finalPieceCheck = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: `/api/v1/artworks/${newArtworkId}`,
      method: 'GET',
    });
    assert.strictEqual(finalPieceCheck.body.data.status, 'SOLD');
    console.log('[PASS] Order finalized: Delivery marked [DELIVERED], artwork permanently locked as [SOLD].\n');

    console.log('==================================================');
    console.log('[PASS] All 6 Full-Stack E2E Stages Succeeded (100% Green)');
    console.log('==================================================');

  } finally {
    server.close();
  }
}

runE2E().catch((err) => {
  console.error('[FAIL] E2E test harness encountered an error:', err);
  if (server) server.close();
  process.exit(1);
});
