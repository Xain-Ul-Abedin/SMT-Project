# Arts Gallery Web Application (SMT-Project)
## Lab 05 & Lab 06 Implementation Manual

---

### Course & Lab Context
- **Course**: Software Methodology & Tools (SMT Fall-24)
- **Instructor**: Sir Muhammad Umar Hayat (Punjab Tianjin University of Technology)
- **Project**: Arts Gallery Web Application (`SMT-Project`)
- **Architectural Directive**: Retain our modern zero-cost decoupled stack (Next.js 15, Node.js Express, MongoDB Mongoose Atlas M0) while providing 100% pedagogical equivalence to the course's OOP and CRUD criteria.

---

## Lab 05: Object-Oriented Domain Entity Modeling (Classes & Encapsulation)

### 1. Lab 05 Task Objective
From Sir Umar Hayat's directive:
> *"Make class, which includes 3 data numbers private and also add constructor and display function."*

In the context of the **Arts Gallery Web Application**, we model the core domain entity `Artwork` adhering strictly to OOP encapsulation invariants:
1. **Private Member Fields**: Encapsulated with private scope (`#title`, `#price`, `#dimensions`, `#medium`, `#stock`).
2. **Parameterized Constructor**: Validates and initializes object properties upon instantiation.
3. **Getter & Setter Accessors**: Safe access control with validation logic.
4. **Display Function (`displayDetails()`)**: Formats and outputs the complete artwork specification for exhibition rendering.

### 2. Implementation Code (`src/models/ArtworkEntity.js`)

```javascript
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
```

---

## Lab 06: Full CRUD Data Management Pipeline (Insert, Edit, View, Update)

### 1. Lab 06 Task Objective
From Sir Umar Hayat's directive:
> *"Lab 6 task: Insert, edit, view, and update data"*

In the Arts Gallery Web Application, this is fulfilled through a complete data management architecture:
1. **Insert (Create)**: Add a new artwork masterpiece to the gallery catalog with image URLs, dimensions, and medium.
2. **View (Read)**: Retrieve all artworks or search/filter active exhibition records.
3. **Edit / Update (Update)**: Modify pricing, dimensions, title, or status (`AVAILABLE` -> `RESERVED` -> `SOLD`).
4. **Delete / Archive (Delete)**: Safely remove or archive an artwork listing from the active catalog.

### 2. MongoDB Mongoose Data Schema (`src/models/ArtworkSchema.js`)

```javascript
const mongoose = require('mongoose');

const ArtworkSchema = new mongoose.Schema({
    artworkId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    artist: {
        type: String,
        required: true,
        trim: true
    },
    medium: {
        type: String,
        required: true,
        enum: ['Oil', 'Acrylic', 'Watercolor', 'Digital', 'Canvas', 'Sculpture'],
        default: 'Oil'
    },
    dimensions: {
        type: String,
        required: true,
        default: '24 x 36 inches'
    },
    price: {
        type: Number,
        required: true,
        min: 1
    },
    stock: {
        type: Number,
        required: true,
        default: 1,
        min: 0
    },
    status: {
        type: String,
        enum: ['AVAILABLE', 'RESERVED', 'SOLD'],
        default: 'AVAILABLE'
    },
    imageUrl: {
        type: String,
        default: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Artwork', ArtworkSchema);
```

### 3. REST Controller CRUD Pipeline (`src/controllers/artworkController.js`)

