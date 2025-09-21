/**
 * Modelo de Registro - Banco em memória
 * 
 * Representa um registro financeiro (entrada/saída) no sistema
 */

class Registro {
    constructor(data = {}) {
        this.id = data.id || null;
        this.tipo = data.tipo || null; // 'entrada' ou 'saida'
        this.valor = data.valor || 0;
        this.descricao = data.descricao || '';
        this.userId = data.userId || null;
        this.dataRegistro = data.dataRegistro || new Date().toISOString();
    }

    /**
     * Valida os dados do registro
     */
    validar() {
        const erros = [];

        // Validação de tipo
        if (!this.tipo || !['entrada', 'saida'].includes(this.tipo)) {
            erros.push('Tipo deve ser "entrada" ou "saida"');
        }

        // Validação de valor
        if (!this.valor || typeof this.valor !== 'number' || this.valor <= 0) {
            erros.push('Valor deve ser um número positivo');
        }

        // Validação de descrição
        if (!this.descricao || typeof this.descricao !== 'string' || this.descricao.trim().length === 0) {
            erros.push('Descrição é obrigatória');
        }

        // Validação de userId
        if (!this.userId || (typeof this.userId !== 'number' && typeof this.userId !== 'string')) {
            erros.push('ID do usuário é obrigatório');
        }

        return erros;
    }

    /**
     * Converte para objeto JSON limpo
     */
    toJSON() {
        return {
            id: this.id,
            tipo: this.tipo,
            valor: this.valor,
            descricao: this.descricao.trim(),
            userId: this.userId,
            dataRegistro: this.dataRegistro
        };
    }
}

// Base de dados em memória para registros
class RegistroDatabase {
    constructor() {
        this.registros = [];
        this.nextId = 1;
    }

    /**
     * Criar um novo registro
     */
    create(dadosRegistro) {
        const registro = new Registro({
            ...dadosRegistro,
            id: this.nextId++,
            dataRegistro: new Date().toISOString()
        });

        const erros = registro.validar();
        if (erros.length > 0) {
            throw new Error(`Dados inválidos: ${erros.join(', ')}`);
        }

        this.registros.push(registro);
        return registro;
    }

    /**
     * Buscar todos os registros de um usuário
     */
    findByUserId(userId) {
        return this.registros.filter(registro => registro.userId === userId);
    }

    /**
     * Buscar registro por ID e usuário
     */
    findByIdAndUserId(id, userId) {
        return this.registros.find(registro =>
            registro.id === parseInt(id) && registro.userId === userId
        );
    }

    /**
     * Atualizar um registro
     */
    update(id, userId, dadosAtualizacao) {
        const registro = this.findByIdAndUserId(id, userId);

        if (!registro) {
            throw new Error('Registro não encontrado');
        }

        // Atualizar campos
        Object.assign(registro, dadosAtualizacao);

        // Validar dados atualizados
        const erros = registro.validar();
        if (erros.length > 0) {
            throw new Error(`Dados inválidos: ${erros.join(', ')}`);
        }

        return registro;
    }

    /**
     * Deletar um registro
     */
    delete(id, userId) {
        const index = this.registros.findIndex(registro =>
            registro.id === parseInt(id) && registro.userId === userId
        );

        if (index === -1) {
            throw new Error('Registro não encontrado');
        }

        const registroDeletado = this.registros.splice(index, 1)[0];
        return registroDeletado;
    }

    /**
     * Calcular saldo do usuário
     */
    calcularSaldo(userId) {
        const registrosUsuario = this.findByUserId(userId);

        if (registrosUsuario.length === 0) {
            return {
                entradas: 0,
                saidas: 0,
                saldo: 0
            };
        }

        const entradas = registrosUsuario
            .filter(r => r.tipo === 'entrada')
            .reduce((total, r) => total + r.valor, 0);

        const saidas = registrosUsuario
            .filter(r => r.tipo === 'saida')
            .reduce((total, r) => total + r.valor, 0);

        return {
            entradas: Number(entradas.toFixed(2)),
            saidas: Number(saidas.toFixed(2)),
            saldo: Number((entradas - saidas).toFixed(2))
        };
    }

    /**
     * Verificar se há saldo suficiente para uma saída
     */
    verificarSaldoSuficiente(userId, valorSaida) {
        const { saldo } = this.calcularSaldo(userId);
        return saldo >= valorSaida;
    }

    /**
     * Limpar todos os registros (útil para testes)
     */
    clear() {
        this.registros = [];
        this.nextId = 1;
    }
}

// Instância singleton do banco de dados
const registroDb = new RegistroDatabase();

module.exports = { Registro, RegistroDatabase, registroDb };