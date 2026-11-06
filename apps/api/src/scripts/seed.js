const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const Artwork = require('../models/Artwork');
const Order = require('../models/Order');
const Review = require('../models/Review');
const memoryStore = require('../models/memoryStore');
const { getDbState, connectDB } = require('../config/db');

const seedUsers = [
    {
        name: 'Gallery Administrator',
        email: 'admin@artsgallery.com',
        password: 'Password123!',
        role: 'admin',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
        artistProfile: {
            bio: 'Principal Curator & Director of Atelier Acquisitions.',
            verified: true
        }
    },
    {
        name: 'Elena Rostova',
        email: 'elena.rostova@artsgallery.com',
        password: 'Password123!',
        role: 'artist',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        artistProfile: {
            bio: 'Classical realist and atmospheric colorist based in Florence and Vienna.',
            statement: 'Light is not merely illumination; it is the silent architecture of emotional memory.',
            portfolioUrl: 'https://elenarostova.art',
            verified: true
        }
    },
    {
        name: 'Marcus Vance',
        email: 'marcus.vance@artsgallery.com',
        password: 'Password123!',
        role: 'artist',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        artistProfile: {
            bio: 'Contemporary abstract expressionist exploring architectural deconstruction and brutalist textures.',
            statement: 'Substance over ornament. Raw canvas meets intentional geometry.',
            portfolioUrl: 'https://marcusvance.studio',
            verified: true
        }
    },
    {
        name: 'Sarah Jenkins',
        email: 'collector@artsgallery.com',
        password: 'Password123!',
        role: 'customer',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
    }
];

