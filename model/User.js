// In-memory database for users
let users = [];
let entradaIdCounter = 1;
let saidaIdCounter = 1;

// Initialize with pre-created users
const bcrypt = require('bcryptjs');

// Create pre-defined users
const initializeDefaultUsers = () => {
    if (users.length === 0) {
        // Admin user - sem transações iniciais
        const adminUser = new User('Naty', bcrypt.hashSync('123456', 10));
        users.push(adminUser);

        // Test user - sem transações iniciais
        const testUser = new User('Nathan', bcrypt.hashSync('test123', 10));
        users.push(testUser);
    }
};

class User {
    constructor(username, passwordHash) {
        this.username = username;
        this.passwordHash = passwordHash;
        this.saldo = 0;
        this.entradas = [];
        this.saidas = [];
    }

    // Add entrada (income)
    addEntrada(valor, descricao) {
        const entrada = {
            id: entradaIdCounter++,
            valor: parseFloat(valor),
            descricao: descricao,
            data: new Date().toISOString()
        };
        this.entradas.push(entrada);
        this.saldo += entrada.valor;
        return entrada;
    }

    // Add saida (expense)
    addSaida(valor, descricao) {
        const saida = {
            id: saidaIdCounter++,
            valor: parseFloat(valor),
            descricao: descricao,
            data: new Date().toISOString()
        };
        this.saidas.push(saida);
        this.saldo -= saida.valor;
        return saida;
    }

    // Get all transactions
    getAllTransactions() {
        return {
            entradas: this.entradas,
            saidas: this.saidas,
            saldo: this.saldo
        };
    }

    // Get transaction by type and id
    getTransactionById(type, id) {
        if (type === 'entrada') {
            return this.entradas.find(e => e.id === parseInt(id));
        } else if (type === 'saida') {
            return this.saidas.find(s => s.id === parseInt(id));
        }
        return null;
    }

    // Update transaction
    updateTransaction(type, id, valor, descricao) {
        const transaction = this.getTransactionById(type, id);
        if (!transaction) return null;

        // Update balance by removing old value and adding new one
        if (type === 'entrada') {
            this.saldo -= transaction.valor;
            transaction.valor = parseFloat(valor);
            transaction.descricao = descricao;
            this.saldo += transaction.valor;
        } else if (type === 'saida') {
            this.saldo += transaction.valor;
            transaction.valor = parseFloat(valor);
            transaction.descricao = descricao;
            this.saldo -= transaction.valor;
        }

        return transaction;
    }

    // Delete transaction
    deleteTransaction(type, id) {
        if (type === 'entrada') {
            const index = this.entradas.findIndex(e => e.id === parseInt(id));
            if (index !== -1) {
                const deleted = this.entradas.splice(index, 1)[0];
                this.saldo -= deleted.valor;
                return deleted;
            }
        } else if (type === 'saida') {
            const index = this.saidas.findIndex(s => s.id === parseInt(id));
            if (index !== -1) {
                const deleted = this.saidas.splice(index, 1)[0];
                this.saldo += deleted.valor;
                return deleted;
            }
        }
        return null;
    }

    // Get user data without sensitive information
    getPublicData() {
        return {
            username: this.username,
            saldo: this.saldo,
            entradas: this.entradas,
            saidas: this.saidas
        };
    }
}

module.exports = {
    User,
    users,
    // Helper functions for database operations
    findUserByUsername: (username) => {
        return users.find(user => user.username === username);
    },

    addUser: (user) => {
        users.push(user);
        return user;
    },

    getAllUsers: () => {
        return users.map(user => user.getPublicData());
    },

    // Reset database (useful for testing)
    resetDatabase: () => {
        users.length = 0;
        entradaIdCounter = 1;
        saidaIdCounter = 1;
    },

    // Initialize default users
    initializeDefaultUsers
};

// Initialize default users when module is loaded
initializeDefaultUsers();