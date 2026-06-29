# 🚀 Testes de API - Urban.Grocers

Projeto de automação de testes para a API de gerenciamento de kits da Urban.Grocers, desenvolvido como parte do portfólio de transição de carreira para QA.

## 📋 Índice
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Executar Localmente](#como-executar-localmente)
- [Exemplos de Requisições (cURL)](#exemplos-de-requisições-curl)
- [Testes Implementados](#testes-implementados)
- [Integração Contínua (CI/CD)](#integração-contínua-cicd)
---
## 🛠 Tecnologias
- **Postman** (Collection v2.1)
- **Newman** (CLI Runner)
- **JavaScript (ES6+)** com asserções Chai.js
- **GitHub Actions** (CI/CD automatizado)
---
## 📁 Estrutura do Projeto
📦 Urban.Grocers_Postman/
├── 📁 collections/
│ └── Urban.Grocers.postman_collection.json
├── 📁 environments/
│ └── tripleten_qa_api.postman_environment.json
├── 📁 captions/
│ └── video_demo.mp4
├── 📁 .github/workflows/
│ └── api-tests.yml
└── README.md
---
## ▶️ Como Executar Localmente
### 1. Via Postman (Interface)
1. Importe a `collection` e o `environment`.
2. Selecione o ambiente `tripleten_qa_api`.
3. Execute as requisições manualmente ou via Collection Runner.

### 2. Via Newman (Terminal - Headless)
```bash
# Instale o Newman globalmente
npm install -g newman

# Execute todos os testes
newman run collections/Urban.Grocers.postman_collection.json \
  -e environments/tripleten_qa_api.postman_environment.json \
  --reporters cli,json
