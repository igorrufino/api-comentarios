## 📘 README da **API** (`api/README.md`)

````markdown
# API de Comentários 📝

API em Flask responsável por gerenciar os comentários.

## 📌 Endpoints

### 1. Criar comentário
`POST /api/comment/new`

**Request:**
```json
{
  "email": "user@example.com",
  "comment": "Texto do comentário",
  "content_id": "POST-001"
}
````

**Response:**

```json
{
  "status": "SUCCESS",
  "message": "Comentário criado e associado ao content_id POST-001",
  "comment": {
    "id": 1,
    "email": "user@example.com",
    "comment": "Texto do comentário",
    "content_id": "POST-001",
    "created_at": "2025-09-25T12:00:00Z"
  }
}
```

---

### 2. Listar comentários por `content_id`

`GET /api/comment/list/:content_id`

**Response:**

```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "comment": "Texto do comentário",
    "content_id": "POST-001",
    "created_at": "2025-09-25T12:00:00Z"
  }
]
```

---

### 3. Estatísticas

`GET /api/comment/stats`

**Response:**

```json
{
  "total_comments": 12,
  "by_content": {
    "POST-001": 8,
    "POST-002": 4
  }
}
```

---

### 4. Health check

`GET /api/health`

**Response:**

```json
{
  "status": "ok"
}
```

---

## 🚀 Rodando com Docker

### Criar rede

```bash
docker network create comentarios-net
```

### Build da imagem

```bash
docker build -t api-comentarios -f Dockerfile.api .
```

### Executar container

```bash
docker run -d -p 8000:8000 --name api-comentarios --network comentarios-net api-comentarios
```

---

## 📦 Dependências

* Flask
* Flask-Cors
* Gunicorn

Instaladas via `requirements.txt`.

---

## 📚 Documentação relacionada

* [Frontend (interface web)](../app-front/README.md)
* [Guia geral de Deploy](../README.md)


