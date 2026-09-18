# Software Requirements Specification (SRS)
## Project: Arts Gallery Web Application (SMT-Project)

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) document provides a comprehensive overview of the requirements for the **Arts Gallery Web Application**. It outlines the functional and non-functional requirements, target user personas, system architecture, database design principles, and recommended technology stacks. This specification serves as the authoritative blueprint for developers, software architects, QA engineers, and project managers under the **Siesta & Aizen Orchestration Framework**.

### 1.2 Scope
The **Arts Gallery Web Application** is a feature-rich, multi-role digital platform designed to connect visual artists with art collectors, curators, and casual visitors. The application allows artists to exhibit and sell their physical artwork, visitors to explore virtual exhibitions, customers to securely purchase artwork via multiple payment channels, and gallery administrators to curate listings, moderate platform content, and oversee order logistics.

### 1.3 Definitions, Acronyms, and Abbreviations
- **SRS**: Software Requirements Specification
- **RBAC**: Role-Based Access Control
- **COD**: Cash on Delivery
- **JWT**: JSON Web Token
- **ODM**: Object Document Mapper (Mongoose)
- **UI/UX**: User Interface / User Experience
- **CRUD**: Create, Read, Update, Delete

### 1.4 Project Metadata
- **Project Title**: Arts Gallery Web Application
- **Project Folder**: `Brain/Projects/SMT-Project`
- **Domain**: Web Application Development
- **Hosting Strategy**: 100% Zero-Cost Cloud Infrastructure (Vercel + Render + MongoDB Atlas)
- **Orchestration Leads**: Siesta (PM / Coordinator) & Aizen (DevOps & Integration Strategist)

---

## 2. Overall Description

### 2.1 Product Perspective
The Arts Gallery system operates as an independent, self-contained web platform with cloud integrations for MongoDB Atlas, payment gateways, and image storage.

```mermaid
flowchart TD
    Visitor["Visitor (Unauthenticated)"] --> UI["Frontend Web UI (Vercel Free Tier)"]
    Customer["Customer (Buyer)"] --> UI
    Artist["Seller / Artist"] --> UI
    Admin["Gallery Admin"] --> UI
    
    UI --> API["RESTful API Engine (Render Free Tier)"]
    API --> Auth["Authentication & RBAC Module"]
    API --> Catalog["Artwork & Inventory Module"]
    API --> Order["Order & Payment Processing"]
    API --> Review["Review & Rating Module"]
    
    API --> DB[(MongoDB Atlas Free Cluster)]
    API --> CloudMedia["Cloud Image Storage (Cloudinary / S3 Free Tier)"]
    API --> PaymentGateway["Payment Gateways (Stripe Test / COD Engine)"]
```

### 2.2 User Classes and Characteristics
The application supports four distinct user roles:

1. **Visitor (Unauthenticated Guest)**:
   - *Characteristics*: Casual user browsing artwork without an account.
   - *Capabilities*: View public gallery listings, search artwork by category/artist, read artwork descriptions, share artwork links on social media platforms.
2. **Customer (Registered Buyer)**:
   - *Characteristics*: Account holder looking to purchase artwork pieces.
   - *Capabilities*: Register/login, manage customer profile, save items to cart/wishlist, place orders, complete online or COD payments, track order shipments, write reviews/ratings for purchased pieces.
3. **Seller / Artist (Registered Visual Creator)**:
   - *Characteristics*: Verified artist showcasing and selling creative work.
   - *Capabilities*: Register/login, manage artist biography and contact details, upload new artwork with high-resolution images, edit artwork details, delete listings, update status to `SOLD`, view sales history.
4. **Administrator (Gallery Owner / Manager)**:
   - *Characteristics*: System super-user overseeing operations and content integrity.
   - *Capabilities*: Login with elevated credentials, approve or disapprove artist artwork submissions, manage user accounts (customers & artists), oversee orders, process payouts, update shipping statuses, view analytics reports.

---

## 3. Detailed Functional Requirements

### Module 1: User Authentication & Profile Management
- **FR-1.1 Self-Registration**: System shall allow new Customers and Sellers (Artists) to register by providing name, email, password, and role selection.
- **FR-1.2 Secure Login**: System shall authenticate users via email/password using JWT tokens with role-based claims.
- **FR-1.3 Profile Management**: Artists can update bio, profile photo, studio address, and contact details. Customers can manage shipping addresses and password changes.
- **FR-1.4 User Administration (Admin)**: Admin can view list of registered users, edit account details, assign privileges, and activate or suspend accounts.

### Module 2: Artwork Management & Curation
- **FR-2.1 Listing Creation**: Sellers can create artwork listings specifying Title, Medium (Oil, Acrylic, Digital, Canvas), Dimensions, Price, Detailed Description, and High-Resolution Image Files.
- **FR-2.2 Listing Maintenance**: Sellers can update pricing, description, or remove listings.
- **FR-2.3 Status Tracking**: Sellers can mark an artwork as `AVAILABLE`, `RESERVED`, or `SOLD`.
- **FR-2.4 Admin Approval Pipeline**: Newly created artwork listings are placed in a pending queue until approved or rejected by an Admin based on guidelines.

