# Arts Gallery Web Application (SMT-Project)
## Academic Lab Manual & Software Engineering Deliverables (Labs 01 - 04)

---

### Course & Document Metadata
- **Course**: Software Project / Software Methodology & Tools (SMT / SPS Fall-24)
- **Instructor**: Sir Muhammad Umar Hayat (Punjab Tianjin University of Technology)
- **Project Title**: Arts Gallery Web Application (`SMT-Project`)
- **Repository**: `Brain/01_Projects/SMT-Project`
- **Methodology**: Hybrid Waterfall-Spiral Lifecycle (Document-Driven Rigor with Iterative Risk Reduction)
- **Architecture**: 3-Layer Decoupled Architecture (Next.js 15 Presentation GUI -> Node.js Express Business API -> MongoDB Atlas Persistent Store)

---

## Lab 01: Software Requirement Specification (SRS)

### 1. Scope
The scope of this project is to design, model, and develop a comprehensive web-based **Arts Gallery Web Application** that enables art enthusiasts, collectors, and casual visitors to discover, inspect, and acquire curated physical and digital artworks online, while providing artists with a showcase platform and empowering gallery administrators to curate listings, oversee order logistics, and manage platform finances.

On the customer and visitor side, the system allows users to explore public exhibition galleries, execute faceted search filters (by medium, dimensions, artist, and price range), inspect high-resolution artwork photography with dimension calibrations, manage a persistent shopping cart, complete secure transactions via credit/debit card or Cash on Delivery (COD), track real-time shipment milestones, and submit verified reviews upon delivery.

On the artist and admin side, the system provides listing submission pipelines, curatorial approval queues, inventory status tracking (`AVAILABLE`, `RESERVED`, `SOLD`), order fulfillment dispatch, payment audits, account moderation, and revenue analytics reporting.

**Out of Scope**: Third-party courier live telemetry APIs, physical auction bidding mechanics, and multi-warehouse supply chain logistics are excluded from this release and reserved for future iterations.

---

### 2. Functional Requirements (FR-01 to FR-20)
- **FR-01**: Customers and artists can register and securely log in to their account.
- **FR-02**: Customers can browse artworks organized by category and medium (Oil, Acrylic, Watercolor, Digital, Canvas, Sculpture).
- **FR-03**: Customers can search and filter artworks by keyword, medium, dimensions, price range, and artist name.
- **FR-04**: Customers can view comprehensive artwork details (high-resolution photographs, medium, physical dimensions, artist biography, framing options, and authenticity guarantee).
- **FR-05**: Customers can add or remove available artwork pieces to/from their persistent shopping cart.
- **FR-06**: Customers can place an order and select their preferred payment channel.
- **FR-07**: Customers can complete payment through multiple options (Credit/Debit Card via Stripe Gateway, Cash on Delivery COD).
- **FR-08**: Customers can track real-time shipment status of their order (Pending, In Curation, Dispatched, Shipped, Delivered).
- **FR-09**: Customers can view purchase history and download digital authenticity certificates and invoices.
- **FR-10**: Customers can submit return and refund requests for damaged delivered items within the allowable return window.
- **FR-11**: Customers can manage their collector profile, contact details, and shipping address book.
- **FR-12**: Customers can leave verified ratings (1 to 5 stars) and qualitative reviews on delivered artworks.
- **FR-13**: Artists and Gallery Administrators can add, edit, or archive artwork listings and categories.
- **FR-14**: Admin can manage artwork inventory, stock units, and lifecycle availability states (`AVAILABLE`, `RESERVED`, `SOLD`).
- **FR-15**: Admin can review, verify, process, or cancel incoming customer artwork orders.
- **FR-16**: Admin can update shipping courier tracking numbers and fulfillment status.
- **FR-17**: Admin can audit payment reconciliation records and process electronic customer refunds.
- **FR-18**: Admin can manage registered user accounts (view profiles, verify artist credentials, suspend or delete accounts).
- **FR-19**: Admin can generate business intelligence reports (gross sales volume, commission splits, inventory turnover, top-performing artists).
- **FR-20**: Admin can create and manage promotional discount coupons and seasonal exhibition promo codes.

---

### 3. Non-Functional Requirements (NFR-01 to NFR-11)
- **NFR-01 (Performance)**: Web pages and artwork catalog galleries shall load within 2 to 3 seconds under normal network conditions.
- **NFR-02 (Concurrency)**: The platform shall concurrently support multiple collectors browsing and placing orders without performance degradation.
- **NFR-03 (Security)**: All authentication tokens and customer financial data shall be encrypted using industry-standard protocols (HTTPS, JWT, bcrypt password hashing).
- **NFR-04 (Access Control)**: Administrative panels and curatorial management workflows shall be strictly restricted to authenticated Admin roles.
- **NFR-05 (Availability)**: The online gallery shall maintain 99.5% operational uptime, accessible 24/7.
- **NFR-06 (Usability)**: The user interface shall feature high-legibility typography, clear contrast ratios, and intuitive consumer navigation.
- **NFR-07 (Responsiveness)**: The application shall render responsively across mobile, tablet, and desktop viewports.
- **NFR-08 (Reliability & Fault Tolerance)**: The system shall gracefully handle transaction exceptions and input errors without loss of cart or order state.
- **NFR-09 (Scalability)**: The database architecture shall scale horizontally to support thousands of high-resolution artwork assets and registered users.
- **NFR-10 (Maintainability)**: The codebase shall follow modular, decoupled architectural separation between presentation, API, and database layers.
- **NFR-11 (Data Integrity)**: Order, inventory, and payment ledgers shall remain strictly synchronized to prevent double-booking of one-of-a-kind artworks.

