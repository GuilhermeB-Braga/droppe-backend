![Droppe Banner Logo](./assets/droppe-banner.png "Banner Droppe")

API para **upload, download e gerênciamento de arquivos**, permitindo a **transfêrencia segura** entre cliente e servidor. Arquivos **salvos de forma temporária** em nossa base de dados.

## Visão Geral

- Download de arquivos
- Upload de arquivos
- Gerenciamento básico de arquivos
- Sessões, arquivos e registros temporários
- Criação de sessão com código de acesso único
- Login em sessões
- API Job para deleção de dados

###

![Diagrama de Casos de Uso](./docs/diagrams/UC_DROPPE_V1.png "Diagrama de Casos de Uso")

## Tecnologias utilizadas

<div align="left">
  <img src="https://skillicons.dev/icons?i=ts" height="40" alt="typescript logo"  />
  <img width="12" />
  <img src="https://skillicons.dev/icons?i=nodejs" height="40" alt="nodejs logo"  />
  <img width="12" />
  <img src="https://skillicons.dev/icons?i=mongodb" height="40" alt="mongodb logo"  />
  <img width="12" />
  <img src="https://skillicons.dev/icons?i=express" height="40" alt="express logo"  />
</div>

###

## Estrutura do projeto

```
Droppe
├── assets
├── docs
├── package-lock.json
├── package.json
├── prisma
├── prisma.config.ts
├── readme.md
├── src
│   ├── controller
│   ├── errors
│   ├── index.ts
│   ├── lib
│   ├── middlewares
│   ├── routes
│   └── services
└── tsconfig.json

```