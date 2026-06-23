const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();
const { obterToken } = require('../helpers/autenticacao');

describe('CDI', () => {
    describe('POST /cdi', () => {
        it('Deve retornar sucesso com 201 quando o valor configurado do CDI maior que zero ', async () => {

            const token = await obterToken("ricardo@email.com", "12345678"); //chamando a função obterToken do arquivo autenticacao.js para capturar o token de autenticação

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

            const token = await obterToken("ricardo@email.com", "12345678"); //chamando a função obterToken do arquivo autenticacao.js para capturar o token de autenticação
            
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