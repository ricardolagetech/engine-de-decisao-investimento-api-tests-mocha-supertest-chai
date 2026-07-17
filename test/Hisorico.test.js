const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();
const { obterToken } = require('../helpers/autenticacao');

describe('Historico', () => {
    
    let token; // Variável para armazenar o token de autenticação
    
    beforeEach (async () => {
        // Antes de executar os testes, obtenha o token de autenticação
        token = await obterToken("ricardo@email.com", "12345678");
    });


    describe('GET /simulacoes', () => {
        it('Deve retornar 10 simulacoes na paginacao quando a pagina for 1 e informar limite for 10 ', async () => {
                        
            const resposta = await request(process.env.BASE_URL)
                .get('/simulacoes?page=1&limit=10')
                .set('Authorization', `Bearer ${token}`)

        expect(resposta.status).to.equal(200)
        expect(resposta.body.page).to.equal(1) // Verifica se a página retornada é 1
        expect(resposta.body.limit).to.equal(10) // Verifica se o limite retornado é 10
        expect(resposta.body.simulacoes.length).to.equal(10) // Verifica se retorna 10 simulacoes        
        expect(resposta.body.simulacoes[0].id).to.be.a('number')
        expect(resposta.body.simulacoes[0].tipo).to.be.a('string')
        expect(resposta.body.simulacoes[0].percentualCDI).to.be.a('number')
        //console.log("A resposta é: " + resposta.body.simulacoes.length); //somente para verificar o corpo da resposta...deve ser apagado
        //console.log(resposta.body); //somente para verificar o corpo da resposta...deve ser apagado

        })

    })


    describe('GET /simulacoes/{id}', () => {
        it('Deve retornar sucesso com 200 e dados iguais ao registro de simulacoes contido no banco de dados quando o id for válido ', async () => {
                        
            const resposta = await request(process.env.BASE_URL)
                .get('/simulacoes/51')
                .set('Authorization', `Bearer ${token}`)

        expect(resposta.status).to.equal(200)
        expect(resposta.body.id).to.equal(51)
        expect(resposta.body.id).to.be.a('number')
        expect(resposta.body.tipo).to.be.a('string')
        expect(resposta.body.percentualCDI).to.be.a('number')
        console.log(resposta.body); //somente para verificar o corpo da resposta...deve ser apagado
   
        })

    })
})
