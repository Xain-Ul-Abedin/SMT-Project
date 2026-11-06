import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    tcPr.append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>'))

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_document():
    doc = docx.Document()
    
    # Page Margins: 1 inch all around
    sections = doc.sections
    for s in sections:
        s.top_margin = Inches(1.0)
        s.bottom_margin = Inches(1.0)
        s.left_margin = Inches(1.0)
        s.right_margin = Inches(1.0)
        
    primary_color = RGBColor(30, 41, 59)     # Slate 800
    accent_color = RGBColor(15, 76, 129)     # Deep Blue
    sub_color = RGBColor(71, 85, 105)        # Slate 600
    
    # Styles
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = primary_color
    
    # Title & Subtitle
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(36)
    p_title.paragraph_format.space_after = Pt(8)
    run_sub_top = p_title.add_run("ACADEMIC LAB SPECIFICATION & SYSTEM DESIGN MANUAL\n")
    run_sub_top.font.size = Pt(12)
    run_sub_top.font.bold = True
    run_sub_top.font.color.rgb = accent_color
    
    run_main_title = p_title.add_run("ARTS GALLERY WEB APPLICATION\n")
    run_main_title.font.size = Pt(26)
    run_main_title.font.bold = True
    run_main_title.font.color.rgb = primary_color
    
    run_sub_bot = p_title.add_run("Software Methodology & Tools (SMT Fall-24) — Labs 01 to 04 Suite")
    run_sub_bot.font.size = Pt(13)
    run_sub_bot.font.italic = True
    run_sub_bot.font.color.rgb = sub_color
    
    doc.add_paragraph().paragraph_format.space_after = Pt(24)
    
    # Metadata Table
    meta_table = doc.add_table(rows=5, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_data = [
        ("Project Title", "Arts Gallery Web Application (SMT-Project)"),
        ("Course & Term", "Software Methodology & Tools (SMT Fall-24)"),
        ("Academic Institution", "Punjab Tianjin University of Technology (PTUT)"),
        ("Course Instructor", "Sir Muhammad Umar Hayat"),
        ("Engineering Methodology", "Hybrid Waterfall-Spiral Lifecycle Model")
    ]
    for i, (k, v) in enumerate(meta_data):
        row = meta_table.rows[i]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(2.2)
        c1.width = Inches(4.3)
        set_cell_background(c0, "F1F5F9")
        set_cell_margins(c0, 120, 120, 150, 150)
        set_cell_margins(c1, 120, 120, 150, 150)
        
        p0 = c0.paragraphs[0]
        r0 = p0.add_run(k)
        r0.font.bold = True
        r0.font.size = Pt(10)
        
        p1 = c1.paragraphs[0]
        r1 = p1.add_run(v)
        r1.font.size = Pt(10)
        
    doc.add_page_break()
    
    # LAB 01: SRS
    h1 = doc.add_heading("Lab 01: Software Requirement Specification (SRS)", level=1)
    h1.paragraph_format.space_before = Pt(18)
    h1.paragraph_format.space_after = Pt(12)
    
    doc.add_heading("1. Project Scope", level=2)
    p_scope1 = doc.add_paragraph(
        "The scope of this project is to design, model, and develop a comprehensive web-based Arts Gallery Web Application that enables visual artists to exhibit and monetize their original creative works, while allowing art collectors and casual visitors to browse curated exhibitions, inspect high-definition artwork specifications, purchase artworks through secure payment gateways, and track order fulfillment. Gallery administrators oversee content moderation, curatorial approvals, user management, and platform analytics."
    )
    p_scope1.paragraph_format.space_after = Pt(8)
    
    p_scope2 = doc.add_paragraph(
        "On the customer side, the application enables visitors to browse catalog galleries, filter by artistic medium (Oil, Acrylic, Watercolor, Digital, Canvas), search by price and dimensions, view detailed authenticity specifications, manage a persistent shopping cart, checkout via Stripe or Cash on Delivery (COD), track order dispatch milestones, and submit verified collector reviews."
    )
    p_scope2.paragraph_format.space_after = Pt(8)
    
    p_scope3 = doc.add_paragraph(
        "On the administrator side, the platform provides complete management over artwork listings, artist profiles, inventory status states (AVAILABLE, RESERVED, SOLD), customer order verification, transaction auditing, refund processing, and business intelligence reporting."
    )
    p_scope3.paragraph_format.space_after = Pt(8)
    
    p_scope4 = doc.add_paragraph(
        "Out of Scope: Multi-warehouse supply chain logistics, live telemetry tracking for courier delivery vans, and live physical auction bidding engines are excluded from this release and reserved for future system iterations."
    )
    p_scope4.paragraph_format.space_after = Pt(14)
    
    doc.add_heading("2. Functional Requirements (FR-01 to FR-20)", level=2)
    frs = [
        ("FR-01", "Customers and artists can register and securely log in to their account."),
        ("FR-02", "Customers can browse artworks organized by category and medium (Oil, Acrylic, Watercolor, Digital, Canvas)."),
        ("FR-03", "Customers can search and filter artworks by keyword, medium, dimensions, price range, and artist name."),
        ("FR-04", "Customers can view comprehensive artwork details (high-resolution photographs, medium, dimensions, artist bio, framing details, authenticity certificate)."),
        ("FR-05", "Customers can add or remove available artwork pieces to/from their persistent shopping cart."),
        ("FR-06", "Customers can place an order and select their preferred payment channel."),
        ("FR-07", "Customers can complete payment through multiple options (Credit/Debit Card via Stripe Gateway, Cash on Delivery COD)."),
        ("FR-08", "Customers can track real-time shipment status of their order (Pending, In Curation, Dispatched, Shipped, Delivered)."),
        ("FR-09", "Customers can view purchase history and download digital authenticity certificates and invoices."),
        ("FR-10", "Customers can submit return and refund requests for damaged delivered items within the allowable return window."),
        ("FR-11", "Customers can manage their collector profile, contact details, and shipping address book."),
        ("FR-12", "Customers can leave verified ratings (1 to 5 stars) and qualitative reviews on delivered artworks."),
        ("FR-13", "Artists and Gallery Administrators can add, edit, or archive artwork listings and categories."),
        ("FR-14", "Admin can manage artwork inventory, stock units, and lifecycle availability states (AVAILABLE, RESERVED, SOLD)."),
        ("FR-15", "Admin can review, verify, process, or cancel incoming customer artwork orders."),
        ("FR-16", "Admin can update shipping courier tracking numbers and fulfillment status."),
        ("FR-17", "Admin can audit payment reconciliation records and process electronic customer refunds."),
        ("FR-18", "Admin can manage registered user accounts (view profiles, verify artist credentials, suspend or delete accounts)."),
        ("FR-19", "Admin can generate business intelligence reports (gross sales volume, commission splits, inventory turnover, top-performing artists)."),
        ("FR-20", "Admin can create and manage promotional discount coupons and seasonal exhibition promo codes.")
    ]
    for code, desc in frs:
        p_fr = doc.add_paragraph(style='List Bullet')
        r_code = p_fr.add_run(f"[{code}] ")
        r_code.font.bold = True
        p_fr.add_run(desc)
        p_fr.paragraph_format.space_after = Pt(4)
        
    doc.add_heading("3. Non-Functional Requirements (NFR-01 to NFR-11)", level=2)
    nfrs = [
        ("NFR-01 (Performance)", "Web pages and artwork catalog galleries shall load within 2 to 3 seconds under normal network conditions."),
        ("NFR-02 (Concurrency)", "The platform shall concurrently support multiple collectors browsing and placing orders without performance degradation."),
        ("NFR-03 (Security)", "All authentication tokens and customer financial data shall be encrypted using industry-standard protocols (HTTPS, JWT, bcrypt password hashing)."),
        ("NFR-04 (Access Control)", "Administrative panels and curatorial management workflows shall be strictly restricted to authenticated Admin roles."),
        ("NFR-05 (Availability)", "The online gallery shall maintain 99.5% operational uptime, accessible 24/7."),
        ("NFR-06 (Usability)", "The user interface shall feature high-legibility typography, clear contrast ratios, and intuitive consumer navigation."),
        ("NFR-07 (Responsiveness)", "The application shall render responsively across mobile, tablet, and desktop viewports."),
        ("NFR-08 (Reliability & Fault Tolerance)", "The system shall gracefully handle transaction exceptions and input errors without loss of cart or order state."),
        ("NFR-09 (Scalability)", "The database architecture shall scale horizontally to support thousands of high-resolution artwork assets and registered users."),
        ("NFR-10 (Maintainability)", "The codebase shall follow modular, decoupled architectural separation between presentation, API, and database layers."),
        ("NFR-11 (Data Integrity)", "Order, inventory, and payment ledgers shall remain strictly synchronized to prevent double-booking of one-of-a-kind artworks.")
    ]
    for code, desc in nfrs:
        p_nfr = doc.add_paragraph(style='List Bullet')
        r_code = p_nfr.add_run(f"[{code}] ")
        r_code.font.bold = True
        p_nfr.add_run(desc)
        p_nfr.paragraph_format.space_after = Pt(4)
        
    doc.add_page_break()
    
    # LAB 02: USE CASE MODELING
    h2 = doc.add_heading("Lab 02: Use Case Modeling & Specifications", level=1)
    h2.paragraph_format.space_before = Pt(18)
    h2.paragraph_format.space_after = Pt(12)
    
    doc.add_heading("1. Actor Definitions & Roles", level=2)
    p_act = doc.add_paragraph(
        "The Arts Gallery Web Application interacts with two primary stakeholder roles:\n"
        "1. Customer (Art Collector / Buyer): Browses public exhibitions, filters pieces, manages cart, executes purchases, tracks delivery, and rates acquired art.\n"
        "2. Administrator (Gallery Curator / Manager): Moderates artwork listings, reviews curatorial approvals, oversees order dispatches, reconciles payments, and analyzes sales performance."
    )
    p_act.paragraph_format.space_after = Pt(12)
    
    doc.add_heading("2. Complete Tabular Use Case Specifications (UC-01 to UC-15)", level=2)
    
    ucs = [
        {
            "id": "01", "name": "Register", "actor": "Customer",
            "desc": "New customer creates an account on the arts gallery platform.",
            "pre": "Customer has internet access and navigates to the registration screen.",
            "post": "New customer account record is persisted in the database.",
            "actions": [
                "1. Customer selects 'Register'.",
                "2. Customer inputs name, email, password, and contact details.",
                "3. System validates entered input.",
                "4. System creates the new customer record.",
                "5. System redirects customer to the login screen or homepage."
            ],
            "alt": "Customer registers using federated OAuth (Google) authentication.",
            "exc": "If email already exists or required fields are omitted, system displays validation error and prevents account creation."
        },
        {
            "id": "02", "name": "Login", "actor": "Customer",
            "desc": "Existing customer authenticates to access personalized gallery features.",
            "pre": "Customer possesses a registered account and accesses the login screen.",
            "post": "Customer session is authenticated and authorized with JWT token.",
            "actions": [
                "1. Customer enters email and password.",
                "2. Customer clicks 'Login'.",
                "3. System verifies credentials against database.",
                "4. System issues session token and redirects to storefront."
            ],
            "alt": "Customer selects 'Forgot Password' to initiate credentials recovery.",
            "exc": "If credentials are invalid, system displays 'Invalid email or password' and denies access."
        },
        {
            "id": "03", "name": "Browse & Search Artworks", "actor": "Customer",
            "desc": "Customer browses artwork collections by medium or applies multi-attribute search filters.",
            "pre": "Customer accesses gallery catalog page.",
            "post": "Matching artwork collection is retrieved and displayed.",
            "actions": [
                "1. Customer selects a medium category (Oil, Acrylic, Digital) or types search keywords.",
                "2. Customer applies price range and dimension filters.",
                "3. System queries artwork collection in database.",
                "4. System renders matching artwork cards."
            ],
            "alt": "Customer resets search filters to view default featured exhibition.",
            "exc": "If no artworks match filter parameters, system displays 'No artworks found matching criteria'."
        },
        {
            "id": "04", "name": "View Artwork Details", "actor": "Customer",
            "desc": "Customer inspects comprehensive artwork information, high-res photos, dimensions, and reviews.",
            "pre": "Customer selects an artwork card from catalog.",
            "post": "Detailed artwork exhibition page is rendered.",
            "actions": [
                "1. Customer clicks on artwork card.",
                "2. System retrieves artwork details (images, medium, dimensions, artist bio, price, authenticity cert).",
                "3. System displays artwork detail page."
            ],
            "alt": "Customer zooms in on high-resolution canvas texture imagery.",
            "exc": "If artwork is marked SOLD, system disables 'Add to Cart' and displays 'Original Piece Sold'."
        },
        {
            "id": "05", "name": "Manage Cart", "actor": "Customer",
            "desc": "Customer adds, adjusts, or removes artwork items from the persistent shopping cart.",
            "pre": "Customer is logged in and viewing an artwork detail page.",
            "post": "Shopping cart contents and subtotal are updated in database.",
            "actions": [
                "1. Customer clicks 'Add to Cart'.",
                "2. System validates availability status in database.",
                "3. System updates cart items and displays confirmation banner.",
                "4. Customer opens cart to inspect items or remove pieces."
            ],
            "alt": "Customer moves artwork piece to Wishlist.",
            "exc": "If artwork was reserved by another buyer during session, system displays 'Artwork no longer available' and removes it from cart."
        },
        {
            "id": "06", "name": "Checkout & Payment", "actor": "Customer",
            "desc": "Customer enters delivery address, selects payment channel (Card/COD), and places confirmed order.",
            "pre": "Customer is logged in with active items in cart.",
            "post": "Order is persisted with unique Order ID; artwork status moves to RESERVED.",
            "actions": [
                "1. Customer clicks 'Checkout'.",
                "2. System displays order summary and delivery fees.",
                "3. Customer inputs shipping address.",
                "4. Customer selects payment method (Card or COD).",
                "5. Customer confirms order.",
                "6. System authorizes payment and generates order invoice."
            ],
            "alt": "Customer applies valid promotional discount code prior to payment.",
            "exc": "If payment gateway authorization fails, system displays error and prompts customer to re-enter payment credentials."
        },
        {
            "id": "07", "name": "Track Order Status", "actor": "Customer",
            "desc": "Customer checks real-time fulfillment and shipping progress for an order.",
            "pre": "Customer possesses an active Order ID or navigates to order history.",
            "post": "Current order fulfillment stage and courier tracking timeline are presented.",
            "actions": [
                "1. Customer navigates to 'My Orders'.",
                "2. System retrieves customer orders.",
                "3. Customer selects specific order.",
                "4. System displays tracking stepper (Pending, In Curation, Shipped, Delivered)."
            ],
            "alt": "Customer clicks 'Download PDF Invoice & Authenticity Certificate'.",
            "exc": "If Order ID is invalid, system returns error 'Order not found'."
        },
        {
            "id": "08", "name": "Feedback & Returns", "actor": "Customer",
            "desc": "Customer submits review and rating, or files a return claim for a delivered artwork.",
            "pre": "Target order status is marked Delivered in database.",
            "post": "Review is published or return request ticket is registered.",
            "actions": [
                "1. Customer opens delivered order.",
                "2. Customer selects 'Write Review' or 'Request Return'.",
                "3. For review: enters 1-5 star rating and comments.",
                "4. For return: selects reason and uploads photo proof.",
                "5. System stores feedback or routes claim to gallery admin."
            ],
            "alt": "Customer updates previously submitted review.",
            "exc": "If return request is submitted after return window expires (e.g. 7 days), system rejects return and allows review submission only."
        },
        {
            "id": "09", "name": "Manage Artworks & Inventory", "actor": "Admin",
            "desc": "Admin adds new artwork listings, edits specifications, updates pricing, or archives pieces.",
            "pre": "Admin is authenticated with gallery management privileges.",
            "post": "Artwork catalog and inventory states are updated in database.",
            "actions": [
                "1. Admin accesses 'Artwork Management' panel.",
                "2. Admin selects Add/Edit/Archive.",
                "3. Admin inputs title, medium, dimensions, price, and images.",
                "4. System validates parameters and saves artwork record.",
                "5. Artwork updates live on public gallery."
            ],
            "alt": "Admin imports artwork listings in bulk via spreadsheet.",
            "exc": "If required fields or high-resolution images are missing, system displays validation error and blocks save."
        },
        {
            "id": "10", "name": "Manage Orders", "actor": "Admin",
            "desc": "Admin inspects customer orders and updates fulfillment status (Confirmed, Shipped, Delivered).",
            "pre": "Admin is logged in to the order management console.",
            "post": "Order fulfillment status and tracking milestones are updated in database.",
            "actions": [
                "1. Admin opens 'Orders' dashboard.",
                "2. System displays order queue.",
                "3. Admin selects an order.",
                "4. Admin updates status (e.g., Shipped) and inputs courier tracking code.",
                "5. System persists update and dispatches notification to customer."
            ],
            "alt": "Admin filters orders by status (Pending, In Curation, Shipped).",
            "exc": "If an order is already marked Delivered, system prevents rollback to Pending."
        },
        {
            "id": "11", "name": "Manage Payments & Refunds", "actor": "Admin",
            "desc": "Admin audits financial transactions, reconciles payouts, and processes authorized refunds.",
            "pre": "Admin has financial clearance credentials.",
            "post": "Refund transaction is recorded and database status is marked Refunded.",
            "actions": [
                "1. Admin navigates to 'Payments & Ledgers'.",
                "2. System renders transaction history.",
                "3. Admin selects transaction for return/cancellation.",
                "4. Admin initiates electronic refund.",
                "5. System communicates with payment gateway and marks record Refunded."
            ],
            "alt": "Admin exports monthly settled financial statement as CSV/Excel.",
            "exc": "If gateway refund fails, system logs transaction error and alerts admin for manual reconciliation."
        },
        {
            "id": "12", "name": "Manage Users & Accounts", "actor": "Admin",
            "desc": "Admin views registered accounts, verifies artist portfolios, and moderates user statuses.",
            "pre": "Admin is authenticated on management portal.",
            "post": "User account status (Active, Verified Artist, Suspended) is updated in database.",
            "actions": [
                "1. Admin accesses 'Users & Artists' module.",
                "2. System displays registered users.",
                "3. Admin selects a user profile.",
                "4. Admin reviews credentials, verifies artist status, or suspends account.",
                "5. System updates account state in database."
            ],
            "alt": "Admin resets a user's password credentials on verified request.",
            "exc": "System blocks deletion of any customer account with active, undelivered artwork orders."
        },
        {
            "id": "13", "name": "Manage Promotions & Discounts", "actor": "Admin",
            "desc": "Admin configures seasonal exhibition discount codes, percentage cuts, and validity windows.",
            "pre": "Admin is logged in to promotions manager.",
            "post": "Promotion code is persisted in database and active at checkout.",
            "actions": [
                "1. Admin opens 'Promotions' panel.",
                "2. Admin inputs code name, percentage discount, minimum order, and expiration date.",
                "3. System validates input and persists coupon.",
                "4. Code becomes immediately redeemable by customers."
            ],
            "alt": "Admin deactivates an active promotion code prior to expiration.",
            "exc": "If code string already exists, system displays duplicate code error and halts save."
        },
        {
            "id": "14", "name": "Generate Reports", "actor": "Admin",
            "desc": "Admin compiles business reports regarding sales revenue, artist performance, and artwork turnover.",
            "pre": "Historical sales and artwork transaction data exist in database.",
            "post": "Business intelligence report is generated, rendered, and ready for export.",
            "actions": [
                "1. Admin opens 'Reports & Analytics' dashboard.",
                "2. Admin selects report type (Gross Sales, Artist Commissions, Inventory Turnover) and date range.",
                "3. System aggregates analytics metrics.",
                "4. System renders charts and summary data tables."
            ],
            "alt": "Admin exports report as PDF or Excel spreadsheet.",
            "exc": "If no transaction records exist within chosen date span, system displays 'No data recorded for this time range'."
        },
        {
            "id": "15", "name": "Manage Profile & Shipping Address", "actor": "Customer",
            "desc": "Customer updates personal information, phone number, and physical shipping address book.",
            "pre": "Customer is authenticated and accesses 'My Profile'.",
            "post": "Updated profile and address records are saved in database.",
            "actions": [
                "1. Customer opens 'Profile & Addresses' page.",
                "2. System loads existing profile records.",
                "3. Customer edits address or adds a new delivery destination.",
                "4. Customer clicks 'Save Changes'.",
                "5. System persists updated entity in database."
            ],
            "alt": "Customer selects an address as 'Default Shipping Destination' for 1-click checkout.",
            "exc": "If postal code or contact number format is invalid, system displays field validation error."
        }
    ]
    
    for uc in ucs:
        p_uc_h = doc.add_paragraph()
        p_uc_h.paragraph_format.space_before = Pt(12)
        p_uc_h.paragraph_format.space_after = Pt(4)
        r_uc_h = p_uc_h.add_run(f"UC-{uc['id']}: {uc['name']}")
        r_uc_h.font.bold = True
        r_uc_h.font.size = Pt(13)
        r_uc_h.font.color.rgb = accent_color
        
        table = doc.add_table(rows=8, cols=2)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        
        fields = [
            ("UC ID", uc["id"]),
            ("UC Name", uc["name"]),
            ("Actor", uc["actor"]),
            ("Description", uc["desc"]),
            ("Precondition", uc["pre"]),
            ("Postcondition", uc["post"]),
            ("Action Steps", "\n".join(uc["actions"])),
            ("Alternative / Exception", f"Alternative: {uc['alt']}\nException: {uc['exc']}")
        ]
        
        for idx, (lbl, val) in enumerate(fields):
            row = table.rows[idx]
            c0, c1 = row.cells[0], row.cells[1]
            c0.width = Inches(1.8)
            c1.width = Inches(4.7)
            set_cell_background(c0, "F8FAFC")
            set_cell_margins(c0, 80, 80, 100, 100)
            set_cell_margins(c1, 80, 80, 100, 100)
            
            p0 = c0.paragraphs[0]
            r0 = p0.add_run(lbl)
            r0.font.bold = True
            r0.font.size = Pt(9.5)
            
            p1 = c1.paragraphs[0]
            r1 = p1.add_run(val)
            r1.font.size = Pt(9.5)
            
        doc.add_paragraph().paragraph_format.space_after = Pt(8)
        
    doc.add_page_break()
    
    # LAB 03 & 04: PRESENTATION SEQUENCE DIAGRAMS & RTM
    h3 = doc.add_heading("Lab 03 & 04: System Design, Sequence Diagrams & RTM", level=1)
    h3.paragraph_format.space_before = Pt(18)
    h3.paragraph_format.space_after = Pt(12)
    
    doc.add_heading("1. Academic Presentation Sequence Architecture", level=2)
    p_arch = doc.add_paragraph(
        "In academic evaluations and viva examinations conducted by Sir Umar Hayat, UML sequence diagrams model dynamic interactions using a high-signal 3-lifeline presentation abstraction:\n"
        "Actor (User / Admin) ---> Boundary GUI (Screen / Page) ---> Persistent Entity Store (Database) [+ External Gateway]\n\n"
        "- Lifeline 1 (Actor): The human operator initiating action (Customer or Admin).\n"
        "- Lifeline 2 (GUI Boundary): The presentation interface capturing user inputs and displaying feedback.\n"
        "- Lifeline 3 (Database): The persistent data store maintaining collections and transaction state.\n"
        "- External Lifeline (PaymentGateway): External banking API processing card charges and refunds."
    )
    p_arch.paragraph_format.space_after = Pt(12)
    
    doc.add_heading("2. Requirements Traceability Matrix (RTM)", level=2)
    p_rtm_intro = doc.add_paragraph(
        "The following matrix maps every Functional Requirement from Lab 01 SRS directly to its corresponding presentation Use Case and Sequence Diagram:"
    )
    p_rtm_intro.paragraph_format.space_after = Pt(8)
    
    rtm_table = doc.add_table(rows=21, cols=3)
    rtm_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    
    headers = ["Requirement ID", "Functional Requirement Statement (Lab 01)", "Mapped Use Case & Sequence Diagram"]
    hdr_row = rtm_table.rows[0]
    for c_idx, h_text in enumerate(headers):
        cell = hdr_row.cells[c_idx]
        set_cell_background(cell, "0F4C81")
        p = cell.paragraphs[0]
        r = p.add_run(h_text)
        r.font.bold = True
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(255, 255, 255)
        set_cell_margins(cell, 100, 100, 100, 100)
        
    rtm_data = [
        ("FR-01", "Customers and artists can register and securely log in to their account.", "UC-01 (Register), UC-02 (Login)"),
        ("FR-02", "Customers can browse artworks organized by category and medium.", "UC-03 (Browse & Search Artworks)"),
        ("FR-03", "Customers can search and filter artworks by keyword, medium, dimensions, price.", "UC-03 (Browse & Search Artworks)"),
        ("FR-04", "Customers can view comprehensive artwork details, dimensions, and artist bio.", "UC-04 (View Artwork Details)"),
        ("FR-05", "Customers can add or remove available artwork pieces to/from the shopping cart.", "UC-05 (Manage Cart)"),
        ("FR-06", "Customers can place an order and select their preferred payment channel.", "UC-06 (Checkout & Payment)"),
        ("FR-07", "Customers can complete payment through multiple options (Card / COD).", "UC-06 (Checkout & Payment)"),
        ("FR-08", "Customers can track real-time shipment status of their order.", "UC-07 (Track Order Status)"),
        ("FR-09", "Customers can view purchase history and download authenticity certificates.", "UC-07 (Track Order Status)"),
        ("FR-10", "Customers can submit return and refund requests for damaged delivered items.", "UC-08 (Feedback & Returns)"),
        ("FR-11", "Customers can manage their collector profile and shipping address book.", "UC-15 (Manage Profile & Shipping Address)"),
        ("FR-12", "Customers can leave verified ratings (1-5 stars) and reviews on delivered artworks.", "UC-08 (Feedback & Returns)"),
        ("FR-13", "Artists and Gallery Administrators can add, edit, or archive artwork listings.", "UC-09 (Manage Artworks & Inventory)"),
        ("FR-14", "Admin can manage artwork inventory and lifecycle availability states.", "UC-09 (Manage Artworks & Inventory)"),
        ("FR-15", "Admin can review, verify, process, or cancel incoming customer orders.", "UC-10 (Manage Orders)"),
        ("FR-16", "Admin can update shipping courier tracking numbers and fulfillment status.", "UC-10 (Manage Orders)"),
        ("FR-17", "Admin can audit payment reconciliation records and process customer refunds.", "UC-11 (Manage Payments & Refunds)"),
        ("FR-18", "Admin can manage registered user accounts (view, verify, suspend).", "UC-12 (Manage Users & Accounts)"),
        ("FR-19", "Admin can generate business intelligence reports (sales, commissions, turnover).", "UC-14 (Generate Reports)"),
        ("FR-20", "Admin can create and manage promotional discount coupons and promo codes.", "UC-13 (Manage Promotions & Discounts)")
    ]
    
    for r_idx, (r_id, r_stmt, r_map) in enumerate(rtm_data):
        row = rtm_table.rows[r_idx + 1]
        c0, c1, c2 = row.cells[0], row.cells[1], row.cells[2]
        c0.width = Inches(1.3)
        c1.width = Inches(3.2)
        c2.width = Inches(2.0)
        
        bg = "F8FAFC" if r_idx % 2 == 0 else "FFFFFF"
        for c, text, is_bold in [(c0, r_id, True), (c1, r_stmt, False), (c2, r_map, True)]:
            set_cell_background(c, bg)
            set_cell_margins(c, 80, 80, 100, 100)
            p = c.paragraphs[0]
            r = p.add_run(text)
            r.font.bold = is_bold
            r.font.size = Pt(9)
            
    doc.add_page_break()
    
    # 3. Action Steps & Presentation Flow Tables for Viva Defense
    doc.add_heading("3. Sequence Diagram Action Steps & Presentation Flow Tables", level=2)
    p_seq_intro = doc.add_paragraph(
        "Each table below details the message protocol, execution flow, and academic viva explanation for all 15 system use cases:"
    )
    p_seq_intro.paragraph_format.space_after = Pt(12)
    
    seq_tables_data = [
        ("UC-01: Register", [
            ("1", "Customer: User", "Register: GUI", "OpenGUI()", "Normal", "Customer clicks 'Register' on gallery navigation header."),
            ("2", "Customer: User", "Register: GUI", "EnterDetails(name, email, password, phone)", "Normal", "Customer fills out registration input fields."),
            ("3", "Customer: User", "Register: GUI", "Submit(customer)", "Normal", "Customer clicks the submit button to register."),
            ("4", "Register: GUI", "ArtsGalleryDB: MongoDB", "CheckEmail(email)", "Normal", "GUI queries database to verify email uniqueness."),
            ("5", "ArtsGalleryDB: MongoDB", "Register: GUI", "Unique", "Normal", "Database confirms email is not previously registered."),
            ("6", "Register: GUI", "ArtsGalleryDB: MongoDB", "Save(customer)", "Normal", "GUI transmits customer entity to be inserted into database."),
            ("7", "ArtsGalleryDB: MongoDB", "Register: GUI", "Successful", "Normal", "Database returns success acknowledgement."),
            ("8", "Register: GUI", "Customer: User", "Account created successfully", "Normal", "GUI displays confirmation message and redirects to login.")
        ]),
        ("UC-02: Login", [
            ("1", "Customer: User", "Login: GUI", "OpenGUI()", "Normal", "Customer clicks login button on store navigation bar."),
            ("2", "Customer: User", "Login: GUI", "EnterCredentials(email, password)", "Normal", "Customer enters email and password into login fields."),
            ("3", "Customer: User", "Login: GUI", "Submit(credentials)", "Normal", "Customer clicks the login submit button."),
            ("4", "Login: GUI", "ArtsGalleryDB: MongoDB", "ValidateUser(email, password)", "Normal", "GUI queries database to verify user credentials."),
            ("5", "ArtsGalleryDB: MongoDB", "Login: GUI", "User Found", "Normal", "Database verifies credentials and returns matching user profile."),
            ("6", "Login: GUI", "Customer: User", "Login successful", "Normal", "GUI creates user session and redirects customer to storefront.")
        ]),
        ("UC-03: Browse and Search Artworks", [
            ("1", "Customer: User", "BrowseGallery: GUI", "OpenGUI()", "Normal", "Customer accesses the gallery catalog page."),
            ("2", "Customer: User", "BrowseGallery: GUI", "SelectMedium(mediumID)", "Normal", "Customer selects artwork medium (Oil, Acrylic, Canvas)."),
            ("3", "Customer: User", "BrowseGallery: GUI", "EnterFilterQuery(keyword, priceRange)", "Normal", "Customer specifies keyword, size, or price filters."),
            ("4", "Customer: User", "BrowseGallery: GUI", "SubmitSearch(filters)", "Normal", "Customer triggers the search filtering operation."),
            ("5", "BrowseGallery: GUI", "ArtsGalleryDB: MongoDB", "QueryArtworks(filters)", "Normal", "GUI queries artwork collection in database."),
            ("6", "ArtsGalleryDB: MongoDB", "BrowseGallery: GUI", "Artwork List", "Normal", "Database returns list of matched available artwork records."),
            ("7", "BrowseGallery: GUI", "Customer: User", "Display artwork grid", "Normal", "GUI renders artwork card exhibition grid.")
        ]),
        ("UC-04: View Artwork Details", [
            ("1", "Customer: User", "ArtworkDetails: GUI", "SelectArtwork(artworkID)", "Normal", "Customer clicks on an artwork card in the catalog."),
            ("2", "ArtworkDetails: GUI", "ArtsGalleryDB: MongoDB", "GetArtworkDetails(artworkID)", "Normal", "GUI fetches detailed artwork attributes from database."),
            ("3", "ArtsGalleryDB: MongoDB", "ArtworkDetails: GUI", "Artwork Details", "Normal", "Database returns images, medium, dimensions, price, and artist bio."),
            ("4", "ArtworkDetails: GUI", "ArtsGalleryDB: MongoDB", "GetReviews(artworkID)", "Normal", "GUI queries verified customer feedback and star ratings."),
            ("5", "ArtsGalleryDB: MongoDB", "ArtworkDetails: GUI", "Reviews List", "Normal", "Database returns list of approved customer reviews."),
            ("6", "ArtworkDetails: GUI", "Customer: User", "Display artwork details & reviews", "Normal", "GUI presents detailed exhibition view with high-res photos.")
        ]),
        ("UC-05: Manage Cart", [
            ("1", "Customer: User", "Cart: GUI", "OpenGUI()", "Normal", "Customer opens the shopping cart drawer."),
            ("2", "Customer: User", "Cart: GUI", "AddToCart(artworkID)", "Normal", "Customer adds artwork piece to cart."),
            ("3", "Cart: GUI", "ArtsGalleryDB: MongoDB", "CheckAvailability(artworkID)", "Normal", "GUI queries stock and availability state in database."),
            ("4", "ArtsGalleryDB: MongoDB", "Cart: GUI", "Available", "Normal", "Database confirms artwork is available in inventory."),
            ("5", "Customer: User", "Cart: GUI", "RemoveItem(artworkID)", "Normal", "Customer removes artwork piece or adjusts framing options."),
            ("6", "Cart: GUI", "ArtsGalleryDB: MongoDB", "SaveCart(cartItems)", "Normal", "GUI persists updated cart contents in database."),
            ("7", "ArtsGalleryDB: MongoDB", "Cart: GUI", "Successful", "Normal", "Database confirms cart changes are saved."),
            ("8", "Cart: GUI", "Customer: User", "Cart updated successfully", "Normal", "GUI updates subtotal and displays updated cart list.")
        ]),
        ("UC-06: Checkout & Payment", [
            ("1", "Customer: User", "Checkout: GUI", "OpenGUI()", "Normal", "Customer initiates checkout from shopping cart."),
            ("2", "Customer: User", "Checkout: GUI", "EnterShippingDetails(address, city, phone)", "Normal", "Customer enters physical shipping destination and contact."),
            ("3", "Customer: User", "Checkout: GUI", "SelectPaymentMethod(method, cardInfo)", "Normal", "Customer chooses payment method (Card or COD)."),
            ("4", "Customer: User", "Checkout: GUI", "SubmitOrder(order)", "Normal", "Customer clicks 'Place Order' button."),
            ("5", "Checkout: GUI", "PaymentGateway: Stripe", "ProcessPayment(amount, cardInfo)", "Normal", "GUI initiates payment charge via payment gateway."),
            ("6", "PaymentGateway: Stripe", "Checkout: GUI", "Payment Approved", "Normal", "Payment gateway authorizes transaction and returns approval token."),
            ("7", "Checkout: GUI", "ArtsGalleryDB: MongoDB", "SaveOrder(order, txID)", "Normal", "GUI saves confirmed order and marks artwork RESERVED in DB."),
            ("8", "ArtsGalleryDB: MongoDB", "Checkout: GUI", "Successful", "Normal", "Database confirms order record persistence and inventory lock."),
            ("9", "Checkout: GUI", "Customer: User", "Order placed successfully", "Normal", "GUI displays order confirmation number and receipt details.")
        ]),
        ("UC-07: Track Order Status", [
            ("1", "Customer: User", "OrderTracking: GUI", "OpenGUI()", "Normal", "Customer opens the 'Track Order' page."),
            ("2", "Customer: User", "OrderTracking: GUI", "EnterTrackingInfo(orderID)", "Normal", "Customer types in their unique order number."),
            ("3", "Customer: User", "OrderTracking: GUI", "Submit(orderID)", "Normal", "Customer clicks the track button."),
            ("4", "OrderTracking: GUI", "ArtsGalleryDB: MongoDB", "GetOrderStatus(orderID)", "Normal", "GUI queries current fulfillment status from database."),
            ("5", "ArtsGalleryDB: MongoDB", "OrderTracking: GUI", "Order Status Details", "Normal", "Database returns courier info, shipment status, and timestamps."),
            ("6", "OrderTracking: GUI", "Customer: User", "Display order status", "Normal", "GUI displays visual delivery progress stepper and item summary.")
        ]),
        ("UC-08: Feedback & Returns", [
            ("1", "Customer: User", "FeedbackReturn: GUI", "OpenGUI()", "Normal", "Customer opens the feedback and returns page."),
            ("2", "Customer: User", "FeedbackReturn: GUI", "SelectOrder(orderID)", "Normal", "Customer chooses the delivered artwork item."),
            ("3", "Customer: User", "FeedbackReturn: GUI", "EnterFeedbackOrReturn(rating, comment, reason)", "Normal", "Customer provides star rating, comments, or return reason with photo."),
            ("4", "Customer: User", "FeedbackReturn: GUI", "Submit(request)", "Normal", "Customer clicks submit button."),
            ("5", "FeedbackReturn: GUI", "ArtsGalleryDB: MongoDB", "SaveFeedbackOrReturn(request)", "Normal", "GUI inserts review or return ticket into database."),
            ("6", "ArtsGalleryDB: MongoDB", "FeedbackReturn: GUI", "Successful", "Normal", "Database confirms persistence of request record."),
            ("7", "FeedbackReturn: GUI", "Customer: User", "Request submitted successfully", "Normal", "GUI displays acknowledgment message and return ticket reference.")
        ]),
        ("UC-09: Manage Artworks & Inventory", [
            ("1", "Admin: User", "ArtworkManager: GUI", "OpenGUI()", "Normal", "Admin navigates to 'Manage Artworks' tab in admin portal."),
            ("2", "Admin: User", "ArtworkManager: GUI", "EnterArtworkDetails(id, title, medium, price, dimensions)", "Normal", "Admin inputs artwork code, title, medium, price, and specs."),
            ("3", "Admin: User", "ArtworkManager: GUI", "Submit(artwork)", "Normal", "Admin clicks 'Save Artwork' button."),
            ("4", "ArtworkManager: GUI", "ArtsGalleryDB: MongoDB", "SaveArtwork(artwork)", "Normal", "GUI submits artwork entity to database for insertion or update."),
            ("5", "ArtsGalleryDB: MongoDB", "ArtworkManager: GUI", "Successful", "Normal", "Database confirms successful artwork write operation."),
            ("6", "ArtworkManager: GUI", "Admin: User", "Artwork saved successfully", "Normal", "GUI displays confirmation banner and refreshes catalog list.")
        ]),
        ("UC-10: Manage Orders", [
            ("1", "Admin: User", "OrderManager: GUI", "OpenGUI()", "Normal", "Admin accesses the Order Management interface."),
            ("2", "Admin: User", "OrderManager: GUI", "ViewOrders()", "Normal", "Admin clicks to load recent customer orders."),
            ("3", "OrderManager: GUI", "ArtsGalleryDB: MongoDB", "GetOrdersList()", "Normal", "GUI requests active orders from database."),
            ("4", "ArtsGalleryDB: MongoDB", "OrderManager: GUI", "Orders Data", "Normal", "Database returns order summaries and customer details."),
            ("5", "Admin: User", "OrderManager: GUI", "UpdateOrderStatus(orderID, status)", "Normal", "Admin selects new status (e.g. Shipped) and inputs tracking number."),
            ("6", "OrderManager: GUI", "ArtsGalleryDB: MongoDB", "SaveStatus(orderID, status)", "Normal", "GUI transmits updated status to database."),
            ("7", "ArtsGalleryDB: MongoDB", "OrderManager: GUI", "Successful", "Normal", "Database persists updated status and timestamp."),
            ("8", "OrderManager: GUI", "Admin: User", "Order status updated successfully", "Normal", "GUI displays success notification and updates order table.")
        ]),
        ("UC-11: Manage Payments & Refunds", [
            ("1", "Admin: User", "PaymentManager: GUI", "OpenGUI()", "Normal", "Admin navigates to Payment Management screen."),
            ("2", "Admin: User", "PaymentManager: GUI", "ViewTransactions()", "Normal", "Admin clicks to inspect financial transactions."),
            ("3", "PaymentManager: GUI", "ArtsGalleryDB: MongoDB", "GetPayments()", "Normal", "GUI queries transaction history from database."),
            ("4", "ArtsGalleryDB: MongoDB", "PaymentManager: GUI", "Payment Records", "Normal", "Database returns payment records, gateways, and statuses."),
            ("5", "Admin: User", "PaymentManager: GUI", "IssueRefund(txID, amount)", "Normal", "Admin selects transaction and clicks 'Process Refund'."),
            ("6", "PaymentManager: GUI", "PaymentGateway: Stripe", "ProcessRefund(txID, amount)", "Normal", "GUI contacts external payment gateway to issue electronic refund."),
            ("7", "PaymentGateway: Stripe", "PaymentManager: GUI", "Refund Approved", "Normal", "Payment gateway approves refund and returns refund reference."),
            ("8", "PaymentManager: GUI", "ArtsGalleryDB: MongoDB", "UpdatePaymentStatus(txID, 'Refunded')", "Normal", "GUI updates payment record to 'Refunded' in database."),
            ("9", "ArtsGalleryDB: MongoDB", "PaymentManager: GUI", "Successful", "Normal", "Database confirms update of financial record."),
            ("10", "PaymentManager: GUI", "Admin: User", "Refund processed successfully", "Normal", "GUI displays refund completion message and updated balance.")
        ]),
        ("UC-12: Manage Users & Accounts", [
            ("1", "Admin: User", "UserManager: GUI", "OpenGUI()", "Normal", "Admin navigates to User Management tab."),
            ("2", "Admin: User", "UserManager: GUI", "ViewUsers()", "Normal", "Admin requests registered users list."),
            ("3", "UserManager: GUI", "ArtsGalleryDB: MongoDB", "GetUserList()", "Normal", "GUI queries registered user records from database."),
            ("4", "ArtsGalleryDB: MongoDB", "UserManager: GUI", "User Records", "Normal", "Database returns user data (names, emails, join dates, statuses)."),
            ("5", "Admin: User", "UserManager: GUI", "UpdateAccountStatus(userID, status)", "Normal", "Admin selects account and updates status (e.g. Active, Suspended, Verified Artist)."),
            ("6", "UserManager: GUI", "ArtsGalleryDB: MongoDB", "SaveUserStatus(userID, status)", "Normal", "GUI sends updated account status to database."),
            ("7", "ArtsGalleryDB: MongoDB", "UserManager: GUI", "Successful", "Normal", "Database confirms user status update."),
            ("8", "UserManager: GUI", "Admin: User", "User status updated successfully", "Normal", "GUI displays confirmation notice and refreshes user table.")
        ]),
        ("UC-13: Manage Promotions & Discounts", [
            ("1", "Admin: User", "PromotionManager: GUI", "OpenGUI()", "Normal", "Admin opens the Promotions & Discounts management module."),
            ("2", "Admin: User", "PromotionManager: GUI", "EnterCouponDetails(code, discount, expiryDate)", "Normal", "Admin inputs coupon code, discount percentage, and expiry date."),
            ("3", "Admin: User", "PromotionManager: GUI", "Submit(coupon)", "Normal", "Admin clicks 'Create Promotion' button."),
            ("4", "PromotionManager: GUI", "ArtsGalleryDB: MongoDB", "SaveCoupon(coupon)", "Normal", "GUI transmits coupon entity to database."),
            ("5", "ArtsGalleryDB: MongoDB", "PromotionManager: GUI", "Successful", "Normal", "Database confirms insertion of promotion record."),
            ("6", "PromotionManager: GUI", "Admin: User", "Coupon saved successfully", "Normal", "GUI displays success notification and updates promotions table.")
        ]),
        ("UC-14: Generate Reports", [
            ("1", "Admin: User", "ReportManager: GUI", "OpenGUI()", "Normal", "Admin navigates to the 'Reports & Analytics' dashboard."),
            ("2", "Admin: User", "ReportManager: GUI", "SelectReportCriteria(type, startDate, endDate)", "Normal", "Admin selects report type (Gross Sales, Artist Commissions, Inventory) and dates."),
            ("3", "Admin: User", "ReportManager: GUI", "GenerateReport(criteria)", "Normal", "Admin clicks 'Generate Report' button."),
            ("4", "ReportManager: GUI", "ArtsGalleryDB: MongoDB", "QueryReportData(criteria)", "Normal", "GUI queries aggregated analytics data from database."),
            ("5", "ArtsGalleryDB: MongoDB", "ReportManager: GUI", "Report Data", "Normal", "Database returns revenue metrics, order quantities, and artwork stats."),
            ("6", "ReportManager: GUI", "Admin: User", "Display generated report", "Normal", "GUI renders charts, data tables, and download options.")
        ]),
        ("UC-15: Manage Profile & Shipping Address", [
            ("1", "Customer: User", "ProfileManager: GUI", "OpenGUI()", "Normal", "Customer opens the 'Profile & Addresses' page."),
            ("2", "Customer: User", "ProfileManager: GUI", "ViewProfile(customerID)", "Normal", "Customer views personal details and address card list."),
            ("3", "ProfileManager: GUI", "ArtsGalleryDB: MongoDB", "GetProfileData(customerID)", "Normal", "GUI fetches current profile and address entries from database."),
            ("4", "ArtsGalleryDB: MongoDB", "ProfileManager: GUI", "Customer Details", "Normal", "Database returns customer entity and address book records."),
            ("5", "Customer: User", "ProfileManager: GUI", "EditAddress(address, city, phone)", "Normal", "Customer modifies address details or adds a new address."),
            ("6", "Customer: User", "ProfileManager: GUI", "Submit(updatedProfile)", "Normal", "Customer clicks 'Save Profile Changes'."),
            ("7", "ProfileManager: GUI", "ArtsGalleryDB: MongoDB", "SaveProfile(updatedProfile)", "Normal", "GUI transmits updated entity to database."),
            ("8", "ArtsGalleryDB: MongoDB", "ProfileManager: GUI", "Successful", "Normal", "Database confirms persistence of updated customer information."),
            ("9", "ProfileManager: GUI", "Customer: User", "Profile updated successfully", "Normal", "GUI displays confirmation banner and refreshes address view.")
        ])
    ]
    
    for title, steps in seq_tables_data:
        p_t = doc.add_paragraph()
        p_t.paragraph_format.space_before = Pt(14)
        p_t.paragraph_format.space_after = Pt(4)
        r_t = p_t.add_run(f"Action Steps & Presentation Flow for {title}")
        r_t.font.bold = True
        r_t.font.size = Pt(11)
        r_t.font.color.rgb = accent_color
        
        tbl = doc.add_table(rows=len(steps) + 1, cols=6)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        
        headers_seq = ["Step", "Source", "Target", "Action / Message", "Flow", "Presentation & Viva Explanation"]
        h_row = tbl.rows[0]
        for col_i, text in enumerate(headers_seq):
            cell = h_row.cells[col_i]
            set_cell_background(cell, "1E293B")
            p = cell.paragraphs[0]
            r = p.add_run(text)
            r.font.bold = True
            r.font.size = Pt(8.5)
            r.font.color.rgb = RGBColor(255, 255, 255)
            set_cell_margins(cell, 80, 80, 80, 80)
            
        for s_idx, (st, src, tgt, act, flw, exp) in enumerate(steps):
            row = tbl.rows[s_idx + 1]
            c_bg = "F8FAFC" if s_idx % 2 == 0 else "FFFFFF"
            for c_i, c_val in enumerate([st, src, tgt, act, flw, exp]):
                cell = row.cells[c_i]
                set_cell_background(cell, c_bg)
                set_cell_margins(cell, 60, 60, 80, 80)
                p = cell.paragraphs[0]
                r = p.add_run(c_val)
                r.font.size = Pt(8)
                if c_i == 0:
                    r.font.bold = True
                    
        doc.add_paragraph().paragraph_format.space_after = Pt(6)
        
    doc.save("Brain/01_Projects/SMT-Project/docs/Arts_Gallery_SMT_Labs_1_to_4.docx")
    print("Arts_Gallery_SMT_Labs_1_to_4.docx generated successfully.")

if __name__ == "__main__":
    create_document()
