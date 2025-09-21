const { registroDb } = require('../model/Registro');

/**
 * Serviço para gerenciar registros financeiros
 * 
 * Contém toda a lógica de negócio para operações com registros
 */
class RegistroService {

    /**
     * Criar um novo registro
     */
    static criarRegistro(dadosRegistro, userId) {
        try {
            // Validar se é uma saída e se há saldo suficiente
            if (dadosRegistro.tipo === 'saida') {
                const saldoSuficiente = registroDb.verificarSaldoSuficiente(userId, dadosRegistro.valor);

                if (!saldoSuficiente) {
                    const { saldo } = registroDb.calcularSaldo(userId);
                    const faltam = dadosRegistro.valor - saldo;
                    throw new Error(`Saldo insuficiente para a saída de R$ ${dadosRegistro.valor.toFixed(2)}. Saldo atual: R$ ${saldo.toFixed(2)}. Faltam: R$ ${faltam.toFixed(2)}`);
                }
            }

            // Criar o registro
            const registro = registroDb.create({
                ...dadosRegistro,
                userId
            });

            // Retornar registro com saldo atualizado
            const { saldo } = registroDb.calcularSaldo(userId);

            return {
                registro: registro.toJSON(),
                saldoAtual: saldo
            };

        } catch (error) {
            // Não adicionar prefixo se já é uma mensagem de saldo
            if (error.message.includes('Saldo insuficiente')) {
                throw error;
            }
            throw new Error(`Erro ao criar registro: ${error.message}`);
        }
    }

    /**
     * Listar todos os registros do usuário
     */
    static listarRegistros(userId) {
        try {
            const registros = registroDb.findByUserId(userId);
            const { entradas, saidas, saldo } = registroDb.calcularSaldo(userId);

            return {
                registros: registros.map(r => r.toJSON()),
                resumo: {
                    totalEntradas: entradas,
                    totalSaidas: saidas,
                    saldo,
                    quantidadeRegistros: registros.length
                }
            };

        } catch (error) {
            throw new Error(`Erro ao listar registros: ${error.message}`);
        }
    }

    /**
     * Buscar registro por ID
     */
    static buscarRegistroPorId(id, userId) {
        try {
            const registro = registroDb.findByIdAndUserId(id, userId);

            if (!registro) {
                throw new Error('Registro não encontrado');
            }

            return registro.toJSON();

        } catch (error) {
            if (error.message.includes('não encontrado')) {
                throw error;
            }
            throw new Error(`Erro ao buscar registro: ${error.message}`);
        }
    }

    /**
     * Atualizar registro
     */
    static atualizarRegistro(id, dadosAtualizacao, userId) {
        try {
            // Buscar o registro atual
            const registroAtual = registroDb.findByIdAndUserId(id, userId);

            if (!registroAtual) {
                throw new Error('Registro não encontrado');
            }

            // Se está mudando de entrada para saída, ou aumentando valor de saída
            if (dadosAtualizacao.tipo === 'saida' || 
                (registroAtual.tipo === 'saida' && dadosAtualizacao.valor !== undefined)) {
                
                // Calcular saldo temporário (removendo o registro atual)
                const registrosUsuario = registroDb.findByUserId(userId);
                const outrosRegistros = registrosUsuario.filter(r => r.id !== parseInt(id));

                const entradasTemp = outrosRegistros
                    .filter(r => r.tipo === 'entrada')
                    .reduce((total, r) => total + r.valor, 0);

                const saidasTemp = outrosRegistros
                    .filter(r => r.tipo === 'saida')
                    .reduce((total, r) => total + r.valor, 0);

                const saldoTemporario = entradasTemp - saidasTemp;

                // Usar o valor atual do registro ou o novo valor
                const valorSaida = dadosAtualizacao.valor !== undefined ? 
                    dadosAtualizacao.valor : registroAtual.valor;

                // Verificar se o novo valor de saída é válido
                if (saldoTemporario < valorSaida) {
                    const faltam = valorSaida - saldoTemporario;
                    throw new Error(`Saldo insuficiente para atualizar o registro para saída de R$ ${valorSaida.toFixed(2)}. Saldo disponível (sem este registro): R$ ${saldoTemporario.toFixed(2)}. Faltam: R$ ${faltam.toFixed(2)}`);
                }
            }

            // Atualizar o registro
            const registroAtualizado = registroDb.update(id, userId, dadosAtualizacao);
            const { saldo } = registroDb.calcularSaldo(userId);

            return {
                registro: registroAtualizado.toJSON(),
                saldoAtual: saldo
            };

        } catch (error) {
            if (error.message.includes('não encontrado') || error.message.includes('Saldo insuficiente')) {
                throw error;
            }
            throw new Error(`Erro ao atualizar registro: ${error.message}`);
        }
    }

    /**
     * Deletar registro
     */
    static deletarRegistro(id, userId) {
        try {
            // Verificar se o registro existe antes de tentar deletar
            const registro = registroDb.findByIdAndUserId(id, userId);
            if (!registro) {
                throw new Error('Registro não encontrado');
            }

            const registroDeletado = registroDb.delete(id, userId);
            const { saldo } = registroDb.calcularSaldo(userId);

            return {
                registroDeletado: registroDeletado.toJSON(),
                saldoAtual: saldo
            };

        } catch (error) {
            if (error.message.includes('não encontrado')) {
                throw error;
            }
            throw new Error(`Erro ao deletar registro: ${error.message}`);
        }
    }

    /**
     * Obter resumo financeiro do usuário
     */
    static obterResumo(userId) {
        try {
            const { entradas, saidas, saldo } = registroDb.calcularSaldo(userId);
            const registros = registroDb.findByUserId(userId);

            return {
                saldo,
                totalEntradas: entradas,
                totalSaidas: saidas,
                quantidadeRegistros: registros.length,
                ultimosRegistros: registros
                    .sort((a, b) => new Date(b.dataRegistro) - new Date(a.dataRegistro))
                    .slice(0, 5)
                    .map(r => r.toJSON())
            };

        } catch (error) {
            throw new Error(`Erro ao obter resumo: ${error.message}`);
        }
    }
}

module.exports = RegistroService;