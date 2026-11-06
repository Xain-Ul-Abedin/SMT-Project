/**
 * Centralized API Error Handling Middleware
 */
function errorHandler(err, req, res, next) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
}

function notFound(req, res, next) {
    res.status(404).json({
        success: false,
        message: `Endpoint Not Found - [${req.method}] ${req.originalUrl}`
    });
}

module.exports = { errorHandler, notFound };
