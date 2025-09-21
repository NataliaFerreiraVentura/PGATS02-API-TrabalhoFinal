const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');

const app = require('../../../src/app');
const userService = require('../../../service/UserService');

// Fixtures
const requestData = {
    success: require('../fixture/requisicoes/CreateUser/postCreateUserWithSuccess.json'),
    error: require('../fixture/requisicoes/CreateUser/postCreatUserWithError.json')[1] // Usuario já existente
};
const mockData = require('../fixture/mocks/userServiceMocks.json');
const expectedResponses = require('../fixture/respostas/userControllerExpected.json');

describe('Testes - userController', () => {

    afterEach(() => {
        sinon.restore();
    });

    it('Deve registrar um novo usuário com sucesso', async () => {
           
        sinon.stub(userService, 'registerUser').returns(mockData.registerUserSuccess);

        const response = await request(app)
            .post('/api/register')
            .send(requestData.success);

        expect(response.status).to.equal(expectedResponses.registerSuccess.expectedStatus);
        expect(response.body.message).to.equal(expectedResponses.registerSuccess.expectedMessage);
        expect(response.body.success).to.equal(expectedResponses.registerSuccess.expectedSuccess);
        expect(response.body.data.username).to.equal(mockData.registerUserSuccess.username);
    });

    it('Deve falhar ao tentar registrar um usuário com username já existente', async () => {

        sinon.stub(userService, 'registerUser').returns(mockData.registerUserError);

        const response = await request(app)
            .post('/api/register')
            .send(requestData.error.usuarioInvalido);

        expect(response.status).to.equal(expectedResponses.registerUserExists.expectedStatus);
        expect(response.body.message).to.equal(expectedResponses.registerUserExists.expectedMessage);
        expect(response.body.success).to.equal(expectedResponses.registerUserExists.expectedSuccess);
    });
});