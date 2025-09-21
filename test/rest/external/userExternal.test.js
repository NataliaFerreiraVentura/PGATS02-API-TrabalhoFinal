const request = require('supertest');
const { expect } = require('chai');

require('dotenv').config();

describe('Testes nos endpoints para registro e login de usuarios', () => {

    it(' Ao informar dados válidos, deve registrar um novo usuário e retornar status 201 ', async () => {        
        // Usar fixture para gerar usuário único
        const { generateUniqueUser } = require('../fixture/requisicoes/CreateUser/generateUserData');
        const usuarioUnico = generateUniqueUser();
        
        const resposta = await request(process.env.BASE_URL_REST)
            .post('/api/register')
            .send(usuarioUnico);

        expect(resposta.status).to.equal(201);
        expect(resposta.body.message).to.equal('Usuário criado com sucesso');
        expect(resposta.body.success).to.equal(true);
    });
    
    const testesDeErrosDeNegocio = require('../fixture/requisicoes/CreateUser/postCreatUserWithError.json');
    testesDeErrosDeNegocio.forEach((teste) => {
        it(`Testando Regra relacioanda á ${teste.nomeDoTeste}`, async () => {
            const resposta = await request(process.env.BASE_URL_REST)
              .post('/api/register')
              .send(teste.usuarioInvalido);
           expect(resposta.status).to.equal(teste.statusCode);
           expect(resposta.body.message).to.equal(teste.mensagemEsperada);
           expect(resposta.body.success).to.equal(false);
       });
    });
});