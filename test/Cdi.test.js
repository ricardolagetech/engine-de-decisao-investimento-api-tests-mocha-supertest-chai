const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();

describe('CDI', () => {
    describe('POST /cdi', () => {
        it('Deve retornar sucesso com 201 quando o valor configurado do CDI maior que zero ', async () => {
            //Capturar o token de autenticação antes de fazer a requisição para /cdi
            const respostaLogin = await request(process.env.BASE_URL)
                .post('/auth/login')
                .set('Content-Type', 'application/json')
                .send({
                    email: "ricardo@email.com",
                    senha: "12345678"
                })

            const token = respostaLogin.body.token;
                
            const resposta = await request(process.env.BASE_URL)
                .post('/cdi')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    valor: 10.75
                })
        expect(resposta.status).to.equal(201)
        //expect(resposta.body).to.have.property('message', 'CDI configurado com sucesso')
        

        })

        it('Deve retornar falha com 400 quando o valor configurado do CDI for menor ou igual a zero', async () => {
            //Capturar o token de autenticação antes de fazer a requisição para /cdi
            const respostaLogin = await request(process.env.BASE_URL)
                .post('/auth/login')
                .set('Content-Type', 'application/json')
                .send({
                    email: "ricardo@email.com",
                    senha: "12345678"
                })

            const token = respostaLogin.body.token;
            
            const resposta = await request(process.env.BASE_URL)
                .post('/cdi')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    valor: 0
                })
        expect(resposta.status).to.equal(400)
        //expect(resposta.body).to.have.property('error', 'Valor do CDI deve ser maior que zero')

        })




    })



})