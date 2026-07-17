const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();
const { obterToken } = require('../helpers/autenticacao');
const postCdi = require('../fixtures/postCdi.json');

describe('CDI', () => {
    
    let token; // Variável para armazenar o token de autenticação
    
    //before é um hook do Mocha que é executado antes de todos os testes dentro do bloco describe.
    //beforeEach é um hook do Mocha que é executado antes de cada teste dentro do bloco describe.
    beforeEach (async () => {
        // Antes de executar os testes, obtenha o token de autenticação
        token = await obterToken("ricardo@email.com", "12345678");
    });


    describe('POST /cdi', () => {
        it('Deve retornar sucesso com 201 quando o valor configurado do CDI maior que zero ', async () => {
            //const token = await obterToken("ricardo@email.com", "12345678"); //chamando a função obterToken do arquivo autenticacao.js para capturar o token de autenticação

            const bodyCdi = { ...postCdi}; // Usando o fixture postCdi.json para enviar o corpo da requisição em shallow copy. Se o json tivesse mais subniveis, seria necessário usar deep copy, mas como o json é simples, shallow copy é suficiente.

            const resposta = await request(process.env.BASE_URL)
                .post('/cdi')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyCdi)

        expect(resposta.status).to.equal(201)
        //expect(resposta.body).to.have.property('message', 'CDI configurado com sucesso')
        

        })

        it('Deve retornar falha com 400 quando o valor configurado do CDI for menor ou igual a zero', async () => {
            //const token = await obterToken("ricardo@email.com", "12345678"); //chamando a função obterToken do arquivo autenticacao.js para capturar o token de autenticação
            
            const bodyCdi = {...postCdi};
            bodyCdi.valor = 0; // Alterando o valor para 0, que é um valor inválido

            const resposta = await request(process.env.BASE_URL)
                .post('/cdi')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyCdi)

        expect(resposta.status).to.equal(400)
        //expect(resposta.body).to.have.property('error', 'Valor do CDI deve ser maior que zero')

        })




    })



})