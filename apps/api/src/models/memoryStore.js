/**
 * Dual-Mode In-Memory Dataset Store
 * Provides an active mirror of database collections when MongoDB Atlas is offline,
 * allowing full CRUD operations, authentication, and seeder population out of the box.
 */

class MemoryStore {
    constructor() {
        this.users = [];
        this.artworks = [];
        this.orders = [];
        this.reviews = [];
    }

    clear() {
        this.users = [];
        this.artworks = [];
        this.orders = [];
        this.reviews = [];
    }

    // User Operations
    addUser(userData) {
        const id = `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const user = {
            _id: id,
            id: id,
            ...userData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.users.push(user);
        return user;
    }

    findUserByEmail(email) {
        return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    findUserById(id) {
        return this.users.find(u => u._id === id || u.id === id);
    }

    // Artwork Operations
    addArtwork(artworkData) {
        const id = `art_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const priceCents = Number(artworkData.priceCents);
        const artwork = {
            _id: id,
            id: id,
            ...artworkData,
            priceCents,
            priceUSD: (priceCents / 100).toFixed(2),
            priceFormatted: `$${(priceCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            status: artworkData.status || 'PENDING_APPROVAL',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.artworks.push(artwork);
        return artwork;
    }

    findArtworks(query = {}) {
        let list = [...this.artworks];
        if (query.status) {
            list = list.filter(a => a.status === query.status);
        }
        if (query.medium) {
            list = list.filter(a => a.medium.toLowerCase() === query.medium.toLowerCase());
        }
        if (query.featured !== undefined) {
            list = list.filter(a => a.featured === query.featured);
        }
        return list;
    }

    findArtworkById(artworkId) {
        return this.artworks.find(a => a.artworkId === artworkId || a._id === artworkId || a.id === artworkId);
    }

    updateArtwork(artworkId, updates) {
        const idx = this.artworks.findIndex(a => a.artworkId === artworkId || a._id === artworkId);
        if (idx === -1) return null;
        
        const current = this.artworks[idx];
        const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
        if (updates.priceCents) {
            const cents = Number(updates.priceCents);
            updated.priceUSD = (cents / 100).toFixed(2);
            updated.priceFormatted = `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
        if (updated.stock === 0 && updated.status === 'AVAILABLE') {
            updated.status = 'SOLD';
        }
        this.artworks[idx] = updated;
        return updated;
    }

    // Order Operations
    addOrder(orderData) {
        const id = `ord_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const totalCents = Number(orderData.totalCents);
        const status = orderData.shippingStatus || orderData.status || 'PENDING';
        const order = {
            _id: id,
            id: id,
            orderId: id,
            ...orderData,
            status,
            shippingStatus: status,
            subtotalCents: totalCents,
            totalCents,
            totalUSD: (totalCents / 100).toFixed(2),
            totalFormatted: `$${(totalCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.orders.push(order);
        return order;
    }

    findOrders(query = {}) {
        let list = [...this.orders];
        if (query.customer) {
            list = list.filter(o => o.customer === query.customer || (o.customer && o.customer._id === query.customer));
        }
        return list;
    }

    // Review Operations
    addReview(reviewData) {
        const id = `rev_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const review = {
            _id: id,
            id: id,
            ...reviewData,
            createdAt: new Date().toISOString()
        };
        this.reviews.push(review);
        return review;
    }

    findReviewsByArtwork(artworkId) {
        return this.reviews.filter(r => r.artworkId === artworkId);
    }
}

const memoryStore = new MemoryStore();
module.exports = memoryStore;
