// src/config/apiConfig.js
// Configuration automatique de l'URL de l'API selon l'environnement

const getApiBaseUrl = () => {
  // Si une variable d'environnement est définie, on l'utilise en priorité
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }

  // Détection automatique de l'environnement
  const hostname = window.location.hostname;
  
  // Si on est sur localhost, on utilise l'API locale
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5001/api';
  }

  // Sinon, on est en production, on utilise l'URL de production
  return 'https://examlokijulien-gateway-ufni8y.dokploy.app/api';
};

export const API_BASE_URL = getApiBaseUrl();