const seedArtworks = [
    {
        artworkId: 'ART-001',
        title: 'Solitude in Cobalt',
        artistName: 'Elena Rostova',
        medium: 'Oil on Linen',
        dimensions: '36 x 48 inches',
        priceCents: 240000,
        stock: 1,
        status: 'AVAILABLE',
        featured: true,
        images: [
            'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80'
        ],
        description: 'A study of deep cobalt hues and contemplative silence. Multi-layered oil glazes on Belgian linen create profound depth and subtle luminescence under natural gallery lighting.',
        provenance: 'Executed in the artist studio in Florence, 2026. Certified authentic by Arts Gallery Curation.',
        framingOptions: 'Custom Walnut Float Frame'
    },
    {
        artworkId: 'ART-002',
        title: 'Architectural Mirage IV',
        artistName: 'Marcus Vance',
        medium: 'Acrylic on Canvas',
        dimensions: '24 x 36 inches',
        priceCents: 165000,
        stock: 1,
        status: 'AVAILABLE',
        featured: true,
        images: [
            'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80'
        ],
        description: 'Vibrant geometric abstractions balancing raw impasto textures against disciplined architectural lines. Explores urban density and fragmented light.',
        provenance: 'Exhibited at Berlin Modern Art Salon, Summer 2026.',
        framingOptions: 'Matte Obsidian Gallery Frame'
    },
    {
        artworkId: 'ART-003',
        title: 'Ethereal Topographies',
        artistName: 'Aria Chen',
        medium: 'Digital Fine Art',
        dimensions: '30 x 40 inches (Giclée)',
        priceCents: 98000,
        stock: 0,
        status: 'RESERVED',
        featured: true,
        images: [
            'https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=1200&q=80'
        ],
        description: 'Algorithmic elevation model blended with generative mineral pigments. Museum-grade archival pigment print on Hahnemühle Photo Rag paper.',
        provenance: 'Digital master file cryptographically signed; 1 of 5 limited edition release.',
        framingOptions: 'Museum Acrylic Case'
    },
    {
        artworkId: 'ART-004',
        title: 'Gilded Horizon',
        artistName: 'Elena Rostova',
        medium: 'Oil on Linen',
        dimensions: '40 x 60 inches',
        priceCents: 380000,
        stock: 1,
        status: 'AVAILABLE',
        featured: false,
        images: [
            'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
        ],
        description: 'Extensive hand-applied 24-karat gold leaf beneath semi-translucent oil washes depicting maritime dawn off the Amalfi coast.',
        provenance: 'Direct studio acquisition. Private salon preview piece.',
        framingOptions: 'Custom Walnut Float Frame'
    },
    {
        artworkId: 'ART-005',
        title: 'Monochrome Fracture',
        artistName: 'Marcus Vance',
        medium: 'Charcoal & Acrylic',
        dimensions: '30 x 30 inches',
        priceCents: 120000,
        stock: 1,
        status: 'AVAILABLE',
        featured: false,
        images: [
            'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80'
        ],
        description: 'High-contrast charcoal dusting combined with fluid acrylics. A visual meditation on tectonic stillness and seismic tension.',
        provenance: 'Created for the London Abstract Series, 2026.',
        framingOptions: 'Matte Obsidian Gallery Frame'
    },
    {
        artworkId: 'ART-006',
        title: 'Botanical Whispers II',
        artistName: 'Sophia Al-Mansoor',
        medium: 'Watercolor on Cold-Press',
        dimensions: '20 x 28 inches',
        priceCents: 75000,
        stock: 1,
        status: 'AVAILABLE',
        featured: false,
        images: [
            'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1200&q=80'
        ],
        description: 'Delicate botanical studies on 640gsm handmade Arches cold-press cotton paper. Pigments derived from natural lapis lazuli and ochre.',
        provenance: 'Cataloged in botanical watercolor symposium, 2026.',
        framingOptions: 'Custom Walnut Float Frame'
    },
    {
        artworkId: 'ART-007',
        title: 'Temporal Continuum',
        artistName: 'Julian Thorne',
        medium: 'Bronze Sculpture',
        dimensions: '18 x 12 x 12 inches (Weight: 14 kg)',
        priceCents: 450000,
        stock: 1,
        status: 'AVAILABLE',
        featured: false,
        images: [
            'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80'
        ],
        description: 'Lost-wax cast bronze sculpture mounted on polished Nero Marquina marble plinth. Kinetic Möbius-inspired twist capturing shifting light.',
        provenance: 'Foundry casting #2 of 3, Verona Foundry.',
        framingOptions: 'Museum Acrylic Case'
    },
    {
        artworkId: 'ART-008',
        title: 'Subterranean Light',
        artistName: 'Aria Chen',
        medium: 'Digital Fine Art',
        dimensions: '24 x 36 inches',
        priceCents: 89000,
        stock: 1,
        status: 'AVAILABLE',
        featured: false,
        images: [
            'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80'
        ],
        description: 'Volumetric raymarching of crystalline cave formations. Printed with archival ultrachrome inks on metallic rag paper.',
        provenance: 'Original digital render minted and printed, 2026.',
        framingOptions: 'Matte Obsidian Gallery Frame'
    },
    {
        artworkId: 'ART-009',
        title: 'Verdant Synthesis',
        artistName: 'Elena Rostova',
        medium: 'Oil on Linen',
        dimensions: '36 x 36 inches',
        priceCents: 210000,
        stock: 1,
        status: 'AVAILABLE',
        featured: false,
        images: [
            'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?auto=format&fit=crop&w=1200&q=80'
        ],
        description: 'Emerald and malachite tones interwoven with cadmium highlights. Depicts primordial forest canopies through impressionist impasto work.',
        provenance: 'Studio Elena, Vienna, 2026.',
        framingOptions: 'Custom Walnut Float Frame'
    },
    {
        artworkId: 'ART-010',
        title: 'Brutalist Silhouette',
        artistName: 'Marcus Vance',
        medium: 'Acrylic on Canvas',
        dimensions: '48 x 48 inches',
        priceCents: 295000,
        stock: 1,
        status: 'AVAILABLE',
        featured: false,
        images: [
            'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80'
        ],
        description: 'Heavy textured paste and slate grey pigments across wide unprimed canvas. Evokes monolithic modernist concrete structures.',
        provenance: 'Solo exhibition centerpiece, Zurich, 2026.',
        framingOptions: 'Unframed Canvas'
    },
    {
        artworkId: 'ART-011',
        title: 'Cerulean Tides',
        artistName: 'Sophia Al-Mansoor',
        medium: 'Watercolor on Cold-Press',
        dimensions: '22 x 30 inches',
        priceCents: 82000,
        stock: 1,
        status: 'AVAILABLE',
        featured: false,
        images: [
            'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80'
        ],
        description: 'Controlled wet-on-wet watercolor technique portraying tidal swells at dusk. Natural deckled edge preserved.',
        provenance: 'Acquired through Emirates Contemporary Art Foundation.',
        framingOptions: 'Custom Walnut Float Frame'
    },
    {
        artworkId: 'ART-012',
        title: 'Crystalline Resonance',
        artistName: 'Julian Thorne',
        medium: 'Cast Glass & Steel',
        dimensions: '14 x 10 x 8 inches',
        priceCents: 320000,
        stock: 1,
        status: 'AVAILABLE',
        featured: false,
        images: [
            'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80'
        ],
        description: 'Kiln-cast optical glass bonded to precision-milled brushed stainless steel. Refracts spectral chromatic dispersions across surrounding interior surfaces.',
        provenance: 'Studio edition 1 of 1, Thorne Glassworks, 2026.',
        framingOptions: 'Museum Acrylic Case'
    }
];