---

## Lab 02: Use Case Modeling & Specifications

### 1. Actor Definitions
- **Customer (Art Buyer / Collector)**: End-user browsing, selecting, and acquiring artwork pieces.
- **Administrator (Gallery Curator / Manager)**: Elevated user managing artworks, order fulfillment, payments, and platform analytics.

---

### 2. High-Level Use Case Catalog
- **Customer Use Cases**:
  - `UC-01`: Register
  - `UC-02`: Login
  - `UC-03`: Browse & Search Artworks
  - `UC-04`: View Artwork Details
  - `UC-05`: Manage Cart
  - `UC-06`: Checkout & Payment
  - `UC-07`: Track Order Status
  - `UC-08`: Feedback & Returns
  - `UC-15`: Manage Profile & Shipping Address
- **Admin Use Cases**:
  - `UC-09`: Manage Artworks & Inventory
  - `UC-10`: Manage Orders
  - `UC-11`: Manage Payments & Refunds
  - `UC-12`: Manage Users & Accounts
  - `UC-13`: Manage Promotions & Discounts
  - `UC-14`: Generate Reports

---

### 3. Detailed Tabular Use Case Specifications

#### UC-01: Register
| Field | Value |
| :--- | :--- |
| **UC ID** | 01 |
| **UC Name** | Register |
| **Actor** | Customer |
| **Description** | New customer creates an account on the arts gallery platform. |
| **Precondition** | Customer has internet access and navigates to the registration screen. |
| **Postcondition** | New customer account record is persisted in the database. |
| **Action Steps** | 1. Customer selects "Register".<br>2. Customer inputs name, email, password, and contact details.<br>3. System validates entered input.<br>4. System creates the new customer record.<br>5. System redirects customer to the login screen or homepage. |
| **Alternative Flow** | Customer registers using federated OAuth (Google) authentication. |
| **Exception** | If email already exists or required fields are omitted, system displays validation error and prevents account creation. |

#### UC-02: Login
| Field | Value |
| :--- | :--- |
| **UC ID** | 02 |
| **UC Name** | Login |
| **Actor** | Customer |
| **Description** | Existing customer authenticates to access personalized gallery features. |
| **Precondition** | Customer possesses a registered account and accesses the login screen. |
| **Postcondition** | Customer session is authenticated and authorized with JWT token. |
| **Action Steps** | 1. Customer enters email and password.<br>2. Customer clicks "Login".<br>3. System verifies credentials against database.<br>4. System issues session token and redirects to storefront. |
| **Alternative Flow** | Customer selects "Forgot Password" to initiate credentials recovery. |
| **Exception** | If credentials are invalid, system displays "Invalid email or password" and denies access. |

#### UC-03: Browse & Search Artworks
| Field | Value |
| :--- | :--- |
| **UC ID** | 03 |
| **UC Name** | Browse & Search Artworks |
| **Actor** | Customer |
| **Description** | Customer browses artwork collections by medium or applies multi-attribute search filters. |
| **Precondition** | Customer accesses gallery catalog page. |
| **Postcondition** | Matching artwork collection is retrieved and displayed. |
| **Action Steps** | 1. Customer selects a medium category (Oil, Acrylic, Digital) or types search keywords.<br>2. Customer applies price range and dimension filters.<br>3. System queries artwork collection.<br>4. System renders matching artwork cards. |
| **Alternative Flow** | Customer resets search filters to view default featured exhibition. |
| **Exception** | If no artworks match filter parameters, system displays "No artworks found matching criteria". |

#### UC-04: View Artwork Details
| Field | Value |
| :--- | :--- |
| **UC ID** | 04 |
| **UC Name** | View Artwork Details |
| **Actor** | Customer |
| **Description** | Customer inspects comprehensive artwork information, high-res photos, dimensions, and reviews. |
| **Precondition** | Customer selects an artwork card from catalog. |
| **Postcondition** | Detailed artwork exhibition page is rendered. |
| **Action Steps** | 1. Customer clicks on artwork card.<br>2. System retrieves artwork details (images, medium, dimensions, artist bio, price, authenticity cert).<br>3. System displays artwork detail page. |
| **Alternative Flow** | Customer zooms in on high-resolution canvas texture imagery. |
| **Exception** | If artwork is marked `SOLD`, system disables "Add to Cart" and displays "Original Piece Sold". |

#### UC-05: Manage Cart
| Field | Value |
| :--- | :--- |
| **UC ID** | 05 |
| **UC Name** | Manage Cart |
| **Actor** | Customer |
| **Description** | Customer adds, adjusts, or removes artwork items from the persistent shopping cart. |
| **Precondition** | Customer is logged in and viewing an artwork detail page. |
| **Postcondition** | Shopping cart contents and subtotal are updated in database. |
| **Action Steps** | 1. Customer clicks "Add to Cart".<br>2. System validates availability status in database.<br>3. System updates cart items and displays confirmation banner.<br>4. Customer opens cart to inspect items or remove pieces. |
| **Alternative Flow** | Customer moves artwork piece to Wishlist. |
| **Exception** | If artwork was reserved by another buyer during session, system displays "Artwork no longer available" and removes it from cart. |

