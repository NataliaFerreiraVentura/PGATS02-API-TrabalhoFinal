const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');

const app = require('../../../src/app');
const userService = require('../../../service/UserService');

const mockData = require('../fixture/mocks/userServiceMocks.json');
const expectedResponses = require('../fixture/respostas/userControllerExpected.json');
const { generateUniqueUser, generateExistingUserData } = require('../fixture/requisicoes/CreateUser/generateUserData');

describe('Testes - userController', () => {

    afterEach(() => {
        sinon.restore();
    });

    it('Deve registrar um novo usuário com sucesso', async () => {
    
        sinon.stub(userService, 'registerUser').returns(mockData.registerUserSuccess);
        
        const usuarioUnico = generateUniqueUser();

       
        const response = await request(app)
            .post('/api/register')
            .send(usuarioUnico);

        expect(response.status).to.equal(expectedResponses.registerSuccess.expectedStatus);
        expect(response.body.message).to.equal(mockData.registerUserSuccess.message);
        expect(response.body.success).to.equal(expectedResponses.registerSuccess.expectedSuccess);
        expect(response.body.data.username).to.equal(mockData.registerUserSuccess.username);
    });

    it('Deve falhar ao tentar registrar um usuário com username já existente', async () => {
        
        sinon.stub(userService, 'registerUser').throws(new Error(mockData.registerUserError.message));
        
        const existingUserData = generateExistingUserData();

        const response = await request(app)
            .post('/api/register')
            .send(existingUserData);

        
        expect(response.status).to.equal(409); 
        expect(response.body.success).to.equal(false);
        expect(response.body.message).to.equal(mockData.registerUserError.message);
    });
});