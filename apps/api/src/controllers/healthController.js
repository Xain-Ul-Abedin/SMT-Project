const { getDbState } = require('../config/db');

/**
 * Health Check Controller
 * GET /api/v1/health
 */
function checkHealth(req, res) {
    const dbState = getDbState();
    
    res.status(200).json({
        success: true,
        service: 'Arts Gallery Web Application API',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
        database: {
            mode: dbState.mode,
            status: dbState.status,
            host: dbState.host
        },
        architecture: {
            topology: 'Decoupled N-Tier Microservices',
            costMonthly: '$0.00',
            framework: 'Express.js + Mongoose'
        }
    });
}

module.exports = { checkHealth };
