const UserService = require('../service/UserService');

class UserController {
    // Register a new user
    static async register(req, res, next) {
        try {
            const { username, password } = req.body;

            const result = await UserService.registerUser(username, password);

            res.status(201).json({
                success: true,
                message: 'Usuário criado com sucesso',
                data: result
            });
        } catch (error) {
            // Retornar erro personalizado baseado na mensagem do service
            let status = 400;
            let message = error.message;

            // Mapear erros específicos para status codes apropriados
            if (error.message.includes('já existe') || error.message.includes('já cadastrado')) {
                status = 409; // Conflict
            } else if (error.message.includes('não encontrado')) {
                status = 404; // Not Found
            }

            res.status(status).json({
                success: false,
                message: message
            });
        }
    }

    // Login user
    static async login(req, res, next) {
        try {
            const { username, password } = req.body;

            const result = await UserService.loginUser(username, password);

            res.status(200).json({
                success: true,
                message: 'Login realizado com sucesso',
                data: result
            });
        } catch (error) {
            // Retornar erro personalizado baseado na mensagem do service
            let status = 401;
            let message = error.message;

            // Mapear erros específicos para status codes apropriados
            if (error.message.includes('Dados inválidos')) {
                status = 400; // Bad Request
            }

            res.status(status).json({
                success: false,
                message: message
            });
        }
    }
}

module.exports = UserController;