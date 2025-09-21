const bcrypt = require('bcryptjs');
const { User, findUserByUsername, addUser } = require('../model/User');
const { generateToken } = require('../middleware/auth');

class UserService {
    // Register a new user
    static async registerUser(username, password) {
        try {
            // Validate input
            if (!username || !password) {
                throw new Error('Username e senha são obrigatórios');
            }

            if (username.trim().length < 3) {
                throw new Error('Username deve ter pelo menos 3 caracteres');
            }

            if (password.length < 6) {
                throw new Error('Senha deve ter pelo menos 6 caracteres');
            }

            // Check if user already exists
            const existingUser = findUserByUsername(username.trim());
            if (existingUser) {
                throw new Error('Usuário já existe com este username');
            }

            // Hash password
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);

            // Create and add user
            const newUser = new User(username.trim(), passwordHash);
            addUser(newUser);

            return {
                user: newUser.getPublicData()
            };
        } catch (error) {
            throw error;
        }
    }

    // Login user
    static async loginUser(username, password) {
        try {
            // Validate input
            if (!username || !password) {
                throw new Error('Username e senha são obrigatórios');
            }

            // Find user
            const user = findUserByUsername(username.trim());
            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            // Check password
            const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
            if (!isPasswordValid) {
                throw new Error('Senha incorreta');
            }

            // Generate token
            const token = generateToken(user);

            return {
                user: user.getPublicData(),
                token
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserService;