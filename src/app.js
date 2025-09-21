const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../docs/swagger.json');

// Import middleware
const { errorHandler, notFound, requestLogger } = require('../middleware/errorHandler');
const { authenticateToken } = require('../middleware/auth');

// Import controllers
const UserController = require('../controller/UserController');
const RegistroController = require('../controller/RegistroController');

/**
 * Express Application Configuration
 * 
 * This file configures the Express application without starting the server.
 * This separation allows for easier testing with Supertest and better
 * modularity by keeping server concerns separate from app configuration.
 */

// Create Express app instance
const app = express();

// Trust proxy (useful for deployment behind reverse proxies)
app.set('trust proxy', 1);

// Security and CORS middleware - More permissive configuration
app.use((req, res, next) => {
    // Allow all origins in development
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
});

// Backup CORS middleware
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'Cache-Control', 'Pragma']
}));

// Request logging middleware
app.use(requestLogger);

// Body parsing middleware
app.use(express.json({
    limit: '10mb',
    type: 'application/json'
}));
app.use(express.urlencoded({
    extended: true,
    limit: '10mb'
}));

// Swagger documentation endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'PGATS API Documentation'
}));

// ===============================
// ROTAS DE AUTENTICAÇÃO (sem token)
// ===============================

/**
 * POST /api/register - Registrar novo usuário
 */
app.post('/api/register', UserController.register);

/**
 * POST /api/login - Autenticar usuário
 */
app.post('/api/login', UserController.login);

// ===============================
// ROTAS DE REGISTROS (com token)
// ===============================

/**
 * POST /api/registros - Criar novo registro financeiro
 */
app.post('/api/registros', authenticateToken, RegistroController.criarRegistro);

/**
 * GET /api/registros - Listar todos os registros do usuário
 */
app.get('/api/registros', authenticateToken, RegistroController.listarRegistros);

/**
 * GET /api/registros/:id - Buscar registro por ID
 */
app.get('/api/registros/:id', authenticateToken, RegistroController.buscarRegistroPorId);

/**
 * PUT /api/registros/:id - Atualizar registro
 */
app.put('/api/registros/:id', authenticateToken, RegistroController.atualizarRegistro);

/**
 * DELETE /api/registros/:id - Deletar registro
 */
app.delete('/api/registros/:id', authenticateToken, RegistroController.deletarRegistro);

// 404 handler for undefined routes
app.use(notFound);

// Global error handler (must be last middleware)
app.use(errorHandler);

// Export app instance for use in server.js and testing
module.exports = app;