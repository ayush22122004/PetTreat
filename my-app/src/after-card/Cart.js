import React, { useState, useEffect } from 'react';
import './Cart.css';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [username, setUsername] = useState('');  // Store username fetched from backend

  // Fetch username from the backend after login
  const fetchUsername = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/get-username/', {
        withCredentials: true  // Ensure that cookies are sent
      });
      setUsername(response.data.username);
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };

  useEffect(() => {
    fetchUsername();  // Fetch username when the component loads
  }, []);

  useEffect(() => {
    if (username) {
      // Fetch cart items from the backend for the logged-in user
      const fetchCart = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/cart/', {
            headers: { 'Username': username }  // Pass the fetched username in headers
          });
          setCartItems(response.data);
        } catch (error) {
          console.error('Error fetching cart data:', error);
        }
      };
      fetchCart();
    }
  }, [username]);  // Only fetch cart items after the username is set

  const updateCartItem = async (productId, quantity) => {
    try {
      await axios.post('http://localhost:8000/api/cart/update/', { username, product_id: productId, quantity });
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.post('http://localhost:8000/api/cart/remove/', { username, product_id: productId });
      setCartItems(cartItems.filter(item => item.product !== productId));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const increaseQuantity = (index) => {
    const newCartItems = [...cartItems];
    newCartItems[index].quantity += 1;
    setCartItems(newCartItems);
    updateCartItem(newCartItems[index].product, newCartItems[index].quantity);
  };

  const decreaseQuantity = (index) => {
    const newCartItems = [...cartItems];
    if (newCartItems[index].quantity > 1) {
      newCartItems[index].quantity -= 1;
      setCartItems(newCartItems);
      updateCartItem(newCartItems[index].product, newCartItems[index].quantity);
    }
  };

  const calculateTotalMRP = () => {
    return cartItems.reduce((total, item) => total + item.mrp * item.quantity, 0);
  };

  const calculateDiscount = () => {
    const discountPercentage = 0.15; // Assuming a 15% discount on MRP
    return calculateTotalMRP() * discountPercentage;
  };

  const calculateTotalAmount = () => {
    const deliveryFee = calculateTotalMRP() > 1000 ? 0 : 49; // Free delivery if MRP > 1000
    return calculateTotalMRP() - calculateDiscount() + deliveryFee;
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (cartItems.length === 0) return <div>Your cart is empty.</div>;

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      <div className="cart-items">
        {cartItems.map((item, index) => (
          <div key={index} className="cart-item">
            <img src={item.image} alt={item.description} />
            <div className="item-details">
              <h2>{item.description}</h2>
              <p>Weight: {item.weight}</p>
              <div className="quantity-controls">
                <button onClick={() => decreaseQuantity(index)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQuantity(index)}>+</button>
              </div>
              <p>Price: ₹{item.price}</p>
              <p>MRP: ₹{item.mrp}</p>
              <p>Quantity: {item.quantity}</p>
              <button onClick={() => removeItem(item.product)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="price-summary">
        <h2>Price Details ({totalItems} {totalItems > 1 ? 'Items' : 'Item'})</h2>
        <div className="price-row">
          <span>Total MRP</span>
          <span>₹{calculateTotalMRP().toFixed(2)}</span>
        </div>
        <div className="price-row">
          <span>Discount On MRP</span>
          <span>- ₹{calculateDiscount().toFixed(2)}</span>
        </div>
        <div className="price-row">
          <span>Delivery Fee</span>
          <span>₹{calculateTotalMRP() > 1000 ? 'Free' : '49.00'}</span>
        </div>
        <div className="price-row total">
          <span>Total Amount</span>
          <span>₹{calculateTotalAmount().toFixed(2)}</span>
        </div>
        <p>(Incl. of all taxes)</p>
        <button className="checkout-button">Checkout</button>
      </div>
    </div>
  );
};

export default Cart;
