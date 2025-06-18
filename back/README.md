# Zé da Horta - Backend

## Integrantes do Grupo

    Guilherme Luan Silva dos Reis - UC23200423
    Gabriel Victor Vidal de Sales - UC23200816
    Guilherme Basilio Silva Felix Xavier - UCUC23200149
    Guilherme Soares - UC23101914
    Flávio Oliveira Morais Leite - UC23101606


## Descrição
Backend do sistema Zé da Horta, uma plataforma que conecta produtores rurais diretamente aos consumidores, facilitando a venda e compra de produtos orgânicos e frescos.

## Tecnologias Utilizadas
- Node.js
- NestJS
- TypeScript
- SQLite
- TypeORM
- JWT para autenticação
- Swagger para documentação da API

## Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

## Configuração do Ambiente

### 1. Clone o Repositório
```bash
git clone https://github.com/GuilhermeLuan/ze-da-horta-backend
cd ze-da-horta-backend
```

### 2. Instale as Dependências
```bash
npm install
# ou
yarn install
```

## Executando o Projeto

### Modo de Desenvolvimento
```bash
npm run start:dev
# ou
yarn start:dev
```

### Modo de Produção
```bash
npm run build
npm run start:prod
# ou
yarn build
yarn start:prod
```

## Documentação da API
A documentação da API está disponível através do Swagger. Após iniciar o servidor, acesse:

```
http://localhost:3000/api
```

## Estrutura do Projeto
```
src/
├── address/          # Gerenciamento de endereços
├── auth/             # Autenticação e autorização
├── cart/             # Gerenciamento do carrinho de compras
├── favorites/        # Gerenciamento de favoritos
├── inventory-items/  # Gerenciamento de itens do inventário
├── orders/           # Gerenciamento de pedidos
├── products/         # Gerenciamento de produtos
├── stock/            # Controle de estoque
├── store/            # Gerenciamento de lojas
├── user/             # Gerenciamento de usuários
└── main.ts           # Arquivo principal da aplicação
```

## Scripts Disponíveis
- `npm run start`: Inicia o servidor
- `npm run start:dev`: Inicia o servidor em modo de desenvolvimento
- `npm run start:debug`: Inicia o servidor em modo debug
- `npm run start:prod`: Inicia o servidor em modo produção
- `npm run build`: Compila o projeto
- `npm run test`: Executa os testes
- `npm run test:watch`: Executa os testes em modo watch
- `npm run test:cov`: Executa os testes com cobertura
- `npm run lint`: Executa o linter