### Module 3: Gallery Browsing & Search Engine
- **FR-3.1 Gallery View**: Responsive grid view of all approved artwork with title, thumbnail, artist name, price tag, and status pill.
- **FR-3.2 Keyword & Attribute Search**: Search artwork by keyword, title, artist name, medium, price range slider, and availability status.
- **FR-3.3 Social Media Link Sharing**: Direct social sharing buttons (Facebook, Twitter/X, Pinterest, WhatsApp) for every artwork detail page.

### Module 4: E-Commerce, Order & Payment Processing
- **FR-4.1 Shopping Cart**: Customers can add available artwork to a persistent shopping cart, modify selection, and view price subtotals.
- **FR-4.2 Checkout Engine**: Checkout process collecting shipping address, delivery preferences, and payment details.
- **FR-4.3 Payment Gateway Support**: Support for Online Credit/Debit Card payments (Stripe API) and Cash on Delivery (COD).
- **FR-4.4 Order Tracking & Fulfillment**: Admin and Sellers can update order status through stages (`Pending`, `Payment Verified`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).

### Module 5: Reviews, Ratings & Reporting Analytics
- **FR-5.1 Verified Ratings & Reviews**: Customers who completed a purchase can leave 1-5 star ratings and written reviews for artists and artwork pieces.
- **FR-5.2 Sales & Analytics Dashboard**: Admin dashboard displaying revenue metrics, total sales count, top-performing artists, pending approvals, and inventory stats.

---

## 4. Non-Functional Requirements

### 4.1 Security & Data Protection
- **Password Hashing**: Passwords must be hashed using `Bcrypt` before storage.
- **Data Encryption**: HTTPS / SSL encryption for all client-server communications.
- **Role-Based Access Control (RBAC)**: API endpoints must strictly validate user tokens and permissions to prevent unauthorized access.

### 4.2 Performance & Responsiveness
- **Page Load Time**: Public gallery pages must load within `< 2.0` seconds under standard internet connections.
- **Image Optimization**: Uploaded artwork images must automatically generate optimized WebP/JPEG thumbnails and lazy-load in the client browser.

### 4.3 Usability & Design Quality
- **Fluid Responsive Layout**: Seamless experience across mobile, tablet, and desktop viewports.
- **Anti-Slop Aesthetic**: Clean typographic hierarchy, subtle card elevation, warm gallery lighting aesthetic, and accessible color contrast.

### 4.4 Scalability & Reliability
- **Document Indexing**: Indexed MongoDB collection fields (`title`, `artist_id`, `category`, `price`, `status`).
- **Cloud Media Storage**: Artwork images stored in CDN-backed object storage (Cloudinary Free Tier) to ensure zero server bloat.

---

## 5. Technology Stack & Zero-Cost Infrastructure

| Layer | Selected Technology | Zero-Cost Provider / Strategy |
| :--- | :--- | :--- |
| **Frontend UI** | React.js / Next.js + Tailwind CSS | **Vercel** (Free Tier Hosting) |
| **Backend API** | Node.js (Express.js) | **Render** (Free Web Service Tier) |
| **Database** | **MongoDB** + Mongoose ODM | **MongoDB Atlas** (M0 Free Shared Cluster) |
| **Image Hosting** | Cloudinary API | Cloudinary Free Tier (25 GB Credit) |
| **Version Control** | Git + GitHub | GitHub Public Repository |
| **Containerization** | Docker & Docker Compose | Local Developer Container Stack |

---

## 6. Conceptual MongoDB Document Schema Design

```mermaid
erDiagram
    USERS ||--o{ ARTWORKS : creates
    USERS ||--o{ ORDERS : places
    USERS ||--o{ REVIEWS : writes
    ARTWORKS ||--o{ REVIEWS : receives

    USERS {
        ObjectId _id PK
        string name
        string email
        string password_hash
        string role "GUEST | CUSTOMER | ARTIST | ADMIN"
        string bio
        string contact_phone
        date createdAt
    }

    ARTWORKS {
        ObjectId _id PK
        ObjectId artist_id FK
        string title
        string description
        string medium
        string dimensions
        number price
        string image_url
        string approval_status "PENDING | APPROVED | REJECTED"
        string listing_status "AVAILABLE | RESERVED | SOLD"
        date createdAt
    }

    ORDERS {
        ObjectId _id PK
        ObjectId customer_id FK
        array items "embedded artwork_id, title, price"
        number total_amount
        string payment_method "CARD | COD"
        string payment_status "PENDING | PAID | FAILED"
        string order_status "PENDING | PROCESSING | SHIPPED | DELIVERED"
        string shipping_address
        date createdAt
    }

    REVIEWS {
        ObjectId _id PK
        ObjectId customer_id FK
        ObjectId artwork_id FK
        number rating "1-5 Stars"
        string comment
        date createdAt
    }
```

---

## 7. Approval & Sign-Off

- **Document Version**: 2.0.0
- **Prepared By**: Aizen (DevOps & Integration Strategist) & Siesta (Project Lead)
- **Approved For Implementation**: SMT-Project Team
