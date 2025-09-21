const app = require('./app');

/**
 * Server Configuration
 * 
 * This file is responsible for starting the HTTP server using the
 * Express application configured in app.js. This separation allows
 * the app to be imported without starting the server, which is
 * essential for testing with frameworks like Supertest.
 */

// Environment configuration
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Start server
const server = app.listen(PORT, () => {
    console.log('🚀 PGATS API - Trabalho Final');
    console.log(`📊 Environment: ${NODE_ENV}`);
    console.log(`🌐 Server running on port: ${PORT}`);
    console.log('');
    console.log('📋 Available endpoints:');
    console.log(`   📖 Documentation: http://localhost:${PORT}/api-docs`);
    console.log('');
    console.log('🔧 Ready for requests!');
});

// Graceful shutdown handlers
const gracefulShutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
        console.log('✅ HTTP server closed');
        console.log('👋 Process terminated gracefully');
        process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
        console.log('❌ Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

// Handle different shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error('❌ Unhandled Promise Rejection:', err.message);
    console.error('Stack:', err.stack);
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err.message);
    console.error('Stack:', err.stack);
    console.log('🔴 Shutting down due to uncaught exception...');
    process.exit(1);
});

// Export server instance for testing purposes
module.exports = server;