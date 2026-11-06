const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { seedDatabase } = require('./scripts/seed');

// Route imports
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const artworkRoutes = require('./routes/artworkRoutes');
const curationRoutes = require('./routes/curationRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Middleware
app.use(cors({
    origin: [CLIENT_URL, 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome route
app.get('/', (req, res) => {
    res.json({
        service: 'Arts Gallery Web Application REST API',
        status: 'ONLINE',
        endpoints: {
            health: '/api/v1/health',
            auth: '/api/v1/auth',
            artworks: '/api/v1/artworks',
            curation: '/api/v1/curation',
            orders: '/api/v1/orders',
            reviews: '/api/v1/reviews'
        }
    });
});

// Mount API Endpoints
app.use('/api/v1', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/artworks', artworkRoutes);
app.use('/api/v1/curation', curationRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/reviews', reviewRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Server initialization
async function startServer() {
    await connectDB();
    await seedDatabase();
    
    app.listen(PORT, () => {
        console.log(`==================================================`);
        console.log(`[PASS] Arts Gallery API Engine Running`);
        console.log(`[PASS] Server Port: http://localhost:${PORT}`);
        console.log(`[PASS] Health API:  http://localhost:${PORT}/api/v1/health`);
        console.log(`[PASS] Artworks:    http://localhost:${PORT}/api/v1/artworks`);
        console.log(`[PASS] Auth:        http://localhost:${PORT}/api/v1/auth`);
        console.log(`[PASS] Curation:    http://localhost:${PORT}/api/v1/curation`);
        console.log(`[PASS] Orders:      http://localhost:${PORT}/api/v1/orders`);
        console.log(`[PASS] Client Origin: ${CLIENT_URL}`);
        console.log(`==================================================`);
    });
}

if (require.main === module) {
    startServer();
}

module.exports = app;