#### UC-06: Checkout & Payment
| Field | Value |
| :--- | :--- |
| **UC ID** | 06 |
| **UC Name** | Checkout & Payment |
| **Actor** | Customer |
| **Description** | Customer enters delivery address, selects payment channel (Card/COD), and places confirmed order. |
| **Precondition** | Customer is logged in with active items in cart. |
| **Postcondition** | Order is persisted with unique Order ID; artwork status moves to `RESERVED`. |
| **Action Steps** | 1. Customer clicks "Checkout".<br>2. System displays order summary and delivery fees.<br>3. Customer inputs shipping address.<br>4. Customer selects payment method (Card or COD).<br>5. Customer confirms order.<br>6. System authorizes payment and generates order invoice. |
| **Alternative Flow** | Customer applies valid promotional discount code prior to payment. |
| **Exception** | If payment gateway authorization fails, system displays error and prompts customer to re-enter payment credentials. |

#### UC-07: Track Order Status
| Field | Value |
| :--- | :--- |
| **UC ID** | 07 |
| **UC Name** | Track Order Status |
| **Actor** | Customer |
| **Description** | Customer checks real-time fulfillment and shipping progress for an order. |
| **Precondition** | Customer possesses an active Order ID or navigates to order history. |
| **Postcondition** | Current order fulfillment stage and courier tracking timeline are presented. |
| **Action Steps** | 1. Customer navigates to "My Orders".<br>2. System retrieves customer orders.<br>3. Customer selects specific order.<br>4. System displays tracking stepper (Pending, In Curation, Shipped, Delivered). |
| **Alternative Flow** | Customer clicks "Download PDF Invoice & Authenticity Certificate". |
| **Exception** | If Order ID is invalid, system returns error "Order not found". |

#### UC-08: Feedback & Returns
| Field | Value |
| :--- | :--- |
| **UC ID** | 08 |
| **UC Name** | Feedback & Returns |
| **Actor** | Customer |
| **Description** | Customer submits review and rating, or files a return claim for a delivered artwork. |
| **Precondition** | Target order status is marked `Delivered` in database. |
| **Postcondition** | Review is published or return request ticket is registered. |
| **Action Steps** | 1. Customer opens delivered order.<br>2. Customer selects "Write Review" or "Request Return".<br>3. For review: enters 1-5 star rating and comments.<br>4. For return: selects reason and uploads photo proof.<br>5. System stores feedback or routes claim to gallery admin. |
| **Alternative Flow** | Customer updates previously submitted review. |
| **Exception** | If return request is submitted after return window expires (e.g. 7 days), system rejects return and allows review submission only. |

#### UC-09: Manage Artworks & Inventory
| Field | Value |
| :--- | :--- |
| **UC ID** | 09 |
| **UC Name** | Manage Artworks & Inventory |
| **Actor** | Admin |
| **Description** | Admin adds new artwork listings, edits specifications, updates pricing, or archives pieces. |
| **Precondition** | Admin is authenticated with gallery management privileges. |
| **Postcondition** | Artwork catalog and inventory states are updated in database. |
| **Action Steps** | 1. Admin accesses "Artwork Management" panel.<br>2. Admin selects Add/Edit/Archive.<br>3. Admin inputs title, medium, dimensions, price, and images.<br>4. System validates parameters and saves artwork record.<br>5. Artwork updates live on public gallery. |
| **Alternative Flow** | Admin imports artwork listings in bulk via spreadsheet. |
| **Exception** | If required fields or high-resolution images are missing, system displays validation error and blocks save. |

#### UC-10: Manage Orders
| Field | Value |
| :--- | :--- |
| **UC ID** | 10 |
| **UC Name** | Manage Orders |
| **Actor** | Admin |
| **Description** | Admin inspects customer orders and updates fulfillment status (Confirmed, Shipped, Delivered). |
| **Precondition** | Admin is logged in to the order management console. |
| **Postcondition** | Order fulfillment status and tracking milestones are updated in database. |
| **Action Steps** | 1. Admin opens "Orders" dashboard.<br>2. System displays order queue.<br>3. Admin selects an order.<br>4. Admin updates status (e.g., Shipped) and inputs courier tracking code.<br>5. System persists update and dispatches notification to customer. |
| **Alternative Flow** | Admin filters orders by status (`Pending`, `In Curation`, `Shipped`). |
| **Exception** | If an order is already marked `Delivered`, system prevents rollback to `Pending`. |

#### UC-11: Manage Payments & Refunds
| Field | Value |
| :--- | :--- |
| **UC ID** | 11 |
| **UC Name** | Manage Payments & Refunds |
| **Actor** | Admin |
| **Description** | Admin audits financial transactions, reconciles payouts, and processes authorized refunds. |
| **Precondition** | Admin has financial clearance credentials. |
| **Postcondition** | Refund transaction is recorded and database status is marked `Refunded`. |
| **Action Steps** | 1. Admin navigates to "Payments & Ledgers".<br>2. System renders transaction history.<br>3. Admin selects transaction for return/cancellation.<br>4. Admin initiates electronic refund.<br>5. System communicates with payment gateway and marks record `Refunded`. |
| **Alternative Flow** | Admin exports monthly settled financial statement as CSV/Excel. |
| **Exception** | If gateway refund fails, system logs transaction error and alerts admin for manual reconciliation. |