```javascript
const Artwork = require('../models/ArtworkSchema');

/**
 * 1. INSERT (Create Artwork)
 * POST /api/v1/artworks
 */
exports.createArtwork = async (req, res) => {
    try {
        const { artworkId, title, artist, medium, dimensions, price, stock, imageUrl } = req.body;
        
        // Validation check
        if (!artworkId || !title || !price) {
            return res.status(400).json({ success: false, message: "Missing required artwork fields." });
        }

        const existing = await Artwork.findOne({ artworkId });
        if (existing) {
            return res.status(409).json({ success: false, message: "Artwork with this ID already exists." });
        }

        const artwork = new Artwork({
            artworkId,
            title,
            artist,
            medium,
            dimensions,
            price,
            stock: stock !== undefined ? stock : 1,
            imageUrl
        });

        const saved = await artwork.save();
        return res.status(201).json({ success: true, message: "Artwork inserted successfully.", data: saved });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * 2. VIEW ALL (Read Catalog)
 * GET /api/v1/artworks
 */
exports.getAllArtworks = async (req, res) => {
    try {
        const { medium, minPrice, maxPrice, status } = req.query;
        let query = {};

        if (medium) query.medium = medium;
        if (status) query.status = status;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const list = await Artwork.find(query).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, count: list.length, data: list });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * 3. VIEW SINGLE (Read Details)
 * GET /api/v1/artworks/:artworkId
 */
exports.getArtworkById = async (req, res) => {
    try {
        const artwork = await Artwork.findOne({ artworkId: req.params.artworkId });
        if (!artwork) {
            return res.status(404).json({ success: false, message: "Artwork not found." });
        }
        return res.status(200).json({ success: true, data: artwork });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * 4. EDIT & UPDATE (Update Artwork)
 * PUT /api/v1/artworks/:artworkId
 */
exports.updateArtwork = async (req, res) => {
    try {
        const { title, price, medium, dimensions, stock, status, imageUrl } = req.body;
        
        let artwork = await Artwork.findOne({ artworkId: req.params.artworkId });
        if (!artwork) {
            return res.status(404).json({ success: false, message: "Artwork not found to update." });
        }

        if (title !== undefined) artwork.title = title;
        if (price !== undefined) artwork.price = price;
        if (medium !== undefined) artwork.medium = medium;
        if (dimensions !== undefined) artwork.dimensions = dimensions;
        if (stock !== undefined) {
            artwork.stock = stock;
            artwork.status = stock > 0 ? (artwork.status === 'RESERVED' ? 'RESERVED' : 'AVAILABLE') : 'SOLD';
        }
        if (status !== undefined) artwork.status = status;
        if (imageUrl !== undefined) artwork.imageUrl = imageUrl;

        const updated = await artwork.save();
        return res.status(200).json({ success: true, message: "Artwork updated successfully.", data: updated });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * 5. DELETE (Delete / Discontinue Artwork)
 * DELETE /api/v1/artworks/:artworkId
 */
exports.deleteArtwork = async (req, res) => {
    try {
        const deleted = await Artwork.findOneAndDelete({ artworkId: req.params.artworkId });
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Artwork not found." });
        }
        return res.status(200).json({ success: true, message: "Artwork record deleted successfully." });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
```

---

## Pedagogical Equivalence Matrix (ASP.NET vs Modern MERN Stack)

| Course Requirement (Sir Umar Hayat) | Professor's Example (ASP.NET / C#) | Arts Gallery Implementation (Next.js / Node.js / MongoDB) |
| :--- | :--- | :--- |
| **Encapsulated Class (Lab 5)** | `class Product { private int id; ... }` | `class Artwork { #id; #title; #price; ... }` |
| **Parameterized Constructor** | `public Product(int id, string name) { ... }` | `constructor(id, title, price, stock, medium) { ... }` |
| **Display Function** | `public void Display() { Console.WriteLine(...); }` | `displayDetails() { console.log(...); }` |
| **Insert Data (Lab 6)** | SQL `INSERT INTO Products VALUES (...)` via GridView | `POST /api/v1/artworks` -> Mongoose `new Artwork().save()` |
| **View Data (Lab 6)** | SQL `SELECT * FROM Products` bounded to GridView | `GET /api/v1/artworks` -> Mongoose `.find()` rendered in Next.js table |
| **Edit Data (Lab 6)** | GridView Edit Row (`OnRowEditing`) | Next.js modal drawer populating active artwork fields |
| **Update Data (Lab 6)** | SQL `UPDATE Products SET ... WHERE id = @id` | `PUT /api/v1/artworks/:artworkId` -> Mongoose `.save()` |
| **Delete Data (Lab 6)** | SQL `DELETE FROM Products WHERE id = @id` | `DELETE /api/v1/artworks/:artworkId` -> Mongoose `.findOneAndDelete()` |
