// Inicialização principal da aplicação

document.addEventListener('DOMContentLoaded', function() {
  console.log('Sistema de Comentários iniciado');
  
  // Inicializar event listeners
  initializeEventListeners();
  
  // Verificar saúde da API
  checkAPIConnection();
  
  // Carregar estatísticas iniciais
  loadInitialStats();
  
  // Configurar atalhos de teclado
  setupKeyboardShortcuts();
  
  // Restaurar rascunho se existir
  restoreDraft();
});

// Inicializar todos os event listeners
function initializeEventListeners() {
  // Formulário de comentário
  const commentForm = document.getElementById('commentForm');
  if (commentForm) {
    commentForm.addEventListener('submit', submitComment);
  }
  
  // Campo de comentário - contador de caracteres
  const commentField = document.getElementById('comment');
  if (commentField) {
    commentField.addEventListener('input', (e) => {
      updateCharCounter(e.target.value);
      autoSaveForm(); // Auto-save ao digitar
    });
    
    // Auto-resize do textarea
    commentField.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    });
  }
  
  // Auto-save em outros campos
  document.getElementById('email')?.addEventListener('input', autoSaveForm);
  document.getElementById('content_id')?.addEventListener('input', autoSaveForm);
  
  // Busca ao pressionar Enter
  const searchInput = document.getElementById('search_content_id');
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        loadComments();
      }
    });
  }
  
  // Limpar erros ao digitar
  const inputs = document.querySelectorAll('.form-input, .form-textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        input.classList.remove('error');
        const errorMsg = document.getElementById(`${input.id}Error`);
        if (errorMsg) {
          errorMsg.classList.remove('active');
          errorMsg.textContent = '';
        }
      }
    });
  });
  
  // Fechar toasts ao clicar
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('toast')) {
      e.target.remove();
    }
  });
}

// Verificar conexão com a API
async function checkAPIConnection() {
  const isHealthy = await checkAPIHealth();
  
  if (!isHealthy) {
    showToast('⚠️ API não está respondendo. Verifique a conexão.', 'warning');
    console.error('API não está acessível em:', CONFIG.API_BASE);
  } else {
    console.log('API conectada com sucesso');
  }
}

// Carregar estatísticas iniciais
async function loadInitialStats() {
  const result = await fetchStats();
  
  if (result.success && result.data) {
    updateTotalComments(result.data.totalComments || 0);
  }
}

// Configurar atalhos de teclado
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter para enviar formulário
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      const activeElement = document.activeElement;
      if (activeElement && activeElement.form) {
        activeElement.form.dispatchEvent(new Event('submit'));
      }
    }
    
    // Ctrl/Cmd + K para focar na busca
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.getElementById('search_content_id');
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }
    
    // ESC para fechar modais/menus
    if (e.key === 'Escape') {
      // Fechar menu de contexto se existir
      const contextMenu = document.querySelector('.context-menu');
      if (contextMenu) {
        contextMenu.remove();
      }
      
      // Limpar formulário se estiver focado
      const activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        activeElement.blur();
      }
    }
  });
}

// Adicionar estilos para menu de contexto
const contextMenuStyles = document.createElement('style');
contextMenuStyles.textContent = `
  .context-menu {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-lg);
    padding: 8px 0;
    z-index: 1000;
    min-width: 150px;
  }
  
  .context-menu-item {
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
    color: var(--text-primary);
    transition: var(--transition);
  }
  
  .context-menu-item:hover {
    background-color: var(--bg-secondary);
  }
`;
document.head.appendChild(contextMenuStyles);

// Auto-save do formulário
let autoSaveTimer;
function autoSaveForm() {
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => {
    const formData = {
      email: document.getElementById('email').value,
      comment: document.getElementById('comment').value,
      content_id: document.getElementById('content_id').value
    };
    
    localStorage.setItem('commentDraft', JSON.stringify(formData));
    console.log('Rascunho salvo automaticamente');
  }, 1000);
}

// Restaurar rascunho se existir
function restoreDraft() {
  const draft = localStorage.getItem('commentDraft');
  if (draft) {
    try {
      const formData = JSON.parse(draft);
      if (formData.email || formData.comment || formData.content_id) {
        if (confirm('Há um rascunho salvo. Deseja restaurá-lo?')) {
          document.getElementById('email').value = formData.email || '';
          document.getElementById('comment').value = formData.comment || '';
          document.getElementById('content_id').value = formData.content_id || '';
          updateCharCounter(formData.comment || '');
        } else {
          localStorage.removeItem('commentDraft');
        }
      }
    } catch (e) {
      console.error('Erro ao restaurar rascunho:', e);
      localStorage.removeItem('commentDraft');
    }
  }
}

// Limpar rascunho após envio bem-sucedido
window.clearDraft = function() {
  localStorage.removeItem('commentDraft');
};

// Função para modo debug
window.debugMode = function(enable = true) {
  if (enable) {
    localStorage.setItem('debug', 'true');
    console.log('Modo debug ativado');
    console.log('CONFIG:', CONFIG);
    console.log('APP_STATE:', APP_STATE);
  } else {
    localStorage.removeItem('debug');
    console.log('Modo debug desativado');
  }
};

// Verificar modo debug
if (localStorage.getItem('debug') === 'true') {
  console.log('Modo debug está ativo');
  window.CONFIG = CONFIG;
  window.APP_STATE = APP_STATE;
}

// Detectar tema do sistema
function detectSystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
  }
  
  // Escutar mudanças no tema
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (e.matches) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  });
}

// Aplicar tema ao carregar
detectSystemTheme();

// Verificar performance
if (window.performance) {
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log('Tempo de carregamento:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
  });
}

// Exportar funções globais para uso externo
window.CommentsApp = {
  loadComments,
  submitComment,
  exportComments,
  filterComments,
  clearDraft,
  debugMode
};

console.log('Sistema pronto! Use CommentsApp para acessar as funções.');
