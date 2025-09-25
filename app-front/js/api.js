// Funções da API

// Criar novo comentário
async function createComment(commentData) {
  try {
    setLoading(true);
    
    const response = await fetch(`${CONFIG.API_BASE}/comment/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao criar comentário');
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao criar comentário:', error);
    return { success: false, error: error.message };
  } finally {
    setLoading(false);
  }
}

// Buscar comentários por content_id
async function fetchComments(contentId) {
  try {
    setLoading(true);
    
    const response = await fetch(`${CONFIG.API_BASE}/comment/list/${contentId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return { success: true, data: [] };
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao buscar comentários');
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    return { success: false, error: error.message };
  } finally {
    setLoading(false);
  }
}

// Deletar comentário (se sua API suportar)
async function deleteComment(commentId) {
  try {
    setLoading(true);
    
    const response = await fetch(`${CONFIG.API_BASE}/comment/${commentId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao deletar comentário');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao deletar comentário:', error);
    return { success: false, error: error.message };
  } finally {
    setLoading(false);
  }
}

// Atualizar comentário (se sua API suportar)
async function updateComment(commentId, updateData) {
  try {
    setLoading(true);
    
    const response = await fetch(`${CONFIG.API_BASE}/comment/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao atualizar comentário');
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao atualizar comentário:', error);
    return { success: false, error: error.message };
  } finally {
    setLoading(false);
  }
}

// Buscar estatísticas (se sua API suportar)
async function fetchStats() {
  try {
    const response = await fetch(`${CONFIG.API_BASE}/comment/stats`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar estatísticas');
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return { success: false, error: error.message };
  }
}

// Verificar saúde da API
async function checkAPIHealth() {
  try {
    const response = await fetch(`${CONFIG.API_BASE}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000) // Timeout de 5 segundos
    });
    
    return response.ok;
  } catch (error) {
    console.error('API não está respondendo:', error);
    return false;
  }
}

// Retry logic para chamadas de API
async function retryAPICall(apiFunction, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    const result = await apiFunction();
    
    if (result.success) {
      return result;
    }
    
    if (i < maxRetries - 1) {
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  
  return { success: false, error: 'Máximo de tentativas excedido' };
}
