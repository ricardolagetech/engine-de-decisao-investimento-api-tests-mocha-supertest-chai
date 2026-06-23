const request = require('supertest');
require('dotenv').config();

//criando um arquivo helper para a autenticação, para que possamos capturar o token de autenticação e usá-lo em outros arquivos de teste
const obterToken = async (email, senha) => {
    const respostaLogin = await request(process.env.BASE_URL)
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .send({
            'email': email,
            'senha': senha
        })
    return respostaLogin.body.token;
}

module.exports = { obterToken }; //com isso, essa função pode ser importada e usada em outros arquivos