async function seedDatabase() {
    console.log('==================================================');
    console.log('[SEEDER] Initializing Arts Gallery Master Seeder...');
    console.log('==================================================');

    const dbState = getDbState();
    const isMongoConnected = dbState.mode === 'MONGODB_CLUSTER' && mongoose.connection.readyState === 1;

    // 1. Seed In-Memory Store Always
    memoryStore.clear();
    console.log('[SEEDER] Seeding In-Memory Resilient Store...');

    const memoryUsers = [];
    for (const u of seedUsers) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        const user = memoryStore.addUser({ ...u, password: hashedPassword });
        memoryUsers.push(user);
    }
    console.log(`[PASS] In-Memory Users Seeded: ${memoryUsers.length}`);

    const memoryArtworks = [];
    for (const a of seedArtworks) {
        const creator = memoryUsers.find(u => u.name === a.artistName) || memoryUsers[1];
        const art = memoryStore.addArtwork({ ...a, artist: creator._id });
        memoryArtworks.push(art);
    }
    console.log(`[PASS] In-Memory Artworks Seeded: ${memoryArtworks.length}`);

    // Add sample review
    memoryStore.addReview({
        customer: memoryUsers[3]._id,
        customerName: memoryUsers[3].name,
        artwork: memoryArtworks[0]._id,
        artworkId: memoryArtworks[0].artworkId,
        rating: 5,
        comment: 'Exquisite depth of color. The cobalt tones are even more captivating in person under morning light.',
        isVerifiedPurchase: true
    });
    console.log('[PASS] In-Memory Sample Reviews Seeded: 1');

    // 2. If MongoDB Atlas is Connected, Seed Database Collections
    if (isMongoConnected) {
        console.log('\n[SEEDER] MongoDB Cluster detected. Synchronizing persistent collections...');
        
        await User.deleteMany({});
        await Artwork.deleteMany({});
        await Order.deleteMany({});
        await Review.deleteMany({});

        const createdUsers = await User.create(seedUsers);
        console.log(`[PASS] MongoDB Users Inserted: ${createdUsers.length}`);

        const artworksToInsert = seedArtworks.map(a => {
            const creator = createdUsers.find(u => u.name === a.artistName) || createdUsers[1];
            return { ...a, artist: creator._id };
        });

        const createdArtworks = await Artwork.create(artworksToInsert);
        console.log(`[PASS] MongoDB Artworks Inserted: ${createdArtworks.length}`);

        await Review.create({
            customer: createdUsers[3]._id,
            customerName: createdUsers[3].name,
            artwork: createdArtworks[0]._id,
            artworkId: createdArtworks[0].artworkId,
            rating: 5,
            comment: 'Exquisite depth of color. The cobalt tones are even more captivating in person under morning light.',
            isVerifiedPurchase: true
        });
        console.log('[PASS] MongoDB Sample Reviews Inserted: 1');
    }

    console.log('\n==================================================');
    console.log('[PASS] Arts Gallery Catalog Seeding Complete');
    console.log(`[INFO] Total Museum Artworks Available: ${seedArtworks.length}`);
    console.log(`[INFO] Default Admin Account: admin@artsgallery.com (Password123!)`);
    console.log(`[INFO] Default Collector Account: collector@artsgallery.com (Password123!)`);
    console.log('==================================================\n');

    return {
        usersCount: seedUsers.length,
        artworksCount: seedArtworks.length
    };
}

// Standalone execution entry
if (require.main === module) {
    (async () => {
        await connectDB();
        await seedDatabase();
        process.exit(0);
    })();
}

module.exports = { seedDatabase, seedUsers, seedArtworks };
