const request = require('supertest');
const { expect } = require('chai');

require('dotenv').config();

describe('Testes nos endpoints de registros financeiros', () => {
    
    before(async () => {
        const postLogin = require('../fixture/requisicoes/Login/postLogin.json');
        const respostaLogin = await request(process.env.BASE_URL_REST)
            .post('/api/login')
            .send(postLogin);
        token = respostaLogin.body.data.token;
    });
    
    const testesRegistrosFinanceiros = require('../fixture/requisicoes/registrosFinanceiros/postRegistroFinanceiros.json')
    testesRegistrosFinanceiros.forEach((teste) => {
        it(`Testando Regra realacionada á ${teste.nomeDoTeste}`, async () => {
            const resposta = await request(process.env.BASE_URL_REST)
            .post('/api/registros')
            .set('Authorization', `Bearer ${token}`)
            .send(teste.registroFinanceiro);
            expect(resposta.status).to.equal(teste.statusCode);
            expect(resposta.body.message).to.equal(teste.mensagemEsperada);
        })
    })
})