#### UC-12: Manage Users & Accounts
| Field | Value |
| :--- | :--- |
| **UC ID** | 12 |
| **UC Name** | Manage Users & Accounts |
| **Actor** | Admin |
| **Description** | Admin views registered accounts, verifies artist portfolios, and moderates user statuses. |
| **Precondition** | Admin is authenticated on management portal. |
| **Postcondition** | User account status (Active, Verified Artist, Suspended) is updated in database. |
| **Action Steps** | 1. Admin accesses "Users & Artists" module.<br>2. System displays registered users.<br>3. Admin selects a user profile.<br>4. Admin reviews credentials, verifies artist status, or suspends account.<br>5. System updates account state in database. |
| **Alternative Flow** | Admin resets a user's password credentials on verified request. |
| **Exception** | System blocks deletion of any customer account with active, undelivered artwork orders. |

#### UC-13: Manage Promotions & Discounts
| Field | Value |
| :--- | :--- |
| **UC ID** | 13 |
| **UC Name** | Manage Promotions & Discounts |
| **Actor** | Admin |
| **Description** | Admin configures seasonal exhibition discount codes, percentage cuts, and validity windows. |
| **Precondition** | Admin is logged in to promotions manager. |
| **Postcondition** | Promotion code is persisted in database and active at checkout. |
| **Action Steps** | 1. Admin opens "Promotions" panel.<br>2. Admin inputs code name, percentage discount, minimum order, and expiration date.<br>3. System validates input and persists coupon.<br>4. Code becomes immediately redeemable by customers. |
| **Alternative Flow** | Admin deactivates an active promotion code prior to expiration. |
| **Exception** | If code string already exists, system displays duplicate code error and halts save. |

#### UC-14: Generate Reports
| Field | Value |
| :--- | :--- |
| **UC ID** | 14 |
| **UC Name** | Generate Reports |
| **Actor** | Admin |
| **Description** | Admin compiles business reports regarding sales revenue, artist performance, and artwork turnover. |
| **Precondition** | Historical sales and artwork transaction data exist in database. |
| **Postcondition** | Business intelligence report is generated, rendered, and ready for export. |
| **Action Steps** | 1. Admin opens "Reports & Analytics" dashboard.<br>2. Admin selects report type (Gross Sales, Artist Commissions, Inventory Turnover) and date range.<br>3. System aggregates analytics metrics.<br>4. System renders charts and summary data tables. |
| **Alternative Flow** | Admin exports report as PDF or Excel spreadsheet. |
| **Exception** | If no transaction records exist within chosen date span, system displays "No data recorded for this time range". |

#### UC-15: Manage Profile & Shipping Address
| Field | Value |
| :--- | :--- |
| **UC ID** | 15 |
| **UC Name** | Manage Profile & Shipping Address |
| **Actor** | Customer |
| **Description** | Customer updates personal information, phone number, and physical shipping address book. |
| **Precondition** | Customer is authenticated and accesses "My Profile". |
| **Postcondition** | Updated profile and address records are saved in database. |
| **Action Steps** | 1. Customer opens "Profile & Addresses" page.<br>2. System loads existing profile records.<br>3. Customer edits address or adds a new delivery destination.<br>4. Customer clicks "Save Changes".<br>5. System persists updated entity in database. |
| **Alternative Flow** | Customer selects an address as "Default Shipping Destination" for 1-click checkout. |
| **Exception** | If postal code or contact number format is invalid, system displays field validation error. |

---

## Lab 03 & 04: System Design, Sequence Diagrams & Requirements Traceability

### 1. Academic Presentation Architecture Pattern
In software engineering presentations and academic viva examinations under Sir Umar Hayat, UML sequence diagrams must communicate the essential chronological interaction flow without unnecessary low-level framework boilerplate.

The presentation architecture models dynamic interactions across three standard lifelines:
$$\text{Actor (User / Admin)} \longrightarrow \text{Boundary GUI (Screen / Page)} \longrightarrow \text{Persistent Entity Store (Database)} \; [+\; \text{External Gateway}]$$

- **Actor Lifeline**: Represents the human initiator (Customer or Admin).
- **GUI Boundary Lifeline**: The specific frontend screen or view capturing user input and presenting visual feedback (`Register: GUI`, `GalleryCatalog: GUI`, `Cart: GUI`, `Checkout: GUI`, `AdminPortal: GUI`).
- **Database Entity Lifeline**: The persistent data store (`ArtsGalleryDB: MongoDB`) storing and retrieving entity collections.
- **External Gateway Lifeline**: External banking/payment processor (`PaymentGateway: Stripe`) handling electronic card authorizations.

---

### 2. Requirements Traceability Matrix (RTM)

The matrix below establishes complete bidirectional traceability between each Functional Requirement from Lab 01 and its corresponding Use Case and Sequence Diagram in Labs 02, 03, and 04:

