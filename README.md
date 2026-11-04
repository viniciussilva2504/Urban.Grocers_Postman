# Urban Grocers API tests

[![API tests](https://github.com/viniciussilva2504/Urban.Grocers_Postman/actions/workflows/api-tests.yml/badge.svg)](https://github.com/viniciussilva2504/Urban.Grocers_Postman/actions/workflows/api-tests.yml)

Postman collection for the Urban Grocers API from the TripleTen QA program. The collection file is `Urban.Grocers.postman_collection.json` (Postman Collection v2.1.0, collection name `Urban.Grocers`). Every request uses the `{{server_url}}` variable.

`tripleten_qa_api.postman_environment.json` sets `server_url` to a host on `containerhub.tripleten-services.com`. A request to that host returns HTTP 404 and the message `container with id=cnt-8c1782c3-2517-426e-a2ae-a2430a866f41 is not found`. Running the collection against that host with Newman executes 4 requests and fails all 11 assertions (exit code 1).

## What the collection checks

The collection has 4 requests, 4 test scripts, and 11 `pm.test` assertions. It has no pre-request scripts. No assertion expects an error status: there are no 4xx or 5xx cases in the file. Paths below are appended to `{{server_url}}`.

| Request | Call | Test | Assertion |
| --- | --- | --- | --- |
| Obter uma lista de kits no cartão | `GET /api/v1/kits?cardId=1` | Status code é 200 | Response status is 200 |
| Obter uma lista de kits no cartão | `GET /api/v1/kits?cardId=1` | A resposta é uma lista de kits | Parsed JSON body is an array |
| Obter uma lista de kits no cartão | `GET /api/v1/kits?cardId=1` | O primeiro kit da lista tem um ID | First array element has an `id` property |
| Obter uma lista de produtos no kit | `GET /api/v1/kits/search?name=Into+space` | Status code é 200 | Response status is 200 |
| Obter uma lista de produtos no kit | `GET /api/v1/kits/search?name=Into+space` | O nome do kit retornado é 'Into space' | `json[0].name` equals `Into space` |
| Criar um kit vazio | `POST /api/v1/kits?cardId=1` with JSON body `{"cardId": 1, "name": "Into space"}` | Status code é 201 (Criado com sucesso) | Response status is 201 |
| Criar um kit vazio | `POST /api/v1/kits?cardId=1` with JSON body `{"cardId": 1, "name": "Into space"}` | A resposta contém um 'id' | JSON body has an `id` property |
| Criar um kit vazio | `POST /api/v1/kits?cardId=1` with JSON body `{"cardId": 1, "name": "Into space"}` | O nome do kit criado está correto | `json.name` equals `Into space` |
| Obter uma lista de kits com produtos que são aprovados pela condição da solicitação | `POST /api/v1/products/kits` with JSON body `{"ids": [1, 22]}` | Status code é 200 | Response status is 200 |
| Obter uma lista de kits com produtos que são aprovados pela condição da solicitação | `POST /api/v1/products/kits` with JSON body `{"ids": [1, 22]}` | A resposta é uma lista de produtos | Parsed JSON body is an array |
| Obter uma lista de kits com produtos que são aprovados pela condição da solicitação | `POST /api/v1/products/kits` with JSON body `{"ids": [1, 22]}` | A lista de produtos não está vazia | Array length is greater than 0 |

The search request stores the query value as the literal `Into+space` (plus sign, not a space).

## GitHub Actions

Workflow: [`.github/workflows/api-tests.yml`](.github/workflows/api-tests.yml). The badge above points at that workflow.

Triggers:

- push to `postman` (the default branch)
- pull request targeting `postman`
- manual `workflow_dispatch`

Jobs:

1. **Validate collection** runs on every trigger. It parses both JSON files, checks that the collection schema is Postman Collection v2.1.0, checks that each request has a method and URL, syntax-checks test and pre-request scripts, and loads the collection with `postman-collection` 5.3.1. This job sends no HTTP requests.
2. **Newman live run** runs only when the repository variable `SERVER_URL` is set. It installs Newman 6.2.3 and newman-reporter-htmlextra 1.23.1, copies `SERVER_URL` into a CI environment as `server_url`, runs the collection, and uploads `reports/newman-report.html` as the artifact `newman-html-report`.

The live run needs `SERVER_URL` set as a repository variable: **Settings → Secrets and variables → Actions → Variables**. The value is the Urban Grocers base URL only (`https://host`), with no `/api` path, because the collection appends `/api/v1/...`. With that variable unset, Newman is skipped. The workflow can still succeed because validation passed. That success means the collection parsed. It means the API assertions passed only on a run where the Newman job executed.

The workflow leaves the committed TripleTen URL unused, including when `SERVER_URL` is missing. Repository settings were not changed by this workflow.

## Run locally with Newman

The commands below use the same Newman and reporter versions as the workflow. Node.js 22 was used to check them.

```bash
npm install -g newman@6.2.3 newman-reporter-htmlextra@1.23.1
mkdir -p reports
newman run Urban.Grocers.postman_collection.json \
  --env-var "server_url=https://your-urban-grocers-host" \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export reports/newman-report.html \
  --timeout-request 15000
```

The HTML report is written to `reports/newman-report.html`.

This uses the URL stored in the environment file:

```bash
newman run Urban.Grocers.postman_collection.json \
  -e tripleten_qa_api.postman_environment.json \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export reports/newman-report.html \
  --timeout-request 15000
```

Parse the collection and environment without calling the API:

```bash
npm install --no-save --no-package-lock postman-collection@5.3.1
node scripts/validate-collection.js
```

In the Postman app, import `Urban.Grocers.postman_collection.json` and `tripleten_qa_api.postman_environment.json`, select the `tripleten_qa_api` environment, set `server_url` to a live base URL, and run the collection with the Collection Runner.

## Files

```text
Urban.Grocers.postman_collection.json
tripleten_qa_api.postman_environment.json
.github/workflows/api-tests.yml
scripts/validate-collection.js
scripts/write-ci-environment.js
captions/exercício_postman_vjsilva_qa32.mp4
README.md
```
