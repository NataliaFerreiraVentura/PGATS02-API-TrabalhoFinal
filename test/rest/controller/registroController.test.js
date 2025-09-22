const request = require('supertest');
const { expect } = require('chai');
const chaiExclude = require('chai-exclude');
const sinon = require('sinon');


const chai = require('chai');
chai.use(chaiExclude);

const app = require('../../../src/app');
const RegistroService = require('../../../service/RegistroService');

const mockData = require('../fixture/mocks/registroServiceMocks.json');
const deveCriarRegistroComSucesso = require('../fixture/respostas/deveCriarRegistroComSucesso.json');
const loginData = require('../fixture/requisicoes/Login/postLogin.json');

describe('Testes - registroController', () => {

    before(async () => {
        const respostaLogin = await request(app)
            .post('/api/login')
            .send(loginData);
        token = respostaLogin.body.data.token;
    });

    afterEach(() => {
        sinon.restore();
    });

    it('Deve registrar um novo registro financeiro com sucesso', async () => {
    
        sinon.stub(RegistroService, 'criarRegistro').returns(deveCriarRegistroComSucesso.data);

        const response = await request(app)
            .post('/api/registros')
            .set('Authorization', `Bearer ${token}`)
            .send({
                tipo: 'entrada',
                valor: 1250.75,
                descricao: 'Salário do mês de setembro'
            });

        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('success', deveCriarRegistroComSucesso.success);
        expect(response.body).to.have.property('message', deveCriarRegistroComSucesso.message);
        expect(response.body).to.have.property('data');
        expect(response.body.data).excluding(['registro.id', 'registro.dataRegistro']).to.deep.equal(
            deveCriarRegistroComSucesso.data
        );
    });

    it('Deve falhar ao tentar registrar um novo registro sem os campos obrigatórios', async () => {
      
        sinon.stub(RegistroService, 'criarRegistro').throws(new Error(mockData.criarRegistroInvalido.message));
        
        const response = await request(app)
            .post('/api/registros')
            .set('Authorization', `Bearer ${token}`)
            .send({
               "tipo": "entrada",
               "valor": 1250.75,
              "descricao": ""
            });

        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('success', false);
        expect(response.body).to.have.property('message', mockData.criarRegistroInvalido.message);
    });
});   