| Requirement ID | Functional Requirement Statement (Lab 01 SRS) | Mapped Use Case & Sequence Diagram |
| :--- | :--- | :--- |
| **FR-01** | Customers and artists can register and securely log in to their account. | `UC-01` (Register), `UC-02` (Login) |
| **FR-02** | Customers can browse artworks organized by category and medium. | `UC-03` (Browse & Search Artworks) |
| **FR-03** | Customers can search and filter artworks by keyword, medium, dimensions, price. | `UC-03` (Browse & Search Artworks) |
| **FR-04** | Customers can view comprehensive artwork details, dimensions, and artist bio. | `UC-04` (View Artwork Details) |
| **FR-05** | Customers can add or remove available artwork pieces to/from the shopping cart. | `UC-05` (Manage Cart) |
| **FR-06** | Customers can place an order and select their preferred payment channel. | `UC-06` (Checkout & Payment) |
| **FR-07** | Customers can complete payment through multiple options (Card / COD). | `UC-06` (Checkout & Payment) |
| **FR-08** | Customers can track real-time shipment status of their order. | `UC-07` (Track Order Status) |
| **FR-09** | Customers can view purchase history and download authenticity certificates. | `UC-07` (Track Order Status) |
| **FR-10** | Customers can submit return and refund requests for damaged delivered items. | `UC-08` (Feedback & Returns) |
| **FR-11** | Customers can manage their collector profile and shipping address book. | `UC-15` (Manage Profile & Shipping Address) |
| **FR-12** | Customers can leave verified ratings (1-5 stars) and reviews on delivered artworks. | `UC-08` (Feedback & Returns) |
| **FR-13** | Artists and Gallery Administrators can add, edit, or archive artwork listings. | `UC-09` (Manage Artworks & Inventory) |
| **FR-14** | Admin can manage artwork inventory and lifecycle availability states. | `UC-09` (Manage Artworks & Inventory) |
| **FR-15** | Admin can review, verify, process, or cancel incoming customer orders. | `UC-10` (Manage Orders) |
| **FR-16** | Admin can update shipping courier tracking numbers and fulfillment status. | `UC-10` (Manage Orders) |
| **FR-17** | Admin can audit payment reconciliation records and process customer refunds. | `UC-11` (Manage Payments & Refunds) |
| **FR-18** | Admin can manage registered user accounts (view, verify, suspend). | `UC-12` (Manage Users & Accounts) |
| **FR-19** | Admin can generate business intelligence reports (sales, commissions, turnover). | `UC-14` (Generate Reports) |
| **FR-20** | Admin can create and manage promotional discount coupons and promo codes. | `UC-13` (Manage Promotions & Discounts) |

---

### 3. Step-by-Step Presentation Action Flow Tables (UC-01 to UC-15)

#### Table 3.1: Action Steps & Viva Explanation for UC-01 (Register)
| Step | Source | Target | Action / Message | Flow | Presentation & Viva Explanation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Customer: User | Register: GUI | `OpenGUI()` | Normal | Customer clicks "Register" on the gallery top navigation bar. |
| 2 | Customer: User | Register: GUI | `EnterDetails(name, email, password, phone)` | Normal | Customer fills out the registration form inputs. |
| 3 | Customer: User | Register: GUI | `Submit(customer)` | Normal | Customer clicks submit button to register. |
| 4 | Register: GUI | ArtsGalleryDB: MongoDB | `CheckEmail(email)` | Normal | GUI queries database to verify email uniqueness. |
| 5 | ArtsGalleryDB: MongoDB | Register: GUI | `Unique` | Normal | Database confirms email is not previously registered. |
| 6 | Register: GUI | ArtsGalleryDB: MongoDB | `Save(customer)` | Normal | GUI transmits hashed customer entity to be inserted into database. |
| 7 | ArtsGalleryDB: MongoDB | Register: GUI | `Successful` | Normal | Database returns success acknowledgement. |
| 8 | Register: GUI | Customer: User | `Account created successfully` | Normal | GUI displays success banner and redirects customer to login. |

#### Table 3.2: Action Steps & Viva Explanation for UC-02 (Login)
| Step | Source | Target | Action / Message | Flow | Presentation & Viva Explanation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Customer: User | Login: GUI | `OpenGUI()` | Normal | Customer clicks login button on gallery navigation bar. |
| 2 | Customer: User | Login: GUI | `EnterCredentials(email, password)` | Normal | Customer inputs email and password credentials. |
| 3 | Customer: User | Login: GUI | `Submit(credentials)` | Normal | Customer clicks the login submit button. |
| 4 | Login: GUI | ArtsGalleryDB: MongoDB | `ValidateUser(email, password)` | Normal | GUI queries database to authenticate user credentials. |
| 5 | ArtsGalleryDB: MongoDB | Login: GUI | `User Found` | Normal | Database verifies password hash and returns user profile. |
| 6 | Login: GUI | Customer: User | `Login successful` | Normal | GUI stores JWT session token and redirects to gallery storefront. |

#### Table 3.3: Action Steps & Viva Explanation for UC-03 (Browse & Search Artworks)
| Step | Source | Target | Action / Message | Flow | Presentation & Viva Explanation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Customer: User | BrowseGallery: GUI | `OpenGUI()` | Normal | Customer accesses online gallery exhibition storefront. |
| 2 | Customer: User | BrowseGallery: GUI | `SelectMedium(mediumID)` | Normal | Customer chooses artwork medium (Oil, Acrylic, Canvas). |
| 3 | Customer: User | BrowseGallery: GUI | `EnterFilterQuery(keyword, priceRange)` | Normal | Customer specifies keyword search and price boundaries. |
| 4 | Customer: User | BrowseGallery: GUI | `SubmitSearch(filters)` | Normal | Customer triggers search filtering action. |
| 5 | BrowseGallery: GUI | ArtsGalleryDB: MongoDB | `QueryArtworks(filters)` | Normal | GUI queries artwork collection in MongoDB. |
| 6 | ArtsGalleryDB: MongoDB | BrowseGallery: GUI | `Artwork List` | Normal | Database returns matched available artwork records. |
| 7 | BrowseGallery: GUI | Customer: User | `Display artwork grid` | Normal | GUI renders responsive artwork card exhibition grid. |

