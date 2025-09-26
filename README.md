```markdown
# Sistema de Comentários – Deploy Completo 🚀

Este projeto contém **dois aplicativos** que trabalham juntos:

1. **Backend (API Flask)** → Gerencia os comentários.  
   📄 [README da API](api/README.md())

2. **Frontend (Nginx + HTML/JS/CSS)** → Interface de usuário.  
   📄 [README do Frontend](app-front/README.md())

---

## ⚙️ Rede Docker

Crie uma rede compartilhada para comunicação entre os containers:

```bash
docker network create comentarios-net
````

---

## 🔧 Backend (API Flask)

### Build

```bash
docker build -t api-comentarios -f Dockerfile.api .
```

### Run

```bash
docker run -d -p 8000:8000 --name api-comentarios --network comentarios-net api-comentarios
```

---

## 🎨 Frontend (Nginx)

### Build

```bash
cd app-front
docker build -t front-comentarios .
```

### Run

```bash
docker run -d -p 8080:80 --name front --network comentarios-net front-comentarios
```

---

## 🌍 Acesso

* API: [http://localhost:8000/api/health](http://localhost:8000/api/health)
* Frontend: [http://localhost:8080](http://localhost:8080)

---

## 📚 Outros READMEs

* [📘 README da API](api/README.md) → documentação de endpoints, exemplos de requests/responses.
* [📘 README do Frontend](app-front/README.md) → interface, atalhos, personalização, UX/UI.
