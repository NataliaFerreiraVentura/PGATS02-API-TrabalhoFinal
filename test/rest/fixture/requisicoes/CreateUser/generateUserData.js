const generateUniqueUser = () => {
    return {
        username: `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        password: "senha123"
    };
};

const generateExistingUserData = () => {
    // Para testes de usuário duplicado - usa username fixo que será sempre duplicado
    return {
        username: "existing_user_test",
        password: "123456"
    };
};

const generateInvalidUserData = () => {
    return {
        username: "", // Username vazio para teste de validação
        password: "senha123"
    };
};

module.exports = {
    generateUniqueUser,
    generateExistingUserData,
    generateInvalidUserData
};