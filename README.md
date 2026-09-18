# Arts Gallery Web Application (SMT-Project)

Public repository for the **Arts Gallery Web Application** developed for the Virtual University of Pakistan (VU) Software Engineering project curriculum.

---

## 1. Overview & System Scope

The **Arts Gallery Web Application** is an online platform that bridges visual artists, art collectors, and gallery visitors. The platform facilitates virtual artwork exhibition, artwork management, role-based access control, e-commerce cart & checkout, order shipping tracking, customer reviews, and administrative curation.

### Key Roles Supported
1. **Visitor (Unauthenticated)**: Browse gallery, search artwork by category/artist, view details, share links on social media.
2. **Customer (Registered)**: Add items to cart, checkout with Card or COD, track order shipping status, rate and review purchased artwork.
3. **Seller / Artist (Registered)**: Maintain artist profile, list artwork with high-res photos, edit/delete listings, mark items as `SOLD`.
4. **Administrator (Gallery Owner)**: Curation pipeline to approve/disapprove artwork, manage user accounts, oversee shipping, and view revenue analytics.

---

## 2. Technology Stack

- **Frontend**: React.js / Next.js, Tailwind CSS, Framer Motion
- **Backend API**: Node.js (Express.js / NestJS)
- **Database**: PostgreSQL with Prisma ORM
- **Media Asset Storage**: Cloudinary / AWS S3 API
- **Containerization**: Docker & Docker Compose
- **CI/CD Pipeline**: GitHub Actions
- **Supervisor**: Manahil Hassan (`manahil.hassan@vu.edu.pk`)

---

## 3. Repository Directory Structure

```
SMT-Project/
├── .github/
│   └── workflows/
│       └── ci-cd.yml             # Automated CI/CD build & test pipeline
├── docs/
│   └── SRS.md                    # Comprehensive IEEE Software Requirements Specification
├── docker/
│   ├── Dockerfile.frontend       # Multi-stage build for React frontend
│   └── Dockerfile.backend        # Container build for Node.js API server
├── docker-compose.yml            # Local development orchestration (DB + API + Web)
├── .env.example                  # Environment variables template
├── .gitignore                    # Git tracking exclusion rules
└── README.md                     # Project documentation & devops manual
```

---

## 4. Quickstart & Local Setup

### Prerequisites
- Node.js `v18+` or `v20+`
- PostgreSQL `v15+` or Docker Desktop
- Git

### Using Docker Compose (Recommended)
1. Clone the public repository:
   ```bash
   git clone https://github.com/your-username/SMT-Project.git
   cd SMT-Project
   ```
2. Create local environment file:
   ```bash
   cp .env.example .env
   ```
3. Launch the containerized stack:
   ```bash
   docker-compose up -d --build
   ```
4. Access services:
   - Frontend UI: `http://localhost:3000`
   - Backend API: `http://localhost:5000/api`
   - Database: `localhost:5432`

---

## 5. CI/CD Pipeline Architecture

This repository utilizes **GitHub Actions** for continuous integration and continuous deployment:

```mermaid
flowchart LR
    Push["Git Push / PR (main)"] --> Quality["Linting & Type Check"]
    Quality --> Test["Unit & Integration Tests"]
    Test --> Build["Docker Container Build"]
    Build --> Deploy["Production Edge Deployment"]
```

- **Pipeline Stages**:
  - `Lint`: ESLint and Prettier code quality check.
  - `Test`: Jest unit test suites for API controllers and database models.
  - `Build`: Automated Docker multi-stage image verification.
  - `Deploy`: Automated deployment trigger upon push to `main` branch.

---

## 6. Environment Variables

Create a `.env` file based on `.env.example`:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/arts_gallery_db
JWT_SECRET=super_secret_jwt_key_arts_gallery
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 7. License & Compliance

Developed under the Software Engineering & DevOps Orchestration Framework (Siesta & Aizen). All code adheres to project security and architectural guidelines.