#### Table 3.4: Action Steps & Viva Explanation for UC-04 (View Artwork Details)
| Step | Source | Target | Action / Message | Flow | Presentation & Viva Explanation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Customer: User | ArtworkDetails: GUI | `SelectArtwork(artworkID)` | Normal | Customer clicks on an artwork card in the gallery grid. |
| 2 | ArtworkDetails: GUI | ArtsGalleryDB: MongoDB | `GetArtworkDetails(artworkID)` | Normal | GUI fetches complete artwork attributes and specifications. |
| 3 | ArtsGalleryDB: MongoDB | ArtworkDetails: GUI | `Artwork Details` | Normal | Database returns images, medium, dimensions, price, and artist bio. |
| 4 | ArtworkDetails: GUI | ArtsGalleryDB: MongoDB | `GetReviews(artworkID)` | Normal | GUI queries verified customer feedback and star ratings. |
| 5 | ArtsGalleryDB: MongoDB | ArtworkDetails: GUI | `Reviews List` | Normal | Database returns list of verified collector reviews. |
| 6 | ArtworkDetails: GUI | Customer: User | `Display artwork details & reviews` | Normal | GUI presents detailed showcase view with zoomable photography. |

#### Table 3.5: Action Steps & Viva Explanation for UC-05 (Manage Cart)
| Step | Source | Target | Action / Message | Flow | Presentation & Viva Explanation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Customer: User | Cart: GUI | `OpenGUI()` | Normal | Customer opens shopping cart drawer. |
| 2 | Customer: User | Cart: GUI | `AddToCart(artworkID)` | Normal | Customer adds artwork piece to cart. |
| 3 | Cart: GUI | ArtsGalleryDB: MongoDB | `CheckAvailability(artworkID)` | Normal | GUI checks availability state (`AVAILABLE`) in database. |
| 4 | ArtsGalleryDB: MongoDB | Cart: GUI | `Available` | Normal | Database confirms artwork is currently available. |
| 5 | Customer: User | Cart: GUI | `RemoveItem(artworkID)` | Normal | Customer removes item or adjusts framing options. |
| 6 | Cart: GUI | ArtsGalleryDB: MongoDB | `SaveCart(cartItems)` | Normal | GUI persists updated cart session in database. |
| 7 | ArtsGalleryDB: MongoDB | Cart: GUI | `Successful` | Normal | Database confirms cart persistence. |
| 8 | Cart: GUI | Customer: User | `Cart updated successfully` | Normal | GUI refreshes price subtotal and displays updated cart list. |

#### Table 3.6: Action Steps & Viva Explanation for UC-06 (Checkout & Payment)
| Step | Source | Target | Action / Message | Flow | Presentation & Viva Explanation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Customer: User | Checkout: GUI | `OpenGUI()` | Normal | Customer initiates checkout from cart. |
| 2 | Customer: User | Checkout: GUI | `EnterShippingDetails(address, city, phone)` | Normal | Customer inputs delivery address and contact information. |
| 3 | Customer: User | Checkout: GUI | `SelectPaymentMethod(method, cardInfo)` | Normal | Customer chooses payment method (Card or COD). |
| 4 | Customer: User | Checkout: GUI | `SubmitOrder(order)` | Normal | Customer clicks "Confirm & Place Order". |
| 5 | Checkout: GUI | PaymentGateway: Stripe | `ProcessPayment(amount, cardInfo)` | Normal | GUI initiates card charge with external payment gateway. |
| 6 | PaymentGateway: Stripe | Checkout: GUI | `Payment Approved` | Normal | Gateway validates transaction and returns auth token. |
| 7 | Checkout: GUI | ArtsGalleryDB: MongoDB | `SaveOrder(order, txID)` | Normal | GUI saves confirmed order record and updates artwork state to `SOLD`. |
| 8 | ArtsGalleryDB: MongoDB | Checkout: GUI | `Successful` | Normal | Database confirms order insertion and inventory update. |
| 9 | Checkout: GUI | Customer: User | `Order placed successfully` | Normal | GUI renders order receipt, tracking number, and invoice download. |

#### Table 3.7: Action Steps & Viva Explanation for UC-07 (Track Order Status)
| Step | Source | Target | Action / Message | Flow | Presentation & Viva Explanation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Customer: User | OrderTracking: GUI | `OpenGUI()` | Normal | Customer opens "Track Order" page. |
| 2 | Customer: User | OrderTracking: GUI | `EnterTrackingInfo(orderID)` | Normal | Customer inputs their unique Order ID number. |
| 3 | Customer: User | OrderTracking: GUI | `Submit(orderID)` | Normal | Customer clicks track order button. |
| 4 | OrderTracking: GUI | ArtsGalleryDB: MongoDB | `GetOrderStatus(orderID)` | Normal | GUI queries fulfillment and courier status from database. |
| 5 | ArtsGalleryDB: MongoDB | OrderTracking: GUI | `Order Status Details` | Normal | Database returns courier milestones and dispatch timestamps. |
| 6 | OrderTracking: GUI | Customer: User | `Display order status` | Normal | GUI displays visual delivery progress stepper. |

