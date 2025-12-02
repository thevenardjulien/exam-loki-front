// src/services/api.js
import axios from 'axios';
import logger from './logger';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

export const fetchProducts = () => axios.get(`${API_BASE_URL}/products`);

export const createOrder = (orderData) => {
    logger.info(`appel fonction createOrder avec orderData ${JSON.stringify(orderData)}`)
    const token = localStorage.getItem('token'); // Token de connexion
    logger.info(`token is ${token}`)
    return axios.post(`${API_BASE_URL}/orders`, orderData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
