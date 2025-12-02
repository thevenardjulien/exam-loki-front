// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logger from "../services/logger";

const GATEWAY_URL = process.env.REACT_APP_GATEWAY_URL || "https://examlokijulien-gateway-ufni8y.dokploy.app";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${GATEWAY_URL}/api/auth/login`,
        credentials
      );
      const { token, role, username } = response.data;

      // Stockage du token et rôle dans le localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);

      navigate("/"); // Redirige vers la page d'accueil après la connexion
    } catch (error) {
      // Gestion des erreurs
      if (error.response) {
        // Erreur renvoyée par le serveur
        const { message } = error.response.data;
        alert(message);
      } else if (error.code === "ERR_NETWORK" || error.message.includes("Network Error")) {
        // Erreur réseau (certificat SSL, CORS, etc.)
        logger.error("Erreur réseau ou certificat SSL", error);
        if (error.message.includes("CERT") || error.code === "ERR_CERT_AUTHORITY_INVALID") {
          alert("Erreur de certificat SSL. Le serveur n'est pas accessible. Veuillez contacter l'administrateur.");
        } else {
          alert("Erreur de connexion au serveur. Vérifiez votre connexion internet et réessayez.");
        }
      } else {
        // Autre erreur
        logger.error("Erreur lors de la connexion", error);
        alert("Une erreur est survenue. Veuillez réessayer.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Connexion</h2>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={credentials.username}
          onChange={(e) =>
            setCredentials({ ...credentials, username: e.target.value })
          }
          className="border border-gray-300 p-2 w-full mb-4"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          className="border border-gray-300 p-2 w-full mb-4"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 w-full rounded"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default Login;
