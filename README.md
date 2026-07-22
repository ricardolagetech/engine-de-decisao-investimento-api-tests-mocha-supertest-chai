# Engine de Decisão de Investimento API Tests

Suíte de testes de API para o projeto `engine-de-decisao-investimento-api`, focada na validação dos principais fluxos HTTP da aplicação com `Mocha`, `Chai` e `Supertest`.

Este repositório faz parte da evolução da estratégia de qualidade do projeto. A API principal já está implementada com base nas histórias do Jira, enquanto esta suíte de testes ainda está em construção. Mesmo assim, o projeto já possui cenários automatizados executáveis e relatório HTML de execução.

## Objetivo

Validar, de forma automatizada, comportamentos relevantes da API de decisão de investimento em renda fixa, principalmente nos fluxos de:

- autenticação
- configuração de CDI
- consulta paginada de simulações
- consulta de simulação salva por id

O foco atual é evoluir a cobertura de integração endpoint a endpoint, acompanhando a maturidade da API.

## Relação com a API principal

Este projeto testa a API disponível no repositório principal:

- `engine-de-decisao-investimento-api`

A API principal contém o domínio de negócio completo e já contempla, conforme o Jira `RFDOI`, funcionalidades como:

- cadastro, login e logout
- configuração de CDI por usuário
- simulações de `CDB`, `LCI` e `LCA`
- comparação de investimentos com ranking
- histórico de simulações
- exclusão, consulta por id e listagem paginada

Nesta suíte, a cobertura automatizada ainda é parcial e está sendo expandida de forma incremental.

## Stack

- Node.js
- Mocha
- Chai
- Supertest
- dotenv
- Mochawesome

## Estrutura do projeto

```text
fixtures/
  postAuthLogin.json
  postCdi.json
helpers/
  autenticacao.js
test/
  Authorization.test.js
  Cdi.test.js
  Hisorico.test.js
mochawesome-report/
  mochawesome.html
  mochawesome.json
package.json
```

## Cobertura atual

No estado atual do repositório, os testes automatizados exercitam:

### Autenticação

- `POST /auth/login` com credenciais válidas
- `POST /auth/login` com credenciais inválidas

### CDI

- `POST /cdi` com valor válido
- `POST /cdi` com valor inválido

### Simulações salvas

- `GET /simulacoes?page=1&limit=10`
- `GET /simulacoes/:id`

## Status do projeto de testes

Esta suíte ainda não representa a cobertura completa da API.

Hoje o repositório já entrega:

- estrutura inicial de testes de integração
- reutilização de autenticação via helper
- uso de fixtures para payloads
- relatório HTML com Mochawesome

Próximas evoluções esperadas:

- ampliar cenários negativos e validações de contrato
- cobrir mais endpoints da API principal
- reduzir dependência de ids fixos e dados preexistentes
- melhorar isolamento e preparação de dados de teste

## Pré-requisitos

Antes de rodar esta suíte, garanta que:

1. a API principal esteja disponível localmente ou em ambiente acessível
2. exista um usuário válido para autenticação
3. existam dados compatíveis com os cenários atuais, especialmente para os testes de consulta
4. o Node.js esteja instalado

## Configuração

Instale as dependências:

```bash
npm install
```

Crie ou ajuste o arquivo `.env` com a URL base da API:

```env
BASE_URL=http://localhost:3000
```

## Como executar

Com a API em execução e o `.env` configurado:

```bash
npm test
```

O comando executa:

```bash
mocha ./test/**/*.test.js --timeout=200000 --reporter mochawesome
```

## Relatório de execução

A execução gera artefatos em `mochawesome-report/`, incluindo:

- `mochawesome-report/mochawesome.html`
- `mochawesome-report/mochawesome.json`

O HTML pode ser usado para demonstrar os resultados da suíte em contexto de estudo, mentoria ou portfólio.

## Observações importantes

- Os testes atuais usam credenciais e dados de apoio definidos em fixture.
- Parte dos cenários depende de massa de dados previamente existente na API.
- O helper de autenticação centraliza a obtenção de token para reaproveitamento entre specs.
- O projeto está orientado a testes de integração HTTP, não a testes unitários da regra de negócio.

## Requisitos de negócio relacionados

As histórias da API principal no Jira `RFDOI`, consultadas em 17 de julho de 2026, incluem:

- `RFDOI-2` a `RFDOI-4`: cadastro, login e logout
- `RFDOI-5`: configuração de CDI por usuário
- `RFDOI-6` a `RFDOI-8`: simulações de `CDB`, `LCI` e `LCA`
- `RFDOI-9` e `RFDOI-10`: comparação e identificação do melhor investimento
- `RFDOI-11` a `RFDOI-16`: histórico, listagem, consulta por id e exclusões

Este repositório de testes ainda não cobre toda essa superfície funcional, mas foi iniciado exatamente para evoluir nessa direção.

## Projeto para portfólio

Para portfólio, este repositório mostra:

- organização de uma suíte de testes backend em Node.js
- validação de endpoints autenticados e não autenticados
- uso de fixtures e helpers para reduzir repetição
- geração de relatório automatizado de execução
- evolução incremental de cobertura sobre uma API realista de domínio financeiro

## Melhorias futuras

- adicionar cenários para `register` e `logout`
- cobrir simulações de `CDB`, `LCI` e `LCA`
- cobrir comparação e histórico agrupado
- incluir validações de erros de autorização, payload e regras de negócio
- preparar massa de dados controlada para tornar a suíte menos dependente de ambiente
