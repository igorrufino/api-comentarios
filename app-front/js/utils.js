// Funções utilitárias

// Debounce para otimizar chamadas de função
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Sanitizar HTML para prevenir XSS
function sanitizeHTML(str) {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

// Validar email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Formatar data
function formatDate(dateString) {
  if (!dateString) return 'Data desconhecida';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    if (diffHours < 1) {
      const diffMinutes = Math.ceil(diffTime / (1000 * 60));
      return `${diffMinutes} minuto${diffMinutes !== 1 ? 's' : ''} atrás`;
    }
    return `${diffHours} hora${diffHours !== 1 ? 's' : ''} atrás`;
  } else if (diffDays === 1) {
    return 'Ontem';
  } else if (diffDays < 7) {
    return `${diffDays} dias atrás`;
  } else {
    return date.toLocaleDateString('pt-BR', CONFIG.DATE_FORMAT_OPTIONS);
  }
}

// Gerar avatar inicial
function getAvatarInitial(email) {
  if (!email) return '?';
  return email.charAt(0).toUpperCase();
}

// Mostrar/esconder loading
function setLoading(isLoading) {
  const overlay = document.getElementById('loadingOverlay');
  if (isLoading) {
    overlay.classList.add('active');
  } else {
    overlay.classList.remove('active');
  }
  APP_STATE.isLoading = isLoading;
}

// Mostrar toast notification
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type} fade-in`;
  
  const icon = getToastIcon(type);
  
  toast.innerHTML = `
    ${icon}
    <span class="toast-message">${sanitizeHTML(message)}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, CONFIG.TOAST_DURATION);
}

// Obter ícone para o toast
function getToastIcon(type) {
  const icons = {
    success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>`,
    error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>`,
    warning: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>`,
    info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>`
  };
  
  return icons[type] || icons.info;
}

// Validar formulário
function validateForm(formData) {
  const errors = {};
  
  if (!formData.email || !validateEmail(formData.email)) {
    errors.email = 'Por favor, insira um email válido';
  }
  
  if (!formData.comment || formData.comment.trim().length < CONFIG.MIN_COMMENT_LENGTH) {
    errors.comment = `O comentário deve ter pelo menos ${CONFIG.MIN_COMMENT_LENGTH} caracteres`;
  }
  
  if (formData.comment && formData.comment.length > CONFIG.MAX_COMMENT_LENGTH) {
    errors.comment = `O comentário não pode exceder ${CONFIG.MAX_COMMENT_LENGTH} caracteres`;
  }
  
  if (!formData.content_id || formData.content_id.trim().length === 0) {
    errors.content_id = 'O Content ID é obrigatório';
  }
  
  return errors;
}

// Mostrar erros de validação
function showValidationErrors(errors) {
  // Limpar erros anteriores
  document.querySelectorAll('.error-message').forEach(el => {
    el.textContent = '';
    el.classList.remove('active');
  });
  
  document.querySelectorAll('.form-input, .form-textarea').forEach(el => {
    el.classList.remove('error');
  });
  
  // Mostrar novos erros
  Object.keys(errors).forEach(field => {
    const errorEl = document.getElementById(`${field}Error`);
    const inputEl = document.getElementById(field);
    
    if (errorEl && inputEl) {
      errorEl.textContent = errors[field];
      errorEl.classList.add('active');
      inputEl.classList.add('error');
    }
  });
}

// Limpar erros de validação
function clearValidationErrors() {
  document.querySelectorAll('.error-message').forEach(el => {
    el.textContent = '';
    el.classList.remove('active');
  });
  
  document.querySelectorAll('.form-input, .form-textarea').forEach(el => {
    el.classList.remove('error');
  });
}

// Atualizar contador de caracteres
function updateCharCounter(value) {
  const counter = document.getElementById('charCount');
  if (counter) {
    counter.textContent = value.length;
    if (value.length > CONFIG.MAX_COMMENT_LENGTH) {
      counter.style.color = 'var(--error-color)';
    } else if (value.length > CONFIG.MAX_COMMENT_LENGTH * 0.8) {
      counter.style.color = 'var(--warning-color)';
    } else {
      counter.style.color = 'var(--text-tertiary)';
    }
  }
}

// Atualizar contador de comentários totais
function updateTotalComments(count) {
  const badge = document.getElementById('totalComments');
  if (badge) {
    badge.textContent = `${count} comentário${count !== 1 ? 's' : ''}`;
  }
  APP_STATE.totalComments = count;
}

// Scroll suave para elemento
function scrollToElement(element) {
  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Verificar se elemento está visível na viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
