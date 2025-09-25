// Funções de comentários

// Renderizar lista de comentários
function renderComments(comments) {
  const listElement = document.getElementById('commentsList');
  const emptyState = document.getElementById('emptyState');
  const container = document.getElementById('commentsContainer');
  
  if (!comments || comments.length === 0) {
    listElement.style.display = 'none';
    emptyState.style.display = 'block';
    updateTotalComments(0);
    return;
  }
  
  listElement.style.display = 'block';
  emptyState.style.display = 'none';
  listElement.innerHTML = '';
  
  // Ordenar comentários se necessário
  let sortedComments = [...comments];
  if (APP_STATE.sortByDate) {
    sortedComments.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }
  
  // Renderizar cada comentário
  sortedComments.forEach((comment, index) => {
    const commentElement = createCommentElement(comment, index);
    listElement.appendChild(commentElement);
  });
  
  updateTotalComments(comments.length);
  APP_STATE.currentComments = comments;
}

// Criar elemento de comentário
function createCommentElement(comment, index) {
  const li = document.createElement('li');
  li.className = 'comment-item';
  li.style.animationDelay = `${index * 0.05}s`;
  
  const initial = getAvatarInitial(comment.email);
  const formattedDate = formatDate(comment.created_at);
  
  li.innerHTML = `
    <div class="comment-header">
      <div class="comment-author">
        <div class="author-avatar">${initial}</div>
        <div class="author-info">
          <div class="author-email">${sanitizeHTML(comment.email)}</div>
          <div class="comment-date">${formattedDate}</div>
        </div>
      </div>
      <div class="comment-badge">${sanitizeHTML(comment.content_id)}</div>
    </div>
    <div class="comment-content">
      ${sanitizeHTML(comment.comment)}
    </div>
  `;
  
  // Adicionar menu de contexto (se quiser implementar ações)
  li.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showCommentContextMenu(e, comment);
  });
  
  return li;
}

// Mostrar menu de contexto do comentário (opcional)
function showCommentContextMenu(event, comment) {
  // Remover menu existente
  const existingMenu = document.querySelector('.context-menu');
  if (existingMenu) {
    existingMenu.remove();
  }
  
  // Criar novo menu
  const menu = document.createElement('div');
  menu.className = 'context-menu';
  menu.style.position = 'absolute';
  menu.style.left = `${event.pageX}px`;
  menu.style.top = `${event.pageY}px`;
  
  menu.innerHTML = `
    <div class="context-menu-item" onclick="copyCommentText('${comment.comment}')">
      Copiar texto
    </div>
    <div class="context-menu-item" onclick="copyCommentEmail('${comment.email}')">
      Copiar email
    </div>
  `;
  
  document.body.appendChild(menu);
  
  // Fechar menu ao clicar fora
  setTimeout(() => {
    document.addEventListener('click', () => {
      menu.remove();
    }, { once: true });
  }, 0);
}

// Copiar texto do comentário
function copyCommentText(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Texto copiado!', 'success');
  });
}

// Copiar email
function copyCommentEmail(email) {
  navigator.clipboard.writeText(email).then(() => {
    showToast('Email copiado!', 'success');
  });
}

// Buscar e carregar comentários
async function loadComments() {
  const contentId = document.getElementById('search_content_id').value.trim();
  
  if (!contentId) {
    showToast('Por favor, digite um Content ID', 'warning');
    return;
  }
  
  // Desabilitar botão durante busca
  const searchBtn = document.getElementById('searchBtn');
  searchBtn.disabled = true;
  
  const result = await fetchComments(contentId);
  
  if (result.success) {
    renderComments(result.data);
    if (result.data.length === 0) {
      showToast(`Nenhum comentário encontrado para "${contentId}"`, 'info');
    } else {
      showToast(`${result.data.length} comentário(s) encontrado(s)`, 'success');
    }
  } else {
    showToast(result.error || 'Erro ao buscar comentários', 'error');
    renderComments([]);
  }
  
  searchBtn.disabled = false;
}

// Adicionar novo comentário
async function submitComment(event) {
  event.preventDefault();
  
  const formData = {
    email: document.getElementById('email').value.trim(),
    comment: document.getElementById('comment').value.trim(),
    content_id: document.getElementById('content_id').value.trim()
  };
  
  // Validar dados
  const errors = validateForm(formData);
  if (Object.keys(errors).length > 0) {
    showValidationErrors(errors);
    showToast('Por favor, corrija os erros no formulário', 'warning');
    return;
  }
  
  clearValidationErrors();
  
  // Desabilitar botão durante envio
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  submitBtn.classList.add('loading');
  
  const result = await createComment(formData);
  
  if (result.success) {
    showToast('Comentário enviado com sucesso!', 'success');
    document.getElementById('commentForm').reset();
    updateCharCounter('');
    
    // Se estiver visualizando o mesmo content_id, recarregar
    const searchContentId = document.getElementById('search_content_id').value;
    if (searchContentId === formData.content_id) {
      await loadComments();
    }
  } else {
    showToast(result.error || 'Erro ao enviar comentário', 'error');
  }
  
  submitBtn.disabled = false;
  submitBtn.classList.remove('loading');
}

// Lidar com ordenação
function handleSort() {
  const checkbox = document.getElementById('sortByDate');
  APP_STATE.sortByDate = checkbox.checked;
  
  if (APP_STATE.currentComments.length > 0) {
    renderComments(APP_STATE.currentComments);
  }
}

// Filtrar comentários localmente
function filterComments(searchTerm) {
  if (!searchTerm) {
    renderComments(APP_STATE.currentComments);
    return;
  }
  
  const filtered = APP_STATE.currentComments.filter(comment => {
    const term = searchTerm.toLowerCase();
    return comment.email.toLowerCase().includes(term) ||
           comment.comment.toLowerCase().includes(term) ||
           comment.content_id.toLowerCase().includes(term);
  });
  
  renderComments(filtered);
}

// Exportar comentários (opcional)
function exportComments(format = 'json') {
  if (APP_STATE.currentComments.length === 0) {
    showToast('Nenhum comentário para exportar', 'warning');
    return;
  }
  
  let data, filename, type;
  
  if (format === 'json') {
    data = JSON.stringify(APP_STATE.currentComments, null, 2);
    filename = 'comments.json';
    type = 'application/json';
  } else if (format === 'csv') {
    data = convertToCSV(APP_STATE.currentComments);
    filename = 'comments.csv';
    type = 'text/csv';
  }
  
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
  
  showToast('Comentários exportados!', 'success');
}

// Converter para CSV
function convertToCSV(data) {
  const headers = ['Email', 'Comentário', 'Content ID', 'Data'];
  const rows = data.map(item => [
    item.email,
    `"${item.comment.replace(/"/g, '""')}"`,
    item.content_id,
    item.created_at || ''
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}
