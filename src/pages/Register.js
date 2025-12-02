// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logger from '../services/logger';

// Utiliser directement le backend (même URL que l'API)
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Utiliser directement le backend pour l'inscription
      await axios.post(`${API_BASE_URL}/auth/register`, formData);
      alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      navigate('/login');
    } catch (err) {
      if (err.response) {
        // Erreur renvoyée par le serveur
        const { message } = err.response.data;
        alert(message);
      } else if (err.code === "ERR_NETWORK" || err.message.includes("Network Error")) {
        // Erreur réseau (certificat SSL, CORS, etc.)
        logger.error("Erreur réseau ou certificat SSL", err);
        if (err.message.includes("CERT") || err.code === "ERR_CERT_AUTHORITY_INVALID") {
          alert("Erreur de certificat SSL. Le serveur n'est pas accessible. Veuillez contacter l'administrateur.");
        } else {
          alert("Erreur de connexion au serveur. Vérifiez votre connexion internet et réessayez.");
        }
      } else {
        // Autre erreur
        logger.error("Erreur réseau ou serveur", err);
        alert("Une erreur est survenue. Veuillez réessayer.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Inscription</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="text"
          name="username"
          placeholder="Nom d'utilisateur"
          value={formData.username}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full mb-4"
        />
        <input
          type="email"
          name="email"
          placeholder="Adresse email"
          value={formData.email}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full mb-4"
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full mb-4"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">S'inscrire</button>
      </form>
    </div>
  );
};

export default Register;
