/**
 * Arts Gallery Web Application (SMT-Project)
 * Lab 05: Object-Oriented Domain Entity
 * 
 * Demonstrates strict OOP encapsulation, private fields,
 * parameterized constructor, and formatting display functions.
 */

class Artwork {
    // Private member fields
    #id;
    #title;
    #price;
    #stock;
    #medium;
    #dimensions;
    #artistName;
    #status;

    /**
     * Parameterized Constructor
     * @param {string} id - Unique artwork identifier (e.g. ART-101)
     * @param {string} title - Artwork masterpiece title
     * @param {number} price - Retail valuation in USD
     * @param {number} stock - Available original inventory units
     * @param {string} medium - Artistic medium (Oil, Acrylic, Watercolor, Digital, Canvas)
     * @param {string} dimensions - Physical dimensions (e.g. "36 x 48 inches")
     * @param {string} artistName - Name of the creator
     */
    constructor(id, title, price, stock, medium, dimensions, artistName) {
        if (!id || typeof id !== 'string') {
            throw new Error("Validation Error: Artwork ID must be a non-empty string.");
        }
        if (!title || typeof title !== 'string') {
            throw new Error("Validation Error: Artwork title is mandatory.");
        }
        if (typeof price !== 'number' || price <= 0) {
            throw new Error("Validation Error: Artwork price must be a positive number.");
        }
        if (typeof stock !== 'number' || stock < 0) {
            throw new Error("Validation Error: Inventory stock cannot be negative.");
        }

        this.#id = id;
        this.#title = title.trim();
        this.#price = price;
        this.#stock = stock;
        this.#medium = medium || "Oil on Canvas";
        this.#dimensions = dimensions || "24 x 36 inches";
        this.#artistName = artistName || "Independent Artist";
        this.#status = stock > 0 ? "AVAILABLE" : "SOLD";
    }

    // Public Getters (Encapsulation Accessors)
    getId() { return this.#id; }
    getTitle() { return this.#title; }
    getPrice() { return this.#price; }
    getStock() { return this.#stock; }
    getMedium() { return this.#medium; }
    getDimensions() { return this.#dimensions; }
    getArtistName() { return this.#artistName; }
    getStatus() { return this.#status; }

    // Public Mutators with Business Logic
    updatePrice(newPrice) {
        if (typeof newPrice !== 'number' || newPrice <= 0) {
            throw new Error("Invalid Price: Valuation must exceed $0.00.");
        }
        this.#price = newPrice;
    }

    adjustStock(quantityChange) {
        const nextStock = this.#stock + quantityChange;
        if (nextStock < 0) {
            throw new Error("Inventory Lockout: Cannot reduce stock below 0.");
        }
        this.#stock = nextStock;
        this.#status = this.#stock > 0 ? "AVAILABLE" : "SOLD";
    }

    /**
     * Display Function
     * Formats and prints formatted gallery specifications for exhibition cards.
     */
    displayDetails() {
        console.log("==================================================");
        console.log(`ARTWORK MASTER RECORD: [${this.#id}]`);
        console.log("==================================================");
        console.log(`Title:       ${this.#title}`);
        console.log(`Artist:      ${this.#artistName}`);
        console.log(`Medium:      ${this.#medium}`);
        console.log(`Dimensions:  ${this.#dimensions}`);
        console.log(`Price:       $${this.#price.toFixed(2)} USD`);
        console.log(`Stock Count: ${this.#stock} unit(s)`);
        console.log(`Status:      [${this.#status}]`);
        console.log("==================================================\n");
    }

    /**
     * Serialization helper for JSON transmission
     */
    toJSON() {
        return {
            id: this.#id,
            title: this.#title,
            price: this.#price,
            stock: this.#stock,
            medium: this.#medium,
            dimensions: this.#dimensions,
            artistName: this.#artistName,
            status: this.#status
        };
    }
}

// Module verification execution
if (require.main === module) {
    console.log("[INFO] Running Lab 05 Verification Test...\n");
    const piece1 = new Artwork("ART-001", "Midnight Serenade", 1450.00, 1, "Oil on Linen", "36 x 48 in", "Elena Rostova");
    piece1.displayDetails();

    const piece2 = new Artwork("ART-002", "Abstract Geometry IV", 850.00, 3, "Acrylic on Canvas", "24 x 24 in", "Marcus Vance");
    piece2.displayDetails();

    console.log("[INFO] Testing price update and stock reduction...");
    piece1.updatePrice(1600.00);
    piece1.adjustStock(-1); // Marked as SOLD
    piece1.displayDetails();
}

module.exports = Artwork;
