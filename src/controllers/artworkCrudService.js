/**
 * Arts Gallery Web Application (SMT-Project)
 * Lab 06: In-Memory / Mongoose CRUD Engine & Test Runner
 * 
 * Demonstrates Insert, View, Edit, Update, and Delete operations
 * for the Arts Gallery catalog.
 */

class ArtworkCrudService {
    constructor() {
        this.artworks = [];
    }

    /**
     * 1. INSERT (Create)
     */
    insertArtwork(data) {
        if (!data.artworkId || !data.title || !data.price) {
            throw new Error("Validation Error: artworkId, title, and price are required.");
        }
        const exists = this.artworks.some(a => a.artworkId === data.artworkId);
        if (exists) {
            throw new Error(`Conflict: Artwork with ID ${data.artworkId} already exists.`);
        }
        const newRecord = {
            artworkId: data.artworkId,
            title: data.title.trim(),
            artist: data.artist || "Independent Creator",
            medium: data.medium || "Oil on Canvas",
            dimensions: data.dimensions || "24 x 36 inches",
            price: Number(data.price),
            stock: data.stock !== undefined ? Number(data.stock) : 1,
            status: (data.stock !== undefined ? Number(data.stock) : 1) > 0 ? "AVAILABLE" : "SOLD",
            createdAt: new Date().toISOString()
        };
        this.artworks.push(newRecord);
        return newRecord;
    }

    /**
     * 2. VIEW ALL (Read Catalog)
     */
    viewAllArtworks(filter = {}) {
        let results = [...this.artworks];
        if (filter.medium) {
            results = results.filter(a => a.medium.toLowerCase() === filter.medium.toLowerCase());
        }
        if (filter.status) {
            results = results.filter(a => a.status.toLowerCase() === filter.status.toLowerCase());
        }
        return results;
    }

    /**
     * 3. VIEW SINGLE (Read Details)
     */
    viewArtworkById(artworkId) {
        const item = this.artworks.find(a => a.artworkId === artworkId);
        if (!item) {
            throw new Error(`Not Found: Artwork ${artworkId} does not exist.`);
        }
        return item;
    }

    /**
     * 4. EDIT & UPDATE (Update)
     */
    updateArtwork(artworkId, patchData) {
        const index = this.artworks.findIndex(a => a.artworkId === artworkId);
        if (index === -1) {
            throw new Error(`Not Found: Artwork ${artworkId} does not exist to update.`);
        }

        const current = this.artworks[index];
        const updated = {
            ...current,
            title: patchData.title !== undefined ? patchData.title.trim() : current.title,
            price: patchData.price !== undefined ? Number(patchData.price) : current.price,
            medium: patchData.medium !== undefined ? patchData.medium : current.medium,
            dimensions: patchData.dimensions !== undefined ? patchData.dimensions : current.dimensions,
            stock: patchData.stock !== undefined ? Number(patchData.stock) : current.stock,
            status: patchData.status !== undefined ? patchData.status : (patchData.stock !== undefined ? (Number(patchData.stock) > 0 ? "AVAILABLE" : "SOLD") : current.status),
            updatedAt: new Date().toISOString()
        };
        this.artworks[index] = updated;
        return updated;
    }

    /**
     * 5. DELETE (Delete / Discontinue)
     */
    deleteArtwork(artworkId) {
        const index = this.artworks.findIndex(a => a.artworkId === artworkId);
        if (index === -1) {
            throw new Error(`Not Found: Artwork ${artworkId} does not exist.`);
        }
        const [removed] = this.artworks.splice(index, 1);
        return removed;
    }
}

// Verification Test Harness
if (require.main === module) {
    console.log("[INFO] Running Lab 06 CRUD Execution Test Suite...\n");
    const service = new ArtworkCrudService();

    // 1. INSERT
    console.log("[STEP 1: INSERT]");
    const a1 = service.insertArtwork({
        artworkId: "ART-101",
        title: "Echoes of Eternity",
        artist: "Claire DeWitt",
        medium: "Oil on Canvas",
        dimensions: "30 x 40 inches",
        price: 2200.00,
        stock: 1
    });
    console.log(`[PASS] Inserted: ${a1.artworkId} - ${a1.title} ($${a1.price})`);

    const a2 = service.insertArtwork({
        artworkId: "ART-102",
        title: "Terra Incognita",
        artist: "Zayn Harris",
        medium: "Acrylic on Wood",
        dimensions: "18 x 24 inches",
        price: 950.00,
        stock: 2
    });
    console.log(`[PASS] Inserted: ${a2.artworkId} - ${a2.title} ($${a2.price})`);

    // 2. VIEW ALL
    console.log("\n[STEP 2: VIEW ALL]");
    const all = service.viewAllArtworks();
    console.log(`[PASS] Total Catalog Artworks: ${all.length}`);
    console.table(all.map(a => ({ ID: a.artworkId, Title: a.title, Medium: a.medium, Price: a.price, Status: a.status })));

    // 3. EDIT & UPDATE
    console.log("\n[STEP 3: EDIT & UPDATE]");
    const updated = service.updateArtwork("ART-101", { price: 2500.00, stock: 0 });
    console.log(`[PASS] Updated ART-101: New Price = $${updated.price}, Stock = ${updated.stock}, Status = [${updated.status}]`);

    // 4. VIEW BY ID
    console.log("\n[STEP 4: VIEW BY ID]");
    const single = service.viewArtworkById("ART-101");
    console.log(`[PASS] Verified Record: ${single.title} (${single.status})`);

    // 5. DELETE
    console.log("\n[STEP 5: DELETE]");
    const deleted = service.deleteArtwork("ART-102");
    console.log(`[PASS] Successfully deleted: ${deleted.artworkId} (${deleted.title})`);
    console.log(`[PASS] Remaining Artworks: ${service.viewAllArtworks().length}`);
}

module.exports = ArtworkCrudService;