#### Table 3.8: Action Steps & Viva Explanation for UC-08 (Feedback & Returns)
| Step | Source | Target | Action / Message | Flow | Presentation & Viva Explanation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Customer: User | FeedbackReturn: GUI | `OpenGUI()` | Normal | Customer opens feedback and returns portal. |
| 2 | Customer: User | FeedbackReturn: GUI | `SelectOrder(orderID)` | Normal | Customer selects a delivered artwork order. |
| 3 | Customer: User | FeedbackReturn: GUI | `EnterFeedbackOrReturn(rating, comment, reason)` | Normal | Customer enters star rating, review, or return reason with photo. |
| 4 | Customer: User | FeedbackReturn: GUI | `Submit(request)` | Normal | Customer clicks submit request button. |
| 5 | FeedbackReturn: GUI | ArtsGalleryDB: MongoDB | `SaveFeedbackOrReturn(request)` | Normal | GUI inserts review or return claim ticket into database. |
| 6 | ArtsGalleryDB: MongoDB | FeedbackReturn: GUI | `Successful` | Normal | Database confirms record persistence. |
| 7 | FeedbackReturn: GUI | Customer: User | `Request submitted successfully` | Normal | GUI renders confirmation alert and reference ticket number. |

#### Table 3.9: Action Steps & Viva Explanation for UC-09 (Manage Artworks & Inventory)
| Step | Source | Target | Action / Message | Flow | Presentation & Viva Explanation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Admin: User | ArtworkManager: GUI | `OpenGUI()` | Normal | Admin navigates to "Manage Artworks" console tab. |
| 2 | Admin: User | ArtworkManager: GUI | `EnterArtworkDetails(id, title, medium, price, dimensions)` | Normal | Admin inputs artwork metadata, pricing, and specs. |
| 3 | Admin: User | ArtworkManager: GUI | `Submit(artwork)` | Normal | Admin clicks "Save Artwork Listing" button. |
| 4 | ArtworkManager: GUI | ArtsGalleryDB: MongoDB | `SaveArtwork(artwork)` | Normal | GUI submits artwork entity to database for insertion or update. |
| 5 | ArtsGalleryDB: MongoDB | ArtworkManager: GUI | `Successful` | Normal | Database confirms successful write operation. |
| 6 | ArtworkManager: GUI | Admin: User | `Artwork saved successfully` | Normal | GUI displays confirmation banner and refreshes artwork catalog table. |

#### Table 3.10: Action Steps & Viva Explanation for UC-10 (Manage Orders)
| Step | Source | Target | Action / Message | Flow | Presentation & Viva Explanation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Admin: User | OrderManager: GUI | `OpenGUI()` | Normal | Admin opens the order fulfillment management console. |
| 2 | Admin: User | OrderManager: GUI | `ViewOrders()` | Normal | Admin clicks to load active customer orders. |
| 3 | OrderManager: GUI | ArtsGalleryDB: MongoDB | `GetOrdersList()` | Normal | GUI queries active order list from database. |
| 4 | ArtsGalleryDB: MongoDB | OrderManager: GUI | `Orders Data` | Normal | Database returns order summaries and collector shipping details. |
| 5 | Admin: User | OrderManager: GUI | `UpdateOrderStatus(orderID, status)` | Normal | Admin selects new status (e.g. Shipped) and inputs courier tracking code. |
| 6 | OrderManager: GUI | ArtsGalleryDB: MongoDB | `SaveStatus(orderID, status)` | Normal | GUI transmits updated fulfillment state to database. |
| 7 | ArtsGalleryDB: MongoDB | OrderManager: GUI | `Successful` | Normal | Database confirms update of order status and timestamp. |
| 8 | OrderManager: GUI | Admin: User | `Order status updated successfully` | Normal | GUI renders success notification and updates order table row. |

#### Table 3.11: Action Steps & Viva Explanation for UC-11 (Manage Payments & Refunds)
| Step | Source | Target | Action / Message | Flow | Presentation & Viva Explanation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Admin: User | PaymentManager: GUI | `OpenGUI()` | Normal | Admin opens payments and accounting console. |
| 2 | Admin: User | PaymentManager: GUI | `ViewTransactions()` | Normal | Admin clicks to inspect transaction ledger. |
| 3 | PaymentManager: GUI | ArtsGalleryDB: MongoDB | `GetPayments()` | Normal | GUI queries payment transaction records from database. |
| 4 | ArtsGalleryDB: MongoDB | PaymentManager: GUI | `Payment Records` | Normal | Database returns transaction logs, payment methods, and statuses. |
| 5 | Admin: User | PaymentManager: GUI | `IssueRefund(txID, amount)` | Normal | Admin selects transaction and clicks "Process Refund". |
| 6 | PaymentManager: GUI | PaymentGateway: Stripe | `ProcessRefund(txID, amount)` | Normal | GUI contacts payment gateway to issue electronic card refund. |
| 7 | PaymentGateway: Stripe | PaymentManager: GUI | `Refund Approved` | Normal | Gateway approves refund and returns refund transaction reference. |
| 8 | PaymentManager: GUI | ArtsGalleryDB: MongoDB | `UpdatePaymentStatus(txID, "Refunded")` | Normal | GUI updates transaction status to `Refunded` in database. |
| 9 | ArtsGalleryDB: MongoDB | PaymentManager: GUI | `Successful` | Normal | Database confirms ledger modification. |
| 10 | PaymentManager: GUI | Admin: User | `Refund processed successfully` | Normal | GUI displays refund completion alert and refreshes ledger. |

