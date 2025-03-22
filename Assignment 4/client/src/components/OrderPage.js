import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './OrderPage.css';

const OrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [email, setEmail] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [error, setError] = useState('');
  

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/products/${id}`);
        if (response.data) {
          setProduct(response.data);
        } else {
          console.error('Product not found');
          setError('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to fetch product details. Please try again.');
      }
    };
  
    fetchProduct();
  }, [id]);

  // Handle order confirmation
  const handleOrder = async () => {
    if (!email || !deliveryDate) {
      setError('Please fill in all fields.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/orders', {
        productId: id,
        quantity,
        emailId: email,
        deliveryDate,
      });
  
      if (response.status === 201) {
        console.log('Order placed successfully. Redirecting to orders page...');
        navigate('/orders'); // Redirect to orders page
      } else {
        setError('Failed to place order. Please try again.');
      }
    } catch (error) {
      setError('Failed to place order. Please try again.');
      console.error('Error placing order:', error);
    }
  };

  if (error) {
    return <div className="order-page">Error: {error}</div>;
  }
  
  if (!product) {
    return <div className="order-page">Loading product details...</div>;
  }
  
  return (
    <div className="order-page">
      <h1>Place Order</h1>
      {error && <p className="error">{error}</p>}
      <div className="product-details">
        <h2>{product.name}</h2>
        <p>Price: ${product.price}</p>
        <p>Available Stock: {product.stock}</p>
      </div>
      <div className="form-group">
        <label>Quantity:</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, e.target.value)))}
          min="1"
          max={product.stock}
        />
      </div>
      <div className="form-group">
        <label>Delivery Date:</label>
        <input
          type="date"
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
      <div className="form-group">
        <label>Email Address:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </div>
      <button className="confirm-button" onClick={handleOrder}>
        Confirm Order
      </button>
    </div>
  );
};

export default OrderPage;