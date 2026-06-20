const request = require('supertest');
const { expect } = require('chai');

describe('Login', () => {
    describe('POST /login', () => {
        it('Deve retornar 200 com token em string quando as credenciais são válidas', async () => {
            // Simule uma requisição POST para /login com credenciais válidas
            // com o supertest e capture a resposta
            const resposta = await request('http://localhost:3000')
                .post('/auth/login')
                .set('Content-Type', 'application/json')
                .send({
                    "email": "ricardo@email.com",
                    "senha": "123456"
                })

            //console.log(resposta.body); //somente para verificar o corpo da resposta...deve ser apagado
            //console.log(resposta.status); //somente para verificar o status da resposta...deve ser apagado

            // Verifique se a resposta tem status 200 e contém um token em string
            // com o uso do chai
            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.have.property('token').that.is.a('string');
        })
    })
})