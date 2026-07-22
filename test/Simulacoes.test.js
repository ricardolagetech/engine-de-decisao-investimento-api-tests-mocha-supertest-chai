const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();
const postCdbPosFixado = require('../fixtures/postCdbPosFixado.json');
const postCdbPreFixado = require('../fixtures/postCdbPreFixado.json');
const { obterToken } = require('../helpers/autenticacao');

function formatarDataFutura(diasNoFuturo) {
    const data = new Date();
    data.setHours(0, 0, 0, 0);
    data.setDate(data.getDate() + diasNoFuturo);
    return data.toISOString().split('T')[0];
}

function contarCasasDecimais(numero) {
    const texto = numero.toString();
    if (!texto.includes('.')) return 0;
    return texto.split('.')[1].length;
}

describe('Simulacoes', () => {

    describe('POST /simulacoes/cdb', () => {
        it('Deve retornar sucesso com 200 ao simular investimento em CDB pos-fixado com dados validos', async () => {
            // Usa a fixture como base do payload para manter o padrao do projeto
            const bodyCdb = { ...postCdbPosFixado };

            const resposta = await request(process.env.BASE_URL)
                .post('/simulacoes/cdb')
                .set('Content-Type', 'application/json')
                .send(bodyCdb)

            expect(resposta.status).to.equal(200);
            expect(resposta.body.tipo).to.equal('CDB');
            expect(resposta.body.tipoRemuneracao).to.equal('POS_FIXADO');
            expect(resposta.body.valorInicial).to.equal(10000);
            expect(resposta.body.percentualCDI).to.equal(110);
            expect(resposta.body.taxaAnual).to.equal(null);
            expect(resposta.body.prazoEmDias).to.be.a('number').and.to.be.greaterThan(0);
            expect(resposta.body.resultadoBruto).to.be.a('number');
            expect(resposta.body.ir).to.be.a('number');
            expect(resposta.body.resultadoLiquido).to.be.a('number');
            expect(resposta.body.aliquotaIR).to.be.oneOf([22.5, 20, 17.5, 15]);
            expect(resposta.body.percentualGanhoLiquido).to.be.a('number');
            expect(resposta.body.percentualGanhoLiquidoAnual).to.be.a('number');
        })

        it('Deve retornar sucesso com 200 ao simular investimento em CDB prefixado com dados validos', async () => {
            const bodyCdb = { ...postCdbPreFixado };

            const resposta = await request(process.env.BASE_URL)
                .post('/simulacoes/cdb')
                .set('Content-Type', 'application/json')
                .send(bodyCdb)

            expect(resposta.status).to.equal(200);
            expect(resposta.body.tipo).to.equal('CDB');
            expect(resposta.body.tipoRemuneracao).to.equal('PREFIXADO');
            expect(resposta.body.valorInicial).to.equal(15000);
            expect(resposta.body.taxaAnual).to.equal(12.5);
            expect(resposta.body.percentualCDI).to.equal(null);
            expect(resposta.body.prazoEmDias).to.be.a('number').and.to.be.greaterThan(0);
            expect(resposta.body.resultadoBruto).to.be.a('number');
            expect(resposta.body.ir).to.be.a('number');
            expect(resposta.body.resultadoLiquido).to.be.a('number');
        })

        it('Deve retornar falha com 400 quando nao informar campos obrigatorios base da simulacao', async () => {
            const bodyCdb = {
                valorInicial: 10000
            };

            const resposta = await request(process.env.BASE_URL)
                .post('/simulacoes/cdb')
                .set('Content-Type', 'application/json')
                .send(bodyCdb)

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('erro').that.includes('obrigat');
        })

        it('Deve retornar falha com 400 quando o CDB for pos-fixado sem informar o cdi', async () => {
            const bodyCdb = { ...postCdbPosFixado };
            delete bodyCdb.cdi;

            const resposta = await request(process.env.BASE_URL)
                .post('/simulacoes/cdb')
                .set('Content-Type', 'application/json')
                .send(bodyCdb)

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('erro').that.includes('cdi');
        })

        it('Deve retornar falha com 400 quando o CDB for pos-fixado sem informar o percentual do CDI', async () => {
            const bodyCdb = { ...postCdbPosFixado };
            delete bodyCdb.percentualCDI;

            const resposta = await request(process.env.BASE_URL)
                .post('/simulacoes/cdb')
                .set('Content-Type', 'application/json')
                .send(bodyCdb)

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('erro').that.includes('percentualCDI');
        })

        it('Deve retornar falha com 400 quando o CDB for prefixado sem informar a taxa anual', async () => {
            const bodyCdb = { ...postCdbPreFixado };
            delete bodyCdb.taxaAnual;

            const resposta = await request(process.env.BASE_URL)
                .post('/simulacoes/cdb')
                .set('Content-Type', 'application/json')
                .send(bodyCdb)

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('erro').that.includes('taxaAnual');
        })

        it('Deve retornar falha com 400 quando a data de vencimento nao for futura', async () => {
            const bodyCdb = { ...postCdbPosFixado };
            bodyCdb.dataVencimento = '2026-07-10';

            const resposta = await request(process.env.BASE_URL)
                .post('/simulacoes/cdb')
                .set('Content-Type', 'application/json')
                .send(bodyCdb)

            //console.log(resposta.body);
            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('erro').that.includes('data futura');
        })

        it('Deve retornar falha com 400 quando o tipo de remuneracao for invalido', async () => {
            const bodyCdb = { ...postCdbPosFixado };
            bodyCdb.tipoRemuneracao = 'VARIAVEL';

            const resposta = await request(process.env.BASE_URL)
                .post('/simulacoes/cdb')
                .set('Content-Type', 'application/json')
                .send(bodyCdb)

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('erro').that.includes('tipoRemuneracao');
        })

        it('Deve aplicar aliquota de 22.5% quando o prazo do CDB for de ate 180 dias', async () => {
            const bodyCdb = { ...postCdbPreFixado };
            bodyCdb.dataVencimento = formatarDataFutura(180);

            const resposta = await request(process.env.BASE_URL)
                .post('/simulacoes/cdb')
                .set('Content-Type', 'application/json')
                .send(bodyCdb)

            expect(resposta.status).to.equal(200);
            expect(resposta.body.aliquotaIR).to.equal(22.5);
        })

        it('Deve aplicar aliquota de 20% quando o prazo do CDB estiver entre 181 e 360 dias', async () => {
            const bodyCdb = { ...postCdbPreFixado };
            bodyCdb.dataVencimento = formatarDataFutura(181);

            const resposta = await request(process.env.BASE_URL)
                .post('/simulacoes/cdb')
                .set('Content-Type', 'application/json')
                .send(bodyCdb)

            expect(resposta.status).to.equal(200);
            expect(resposta.body.aliquotaIR).to.equal(20);
        })

        it('Deve aplicar aliquota de 17.5% quando o prazo do CDB estiver entre 361 e 720 dias', async () => {
            const bodyCdb = { ...postCdbPreFixado };
            bodyCdb.dataVencimento = formatarDataFutura(361);

            const resposta = await request(process.env.BASE_URL)
                .post('/simulacoes/cdb')
                .set('Content-Type', 'application/json')
                .send(bodyCdb)

            expect(resposta.status).to.equal(200);
            expect(resposta.body.aliquotaIR).to.equal(17.5);
        })

        it('Deve aplicar aliquota de 15% quando o prazo do CDB for superior a 720 dias', async () => {
            const bodyCdb = { ...postCdbPreFixado };
            bodyCdb.dataVencimento = formatarDataFutura(721);

            const resposta = await request(process.env.BASE_URL)
                .post('/simulacoes/cdb')
                .set('Content-Type', 'application/json')
                .send(bodyCdb)

            expect(resposta.status).to.equal(200);
            expect(resposta.body.aliquotaIR).to.equal(15);
        })

        it('Deve retornar valores monetarios com ate 2 casas decimais e calculo deterministico', async () => {
            const bodyCdb = { ...postCdbPosFixado };

            const resposta1 = await request(process.env.BASE_URL)
                .post('/simulacoes/cdb')
                .set('Content-Type', 'application/json')
                .send(bodyCdb)

            const resposta2 = await request(process.env.BASE_URL)
                .post('/simulacoes/cdb')
                .set('Content-Type', 'application/json')
                .send(bodyCdb)

            expect(resposta1.status).to.equal(200);
            expect(resposta2.status).to.equal(200);
            expect(resposta1.body).to.deep.equal(resposta2.body);
            expect(contarCasasDecimais(resposta1.body.resultadoBruto)).to.be.at.most(2);
            expect(contarCasasDecimais(resposta1.body.ir)).to.be.at.most(2);
            expect(contarCasasDecimais(resposta1.body.resultadoLiquido)).to.be.at.most(2);
        })

        it('Nao deve salvar a simulacao de CDB no historico ao chamar o endpoint publico', async () => {
            // O endpoint de simulacao publica deve apenas calcular o resultado, sem persistir dados
            const token = await obterToken("ricardo@email.com", "12345678");

            const respostaAntes = await request(process.env.BASE_URL)
                .get('/simulacoes?page=1&limit=10')
                .set('Authorization', `Bearer ${token}`)

            const totalItemsAntes = respostaAntes.body.totalItems;

            const respostaSimulacao = await request(process.env.BASE_URL)
                .post('/simulacoes/cdb')
                .set('Content-Type', 'application/json')
                .send({ ...postCdbPosFixado })

            const respostaDepois = await request(process.env.BASE_URL)
                .get('/simulacoes?page=1&limit=10')
                .set('Authorization', `Bearer ${token}`)

            expect(respostaSimulacao.status).to.equal(200);
            expect(respostaAntes.status).to.equal(200);
            expect(respostaDepois.status).to.equal(200);
            expect(respostaDepois.body.totalItems).to.equal(totalItemsAntes);
        })
    })
})
