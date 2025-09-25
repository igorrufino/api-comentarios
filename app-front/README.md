# Sistema de Comentários

Sistema para gerenciamento de comentários com interface.

## 📁 Estrutura do Projeto

```
api-comentarios/
├── index.html           # Página principal
├── css/
│   ├── reset.css       # Reset CSS
│   └── styles.css      # Estilos principais
├── js/
│   ├── config.js       # Configurações globais
│   ├── utils.js        # Funções utilitárias
│   ├── api.js          # Funções de API
│   ├── comments.js     # Lógica de comentários
│   └── main.js         # Inicialização
└── img/
    └── logo.svg        # Logo da aplicação
```

## 🚀 Recursos

### Interface
- ✅ Modo claro/escuro automático
- ✅ Animações suaves
- ✅ Feedback visual em todas as ações
- ✅ Toast notifications
- ✅ Loading states
- ✅ Validação em tempo real

### Funcionalidades
- ✅ Adicionar comentários
- ✅ Buscar comentários por Content ID
- ✅ Contador de caracteres
- ✅ Ordenação por data
- ✅ Menu de contexto


## ⚙️ Configuração

### 1. Configurar API

Edite o arquivo `js/config.js` para ajustar a URL da API:

```javascript
const CONFIG = {
  API_BASE: "/api", // Altere para sua URL
  // ...
};
```

### 2. Endpoints da API Necessários

Sua API deve ter os seguintes endpoints:

- `POST /api/comment/new` - Criar comentário
- `GET /api/comment/list/:content_id` - Listar comentários
- `GET /api/comment/stats` - Estatísticas (opcional)
- `GET /api/health` - Health check (opcional)

### 3. Formato de Dados

#### Criar Comentário (Request)
```json
{
  "email": "user@example.com",
  "comment": "Texto do comentário",
  "content_id": "POST-001"
}
```

#### Listar Comentários (Response)
```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "comment": "Texto do comentário",
    "content_id": "POST-001",
    "created_at": "2024-01-20T10:30:00Z"
  }
]
```

## 🎨 Personalização

### Cores

Edite as variáveis CSS em `css/styles.css`:

```css
:root {
  --primary-color: #4F46E5;
  --secondary-color: #6B7280;
  --success-color: #10B981;
  --error-color: #EF4444;
  /* ... */
}
```

### Limites

Ajuste em `js/config.js`:

```javascript
const CONFIG = {
  MAX_COMMENT_LENGTH: 500,
  MIN_COMMENT_LENGTH: 3,
  TOAST_DURATION: 3000,
  // ...
};
```

## ⌨️ Atalhos de Teclado

- `Ctrl/Cmd + Enter` - Enviar formulário
- `Ctrl/Cmd + K` - Focar na busca
- `ESC` - Fechar menus/desfocar campos

## 🛠️ Modo Debug

Ative o modo debug no console:

```javascript
debugMode(true); // Ativar
debugMode(false); // Desativar
```


## 📊 API Global

Acesse funções via `window.CommentsApp`:

```javascript
CommentsApp.loadComments();        // Carregar comentários
CommentsApp.exportComments('csv'); // Exportar para CSV
CommentsApp.filterComments('termo'); // Filtrar localmente
CommentsApp.clearDraft();          // Limpar rascunho
```

## 🚦 Status da API

O sistema verifica automaticamente a saúde da API ao iniciar e exibe notificações caso haja problemas de conexão.



## 🎯 Melhorias Futuras

- [ ] Paginação para grandes volumes
- [ ] Upload de imagens
- [ ] Reactions/likes
- [ ] Respostas aninhadas
- [ ] Menções (@usuario)
- [ ] Rich text editor
- [ ] WebSocket para real-time
- [ ] PWA support