#### Table 3.12: Action Steps & Viva Explanation for UC-12 (Manage Users & Accounts)
| Step | Source | Target | Action / Message | Flow | Presentation & Viva Explanation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Admin: User | UserManager: GUI | `OpenGUI()` | Normal | Admin accesses customer and artist account portal. |
| 2 | Admin: User | UserManager: GUI | `ViewUsers()` | Normal | Admin requests user list. |
| 3 | UserManager: GUI | ArtsGalleryDB: MongoDB | `GetUserList()` | Normal | GUI queries registered user records from database. |
| 4 | ArtsGalleryDB: MongoDB | UserManager: GUI | `User Records` | Normal | Database returns user profiles, join dates, and account roles. |
| 5 | Admin: User | UserManager: GUI | `UpdateAccountStatus(userID, status)` | Normal | Admin selects user and updates status (Active, Verified Artist, Suspended). |
| 6 | UserManager: GUI | ArtsGalleryDB: MongoDB | `SaveUserStatus(userID, status)` | Normal | GUI transmits updated status to database. |
| 7 | ArtsGalleryDB: MongoDB | UserManager: GUI | `Successful` | Normal | Database confirms account status update. |
| 8 | UserManager: GUI | Admin: User | `User status updated successfully` | Normal | GUI displays confirmation message and refreshes user table. |

#### Table 3.13: Action Steps & Viva Explanation for UC-13 (Manage Promotions & Discounts)
| Step | Source | Target | Action / Message | Flow | Presentation & Viva Explanation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Admin: User | PromotionManager: GUI | `OpenGUI()` | Normal | Admin opens promotions management tab. |
| 2 | Admin: User | PromotionManager: GUI | `EnterCouponDetails(code, discount, expiryDate)` | Normal | Admin inputs promo code string, discount percentage, and expiry date. |
| 3 | Admin: User | PromotionManager: GUI | `Submit(coupon)` | Normal | Admin clicks "Create Promotion" button. |
| 4 | PromotionManager: GUI | ArtsGalleryDB: MongoDB | `SaveCoupon(coupon)` | Normal | GUI transmits coupon entity to database. |
| 5 | ArtsGalleryDB: MongoDB | PromotionManager: GUI | `Successful` | Normal | Database confirms coupon insertion. |
| 6 | PromotionManager: GUI | Admin: User | `Coupon saved successfully` | Normal | GUI displays success banner and updates promotions table. |

#### Table 3.14: Action Steps & Viva Explanation for UC-14 (Generate Reports)
| Step | Source | Target | Action / Message | Flow | Presentation & Viva Explanation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Admin: User | ReportManager: GUI | `OpenGUI()` | Normal | Admin navigates to reports & analytics dashboard. |
| 2 | Admin: User | ReportManager: GUI | `SelectReportCriteria(type, startDate, endDate)` | Normal | Admin selects report type (Gross Sales, Artist Commissions, Inventory) and dates. |
| 3 | Admin: User | ReportManager: GUI | `GenerateReport(criteria)` | Normal | Admin clicks "Generate Report" button. |
| 4 | ReportManager: GUI | ArtsGalleryDB: MongoDB | `QueryReportData(criteria)` | Normal | GUI queries aggregated transaction statistics from database. |
| 5 | ArtsGalleryDB: MongoDB | ReportManager: GUI | `Report Data` | Normal | Database returns sales volume, order counts, and artist revenue. |
| 6 | ReportManager: GUI | Admin: User | `Display generated report` | Normal | GUI renders analytics charts, data tables, and export buttons. |

#### Table 3.15: Action Steps & Viva Explanation for UC-15 (Manage Profile & Shipping Address)
| Step | Source | Target | Action / Message | Flow | Presentation & Viva Explanation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Customer: User | ProfileManager: GUI | `OpenGUI()` | Normal | Customer accesses "Profile & Addresses" page. |
| 2 | Customer: User | ProfileManager: GUI | `ViewProfile(customerID)` | Normal | Customer inspects personal details and saved delivery address cards. |
| 3 | ProfileManager: GUI | ArtsGalleryDB: MongoDB | `GetProfileData(customerID)` | Normal | GUI fetches customer profile and address collection. |
| 4 | ArtsGalleryDB: MongoDB | ProfileManager: GUI | `Customer Details` | Normal | Database returns profile entity and address records. |
| 5 | Customer: User | ProfileManager: GUI | `EditAddress(address, city, phone)` | Normal | Customer updates existing address or enters new shipping destination. |
| 6 | Customer: User | ProfileManager: GUI | `Submit(updatedProfile)` | Normal | Customer clicks "Save Profile Changes". |
| 7 | ProfileManager: GUI | ArtsGalleryDB: MongoDB | `SaveProfile(updatedProfile)` | Normal | GUI transmits updated customer entity to database. |
| 8 | ArtsGalleryDB: MongoDB | ProfileManager: GUI | `Successful` | Normal | Database confirms update persistence. |
| 9 | ProfileManager: GUI | Customer: User | `Profile updated successfully` | Normal | GUI renders confirmation banner and updates address card list. |
