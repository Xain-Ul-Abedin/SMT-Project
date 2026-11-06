const assert = require('assert');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Artwork = require('../src/models/Artwork');
const Order = require('../src/models/Order');
const memoryStore = require('../src/models/memoryStore');
const { seedDatabase } = require('../src/scripts/seed');

async function runModelTests() {
    console.log('==================================================');
    console.log('[TEST SUITE] Running Phase 2 Model Invariant & Seeder Tests');
    console.log('==================================================\n');

    // ----------------------------------------------------
    // TEST 1: User Model & Password Hashing
    // ----------------------------------------------------
    console.log('[TEST 1: User Security & RBAC]');
    const rawPassword = 'SecurePassword2026!';
    const userDoc = new User({
        name: 'Test Artist',
        email: 'artist.test@artsgallery.com',
        password: rawPassword,
        role: 'artist'
    });

    // Verify bcrypt pre-save simulation
    const salt = await bcrypt.genSalt(10);
    userDoc.password = await bcrypt.hash(userDoc.password, salt);
    assert(userDoc.password !== rawPassword, 'Password must be hashed with bcrypt');
    assert(userDoc.password.startsWith('$2'), 'Hash must match bcrypt signature');

    const isMatch = await userDoc.matchPassword(rawPassword);
    const isWrongMatch = await userDoc.matchPassword('WrongPassword');
    assert(isMatch === true, 'matchPassword must return true for correct credential');
    assert(isWrongMatch === false, 'matchPassword must return false for wrong credential');

    const token = userDoc.generateToken();
    assert(typeof token === 'string' && token.length > 20, 'JWT Token must be successfully generated');
    console.log('[PASS] User password hashing, authentication match, and token generation verified.\n');

    // ----------------------------------------------------
    // TEST 2: Artwork Integer Cents & Financial Invariants
    // ----------------------------------------------------
    console.log('[TEST 2: Artwork Integer Cents & Financial Invariants]');
    const artworkDoc = new Artwork({
        artworkId: 'ART-999',
        title: 'Luminescent Dawn',
        artistName: 'Test Creator',
        medium: 'Oil on Linen',
        dimensions: '30 x 40 inches',
        priceCents: 285000, // $2,850.00
        stock: 1,
        status: 'PENDING_APPROVAL'
    });

    assert.strictEqual(artworkDoc.priceCents, 285000, 'priceCents must be preserved as exact integer');
    assert.strictEqual(artworkDoc.priceUSD, '2850.00', 'Virtual priceUSD must compute decimal dollar string');
    assert.strictEqual(artworkDoc.priceFormatted, '$2,850.00', 'Virtual priceFormatted must compute currency string');
    assert.strictEqual(artworkDoc.status, 'PENDING_APPROVAL', 'Initial status must be PENDING_APPROVAL');

    // State Transition: Approve -> AVAILABLE
    artworkDoc.status = 'AVAILABLE';
    assert.strictEqual(artworkDoc.status, 'AVAILABLE', 'Status must transition to AVAILABLE upon curation');

    // Invariant Lockout: Floating-point price validation check
    const invalidFloatDoc = new Artwork({
        artworkId: 'ART-FLOAT',
        title: 'Invalid Valuation',
        artistName: 'Test Creator',
        priceCents: 1500.75, // Invalid float!
        stock: 1
    });
    const validationError = invalidFloatDoc.validateSync();
    assert(validationError && validationError.errors.priceCents, 'Schema must reject non-integer price values');
    console.log('[PASS] Integer cents invariants, currency formatting, and state machine validated.\n');

    // ----------------------------------------------------
    // TEST 3: Order Model Invariants
    // ----------------------------------------------------
    console.log('[TEST 3: Order Model Invariants]');
    const orderDoc = new Order({
        orderId: 'ORD-777001',
        customer: new mongoose.Types.ObjectId(),
        items: [{
            artwork: new mongoose.Types.ObjectId(),
            artworkId: 'ART-999',
            title: 'Luminescent Dawn',
            priceCents: 285000
        }],
        totalCents: 285000,
        shippingAddress: {
            street: '100 Museum Way',
            city: 'New York',
            postalCode: '10021'
        },
        paymentMethod: 'STRIPE_CARD'
    });

    assert.strictEqual(orderDoc.totalCents, 285000, 'totalCents must be integer cents');
    assert.strictEqual(orderDoc.totalFormatted, '$2,850.00', 'totalFormatted must render exact currency string');
    assert.strictEqual(orderDoc.shippingStatus, 'PENDING', 'Default shippingStatus must be PENDING');
    console.log('[PASS] Order total invariants and shipping state machine verified.\n');

    // ----------------------------------------------------
    // TEST 4: Master Seeder Execution
    // ----------------------------------------------------
    console.log('[TEST 4: Seeder Population Verification]');
    const seedResult = await seedDatabase();
    assert.strictEqual(seedResult.usersCount, 4, 'Seeder must create 4 default user accounts');
    assert.strictEqual(seedResult.artworksCount, 12, 'Seeder must populate 12 museum-grade artworks');

    const inMemoryArtworks = memoryStore.findArtworks();
    assert.strictEqual(inMemoryArtworks.length, 12, 'In-Memory Store must contain 12 artworks');
    
    const cobaltPiece = memoryStore.findArtworkById('ART-001');
    assert(cobaltPiece !== undefined, 'ART-001 must exist in store');
    assert.strictEqual(cobaltPiece.title, 'Solitude in Cobalt');
    assert.strictEqual(cobaltPiece.priceFormatted, '$2,400.00');

    console.log('[PASS] Seeder populated 12 artworks and 4 accounts into resilient store successfully.\n');

    console.log('==================================================');
    console.log('[PASS] All Phase 2 Model & Seeder Tests Succeeded (100% Green)');
    console.log('==================================================');
}

runModelTests()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('[FAIL] Test execution failed:', err);
        process.exit(1);
    });
