const request = require('supertest');
require('dotenv').config();
const postAuthLogin = require('../fixtures/postAuthLogin.json');

//criando um arquivo helper para a autenticação, para que possamos capturar o token de autenticação e usá-lo em outros arquivos de teste
const obterToken = async (email, senha) => {

    const bodyAuthlogin = { ...postAuthLogin}; // Usando o fixture postAuthLogin.json para enviar o corpo da requisição em shallow copy. Se o json tivesse mais subniveis, seria necessário usar deep copy, mas como o json é simples, shallow copy é suficiente.

    const respostaLogin = await request(process.env.BASE_URL)
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .send(bodyAuthlogin)
        
    return respostaLogin.body.token;
}

module.exports = { obterToken }; //com isso, essa função pode ser importada e usada em outros arquivos