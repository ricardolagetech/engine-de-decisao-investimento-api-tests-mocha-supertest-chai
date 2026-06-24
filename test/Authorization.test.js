const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();
const postAuthLogin = require('../fixtures/postAuthLogin.json');

describe('Authorization', () => {
    describe('POST /auth/login', () => {
        it('Deve retornar 200 com token em string quando as credenciais são válidas', async () => {
            const bodyAuthlogin = { ...postAuthLogin}; // Usando o fixture postAuthLogin.json para enviar o corpo da requisição em shallow copy. Se o json tivesse mais subniveis, seria necessário usar deep copy, mas como o json é simples, shallow copy é suficiente.
            
            // Simule uma requisição POST para /login com credenciais válidas com o supertest e capture a resposta
            const resposta = await request(process.env.BASE_URL)
                .post('/auth/login')
                .set('Content-Type', 'application/json')
                .send(bodyAuthlogin)

            //console.log(resposta.body); //somente para verificar o corpo da resposta...deve ser apagado
            //console.log(resposta.status); //somente para verificar o status da resposta...deve ser apagado

            // Verifique se a resposta tem status 200 e contém um token em string
            // com o uso do chai
            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.have.property('token').that.is.a('string');
        })

        it('Deve retornar 401 quando as credenciais são inválidas', async () => {
            const bodyAuthlogin = { ...postAuthLogin};
            bodyAuthlogin.email = "email@invalido.com";
            bodyAuthlogin.senha = "senha_invalida";

            const resposta = await request(process.env.BASE_URL)
                .post('/auth/login')
                .set('Content-Type', 'application/json')
                .send(bodyAuthlogin)

            expect(resposta.status).to.equal(401);
            expect(resposta.body).to.have.property('erro').that.is.a('string').to.equal('Credenciais inválidas');
        })

    })
})