import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ShippingMethodSelection from '../components/ShippingMethodSelection';
import PaymentMethodSelection from '../components/handlePaymentChange';
import ShippingAddress from '../components/ShippingAddress';


const ShippingPayment = () => {
  const navigate = useNavigate();
  const { shippingAddress, shippingMethod, paymentMethod } = useCart();
  
  // Naviguer vers la page de commande avec validation
  const handleSubmitOrder = (e) => {
    e.preventDefault();
    
    // Validation des champs requis
    const missingFields = [];
    
    if (!shippingAddress.street) missingFields.push('Rue');
    if (!shippingAddress.city) missingFields.push('Ville');
    if (!shippingAddress.postalCode) missingFields.push('Code Postal');
    if (!shippingAddress.country) missingFields.push('Pays');
    if (!shippingMethod) missingFields.push('Méthode de livraison');
    if (!paymentMethod) missingFields.push('Méthode de paiement');
    
    if (missingFields.length > 0) {
      alert(`Veuillez remplir tous les champs obligatoires :\n${missingFields.map(field => `• ${field}`).join('\n')}`);
      return;
    }
    
    navigate('/order');
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Livraison et Paiement</h2>
      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <ShippingAddress /> 
          </div>
          <div>
            <ShippingMethodSelection />
            <PaymentMethodSelection />
          </div>
        </div>
        <hr className="my-4" />
        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Passer une commande
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingPayment;
