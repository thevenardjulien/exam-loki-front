// src/services/api.js
import axios from 'axios';
import logger from './logger';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

export const fetchProducts = () => axios.get(`${API_BASE_URL}/products`);

export const createOrder = async (orderData) => {
    try {
        logger.info(`appel fonction createOrder avec orderData ${JSON.stringify(orderData)}`);
        const token = localStorage.getItem('token'); 
        
        if (!token) {
            throw new Error('Aucun token d\'authentification trouvé. Veuillez vous connecter.');
        }
        
        logger.info(`token is ${token}`);
        
        const response = await axios.post(`${API_BASE_URL}/orders`, orderData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        return response;
    } catch (error) {
        // Gérer les erreurs d'authentification
        if (error.response) {
            const status = error.response.status;
            
            if (status === 401 || status === 403) {
                // Token invalide ou expiré
                logger.error('Token invalide ou expiré', error);
                // Nettoyer le localStorage
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                localStorage.removeItem('role');
                
                // Lancer une erreur avec un message spécifique
                const authError = new Error('Votre session a expiré. Veuillez vous reconnecter.');
                authError.status = status;
                authError.isAuthError = true;
                throw authError;
            }
        }
        
        // Relancer l'erreur pour qu'elle soit gérée par le composant
        throw error;
    }
};
