# 🚀 Testes de API - Urban.Grocers

[![Status](https://img.shields.io/badge/status-concluído-brightgreen)](https://github.com/viniciussilva2504/Urban.Grocers_Postman)
[![Postman](https://img.shields.io/badge/Postman-v2.1-orange)](https://www.postman.com/)
[![Newman](https://img.shields.io/badge/Newman-5.x-blue)](https://learning.postman.com/docs/running-collections/using-newman-cli/command-line-integration-with-newman/)
[![CI/CD](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF)](https://github.com/features/actions)

---

## 📋 Sobre o Projeto

Este repositório contém a suíte de testes automatizados para a **API Urban.Grocers**, desenvolvida como parte do meu portfólio de transição de carreira de **Desenvolvedor para QA (Quality Assurance)**.

O objetivo é demonstrar não apenas o domínio da ferramenta Postman, mas também a capacidade de:
- Estruturar e versionar artefatos de teste (Collections e Environments).
- Escrever scripts de validação em JavaScript (Chai.js) para garantir a qualidade dos endpoints.
- Pensar em **cenários negativos** e **contratos de dados (Schemas)**.
- Automatizar a execução via terminal (**Newman**) e integrar em um pipeline de **CI/CD (GitHub Actions)**.

---

## 🛠 Tecnologias e Ferramentas

| Ferramenta | Finalidade |
| :--- | :--- |
| **Postman** | Criação e execução manual das requisições. |
| **Postman Collection v2.1** | Versionamento da suíte de testes em JSON. |
| **JavaScript (ES6+)** | Escrita dos scripts de validação (Testes e Pré-requisitos). |
| **Chai.js (BDD)** | Biblioteca de asserções utilizada nos scripts (`pm.expect`). |
| **Newman** | Execução headless (via terminal) das collections. |
| **GitHub Actions** | Automação da execução dos testes a cada `push` ou `pull request`. |

---
## 🛠 Estrutura do Projeto

| Arquivo/Pasta | Descrição |
| :--- | :--- |
| `.github/workflows/api-tests.yml` | Pipeline de CI/CD (GitHub Actions) |
| `collections/Urban.Grocers.postman_collection.json` | Suíte de testes (Requisições + Scripts) |
| `environments/tripleten_qa_api.postman_environment.json` | Variáveis de ambiente (URL base) |
| `scripts/exemplos_curl.md` | Comandos cURL para execução via terminal |
| `captions/video_demo.mp4` | Vídeo demonstrativo da execução dos testes |
| `README.md` | Documentação completa do projeto |
---

### 1. Executando localmente via Postman (Interface Gráfica)
1. Abra o Postman.
2. Clique em **Import** e selecione o arquivo `collections/Urban.Grocers.postman_collection.json`.
3. Novamente em **Import**, selecione o arquivo `environments/tripleten_qa_api.postman_environment.json`.
4. No canto superior direito, selecione o ambiente **tripleten_qa_api**.
5. Agora você pode executar as requisições individualmente ou usar o **Collection Runner** para executar todas de uma vez.

### 2. Executando via Terminal (Newman - Headless)
Esta abordagem é ideal para pipelines de CI/CD e mostra que os testes são executáveis sem dependência de interface gráfica.

```bash
# Instale o Newman globalmente (caso não tenha)
npm install -g newman

# Execute a suíte completa
newman run collections/Urban.Grocers.postman_collection.json \
  -e environments/tripleten_qa_api.postman_environment.json \
  --reporters cli,json \
  --reporter-json-export reports/report.json

