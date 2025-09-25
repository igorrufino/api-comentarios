// Configurações da aplicação
const CONFIG = {
  API_BASE: "/api", // Ajuste se mudar porta/host
  MAX_COMMENT_LENGTH: 500,
  MIN_COMMENT_LENGTH: 3,
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 300,
  DATE_FORMAT_OPTIONS: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
};

// Estado global da aplicação
const APP_STATE = {
  currentComments: [],
  isLoading: false,
  sortByDate: false,
  totalComments: 0
};
