// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);

    // Default error
    let error = {
        success: false,
        message: err.message || 'Erro interno do servidor'
    };

    // JWT specific errors
    if (err.name === 'JsonWebTokenError') {
        error.message = 'Token inválido';
        return res.status(401).json(error);
    }

    if (err.name === 'TokenExpiredError') {
        error.message = 'Token expirado';
        return res.status(401).json(error);
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        error.message = 'Dados inválidos fornecidos';
        return res.status(400).json(error);
    }

    // Cast errors (usually from bad ObjectId format)
    if (err.name === 'CastError') {
        error.message = 'ID inválido';
        return res.status(400).json(error);
    }

    // Duplicate key error
    if (err.code === 11000) {
        error.message = 'Usuário já existe';
        return res.status(400).json(error);
    }

    // Default to 500 server error
    res.status(err.statusCode || 500).json(error);
};

// Not found middleware
const notFound = (req, res, next) => {
    const error = new Error(`Rota não encontrada - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Validation middleware
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        next();
    };
};

// Request logger middleware
const requestLogger = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
};

module.exports = {
    errorHandler,
    notFound,
    validateRequest,
    requestLogger
};