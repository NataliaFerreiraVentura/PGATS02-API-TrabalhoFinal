const RegistroService = require('../service/RegistroService');

/**
 * Controller para gerenciar registros financeiros
 */
class RegistroController {

    /**
     * POST /registros - Criar novo registro
     */
    static async criarRegistro(req, res) {
        try {
            const { tipo, valor, descricao } = req.body;
            const userId = req.user.id;

            // Validação do tipo
            if (!tipo) {
                return res.status(400).json({
                    success: false,
                    message: 'Campo tipo é obrigatório',
                    data: null
                });
            }

            if (typeof tipo !== 'string' || !tipo.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Campo tipo inválido',
                    data: null
                });
            }

            if (!['entrada', 'saida'].includes(tipo.toLowerCase().trim())) {
                return res.status(400).json({
                    success: false,
                    message: 'Tipo inválido',
                    data: null
                });
            }

            // Validação do valor
            if (valor === undefined || valor === null) {
                return res.status(400).json({
                    success: false,
                    message: 'Campo valor é obrigatório',
                    data: null
                });
            }

            if (typeof valor !== 'number' && isNaN(parseFloat(valor))) {
                return res.status(400).json({
                    success: false,
                    message: 'Campo valor inválido',
                    data: null
                });
            }

            const valorNumerico = parseFloat(valor);
            if (valorNumerico <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Valor deve ser maior que zero',
                    data: null
                });
            }

            // Validação da descrição
            if (!descricao) {
                return res.status(400).json({
                    success: false,
                    message: 'Campo descrição é obrigatório',
                    data: null
                });
            }

            if (typeof descricao !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'Campo descrição inválido',
                    data: null
                });
            }

            const descricaoLimpa = descricao.toString().trim();
            if (descricaoLimpa.length < 3) {
                return res.status(400).json({
                    success: false,
                    message: 'Descrição deve ter pelo menos 3 caracteres',
                    data: null
                });
            }

            if (descricaoLimpa.length > 255) {
                return res.status(400).json({
                    success: false,
                    message: 'Descrição muito longa',
                    data: null
                });
            }

            const resultado = RegistroService.criarRegistro({
                tipo: tipo.toLowerCase().trim(),
                valor: valorNumerico,
                descricao: descricaoLimpa
            }, userId);

            res.status(201).json({
                success: true,
                message: 'Registro criado com sucesso',
                data: resultado
            });

        } catch (error) {
            console.error('Erro ao criar registro:', error);
            res.status(400).json({
                success: false,
                message: error.message,
                data: null
            });
        }
    }

    /**
     * GET /registros - Listar todos os registros do usuário
     */
    static async listarRegistros(req, res) {
        try {
            const userId = req.user.id;

            const resultado = RegistroService.listarRegistros(userId);

            res.status(200).json({
                success: true,
                message: 'Registros obtidos com sucesso',
                data: resultado
            });

        } catch (error) {
            console.error('Erro ao listar registros:', error);
            res.status(500).json({
                success: false,
                message: error.message,
                data: null
            });
        }
    }

    /**
     * GET /registros/:id - Buscar registro por ID
     */
    static async buscarRegistroPorId(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            // Validação específica do ID
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'ID do registro é obrigatório na URL. Exemplo: /api/registros/123',
                    data: null
                });
            }

            if (isNaN(parseInt(id))) {
                return res.status(400).json({
                    success: false,
                    message: `ID '${id}' não é um número válido. Use apenas números inteiros. Exemplo: /api/registros/123`,
                    data: null
                });
            }

            const idNumerico = parseInt(id);
            if (idNumerico <= 0) {
                return res.status(400).json({
                    success: false,
                    message: `ID '${id}' deve ser um número positivo maior que zero.`,
                    data: null
                });
            }

            const registro = RegistroService.buscarRegistroPorId(idNumerico, userId);

            res.status(200).json({
                success: true,
                message: 'Registro obtido com sucesso',
                data: { registro }
            });

        } catch (error) {
            console.error('Erro ao buscar registro:', error);

            if (error.message.includes('não encontrado')) {
                return res.status(404).json({
                    success: false,
                    message: `Registro com ID ${req.params.id} não foi encontrado ou não pertence a este usuário.`,
                    data: null
                });
            }

            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor ao buscar o registro.',
                data: null
            });
        }
    }

    /**
     * PUT /registros/:id - Atualizar registro
     */
    static async atualizarRegistro(req, res) {
        try {
            const { id } = req.params;
            const { tipo, valor, descricao } = req.body;
            const userId = req.user.id;

            // Validação específica do ID
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'ID do registro é obrigatório na URL',
                    data: null
                });
            }

            if (isNaN(parseInt(id))) {
                return res.status(400).json({
                    success: false,
                    message: `ID '${id}' não é um número válido. Use apenas números inteiros.`,
                    data: null
                });
            }

            const idNumerico = parseInt(id);
            if (idNumerico <= 0) {
                return res.status(400).json({
                    success: false,
                    message: `ID '${id}' deve ser um número positivo maior que zero`,
                    data: null
                });
            }

            // Validação campo por campo
            if (!tipo && !valor && !descricao) {
                return res.status(400).json({
                    success: false,
                    message: 'Pelo menos um campo deve ser fornecido para atualização: tipo, valor ou descricao',
                    data: null
                });
            }

            // Validação do tipo (se fornecido)
            if (tipo !== undefined) {
                if (typeof tipo !== 'string' || !tipo.trim()) {
                    return res.status(400).json({
                        success: false,
                        message: 'Campo "tipo" deve ser uma string não vazia',
                        data: null
                    });
                }

                if (!['entrada', 'saida'].includes(tipo.toLowerCase().trim())) {
                    return res.status(400).json({
                        success: false,
                        message: `Tipo '${tipo}' inválido. Use apenas "entrada" ou "saida"`,
                        data: null
                    });
                }
            }

            // Validação do valor (se fornecido)  
            if (valor !== undefined) {
                if (typeof valor !== 'number' && isNaN(parseFloat(valor))) {
                    return res.status(400).json({
                        success: false,
                        message: `Campo "valor" deve ser um número válido. Recebido: "${valor}"`,
                        data: null
                    });
                }

                const valorNumerico = parseFloat(valor);
                if (valorNumerico <= 0) {
                    return res.status(400).json({
                        success: false,
                        message: `Valor '${valor}' deve ser maior que zero. Valores negativos ou zero não são permitidos`,
                        data: null
                    });
                }
            }

            // Validação da descrição (se fornecida)
            if (descricao !== undefined) {
                if (typeof descricao !== 'string') {
                    return res.status(400).json({
                        success: false,
                        message: 'Campo "descricao" deve ser uma string',
                        data: null
                    });
                }

                const descricaoLimpa = descricao.trim();
                if (descricaoLimpa.length < 3) {
                    return res.status(400).json({
                        success: false,
                        message: `Descrição '${descricao}' deve ter pelo menos 3 caracteres. Atual: ${descricaoLimpa.length} caracteres`,
                        data: null
                    });
                }
            }

            // Preparar dados para atualização (apenas campos fornecidos)
            const dadosAtualizacao = {};
            if (tipo !== undefined) dadosAtualizacao.tipo = tipo.toLowerCase().trim();
            if (valor !== undefined) dadosAtualizacao.valor = parseFloat(valor);
            if (descricao !== undefined) dadosAtualizacao.descricao = descricao.trim();

            const resultado = RegistroService.atualizarRegistro(idNumerico, dadosAtualizacao, userId);

            res.status(200).json({
                success: true,
                message: 'Registro atualizado com sucesso',
                data: resultado
            });

        } catch (error) {
            console.error('Erro ao atualizar registro:', error);

            if (error.message.includes('não encontrado')) {
                return res.status(404).json({
                    success: false,
                    message: error.message,
                    data: null
                });
            }

            if (error.message.includes('Saldo insuficiente')) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                    data: null
                });
            }

            res.status(500).json({
                success: false,
                message: error.message,
                data: null
            });
        }
    }

    /**
     * DELETE /registros/:id - Deletar registro
     */
    static async deletarRegistro(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            // Validação específica do ID
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'ID do registro é obrigatório na URL',
                    data: null
                });
            }

            if (isNaN(parseInt(id))) {
                return res.status(400).json({
                    success: false,
                    message: `ID '${id}' não é um número válido. Use apenas números inteiros.`,
                    data: null
                });
            }

            const idNumerico = parseInt(id);
            if (idNumerico <= 0) {
                return res.status(400).json({
                    success: false,
                    message: `ID '${id}' deve ser um número positivo maior que zero`,
                    data: null
                });
            }

            const resultado = RegistroService.deletarRegistro(idNumerico, userId);

            res.status(200).json({
                success: true,
                message: 'Registro deletado com sucesso',
                data: resultado
            });

        } catch (error) {
            console.error('Erro ao deletar registro:', error);

            if (error.message.includes('não encontrado')) {
                return res.status(404).json({
                    success: false,
                    message: error.message,
                    data: null
                });
            }

            res.status(500).json({
                success: false,
                message: error.message,
                data: null
            });
        }
    }
}

module.exports = RegistroController;