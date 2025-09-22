# PGATS API - Trabalho Final

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18.2-blue)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Sobre o Projeto

API REST para controle financeiro desenvolvida em Node.js com Express.js. Sistema completo de autenticação JWT e gerenciamento de registros financeiros.

## ✨ Funcionalidades

- 🔐 Autenticação JWT segura
- 📚 Documentação Swagger interativa
- 🧪 Testes automatizados (Mocha/Chai/Supertest/sinon)
- 💾 Banco de dados em memória
- 🛡️ Validação de dados e tratamento de erros

## 🛠️ Tecnologias

- **Node.js** (≥16.0.0) + **Express.js**
- **JWT** para autenticação
- **bcryptjs** para hash de senhas
- **Swagger UI** para documentação
- **Mocha/Chai/Supertest/sinon** para testes

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js 16.0.0 ou superior
- npm

### Passos para instalação

```bash
# 1. Clone o repositório
git clone https://github.com/NataliaFerreiraVentura/PGATS-API-TrabalhoFinal
cd PGATS-API-TrabalhoFinal

# 2. Instale as dependências
npm install

# 3. Inicie o servidor
npm start
```

### Acesso à aplicação

Após iniciar o servidor, acesse:

- **🌐 API**: http://localhost:3000
- **📖 Documentação Swagger**: http://localhost:3000/api-docs

## 🔌 Endpoints da API

### Autenticação

| Método | Endpoint        | Descrição              | Autenticação |
| ------ | --------------- | ---------------------- | ------------ |
| POST   | `/api/register` | Registrar novo usuário | ❌           |
| POST   | `/api/login`    | Login de usuário       | ❌           |

### Registros Financeiros

| Método | Endpoint             | Descrição                 | Autenticação |
| ------ | -------------------- | ------------------------- | ------------ |
| GET    | `/api/registros`     | Listar todos os registros | ✅           |
| POST   | `/api/registros`     | Criar novo registro       | ✅           |
| GET    | `/api/registros/:id` | Obter registro por ID     | ✅           |
| PUT    | `/api/registros/:id` | Atualizar registro        | ✅           |
| DELETE | `/api/registros/:id` | Deletar registro          | ✅           |

## 📊 Modelo de Dados

### Registro Financeiro

```json
{
  "tipo": "entrada", // "entrada" ou "saida"
  "valor": 2500.0, // Valor positivo
  "descricao": "Salário" // Descrição da transação
}
```

### Usuário

```json
{
  "username": "user123", // Nome de usuário único
  "password": "senha123" // Senha (será hasheada)
}
```

## 🧪 Testes

### Executar todos os testes

```bash
npm test
```

### Executar testes REST externos

```bash
npm run test-rest-external
```

### Relatórios

- Os testes geram relatórios HTML com **Mochawesome**
- Arquivos salvos em `mochawesome-report/`

## 📝 Exemplos de Uso

### 1. Registrar usuário

```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username": "user123", "password": "senha123"}'
```

### 2. Fazer login

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user123", "password": "senha123"}'
```

### 3. Criar registro (com token do login)

```bash
curl -X POST http://localhost:3000/api/registros \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu-token>" \
  -d '{
    "tipo": "entrada",
    "valor": 2500.00,
    "descricao": "Salário mensal"
  }'
```

## 🔒 Segurança

- **Autenticação JWT**: Tokens seguros com expiração
- **Hash de senhas**: bcryptjs com salt
- **CORS configurado**: Para requisições cross-origin
- **Validação rigorosa**: Middleware de validação de dados
- **Tratamento de erros**: Middleware centralizado

## ⚠️ Banco de Dados

Este projeto utiliza **banco em memória**, ideal para desenvolvimento e testes:

### Características

- ✅ Dados resetam a cada reinicialização
- ✅ Operações extremamente rápidas
- ✅ Sem configuração adicional
- ⚠️ Dados não são persistidos

## 🔧 Scripts Disponíveis

| Script      | Comando                      | Descrição               |
| ----------- | ---------------------------- | ----------------------- |
| Iniciar     | `npm start`                  | Inicia o servidor       |
| Testes      | `npm test`                   | Executa todos os testes |
| Testes REST | `npm run test-rest-external` | Testes de integração    |
| Lint        | `npm run lint`               | Verifica código         |

## 📁 Estrutura do Projeto

```
PGATS-API-TrabalhoFinal/
├── controller/          # Controladores da API
├── service/            # Lógica de negócio
├── model/              # Modelos e banco em memória
├── middleware/         # Middlewares (auth, errors)
├── test/               # Testes automatizados
├── docs/               # Documentação Swagger
├── src/                # Configuração da aplicação
├── package.json        # Dependências e scripts
└── README.md          # Este arquivo
```

## 👥 Autor

**Natalia Ferreira Ventura**  
PGATS - Pós-Graduação em Automação de Testes

- GitHub: [@NataliaFerreiraVentura](https://github.com/NataliaFerreiraVentura)

## 📄 Licença

Este projeto está sob a licença MIT.

---

<div align="center">

**🚀 Desenvolvido com ❤️ para PGATS**

_API REST - Trabalho Final_

</div>
