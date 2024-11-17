import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GooglePayButton from '@google-pay/button-react';
import axios from 'axios';
import './Del.css';

const Del = () => {
  const [price, setPrice] = useState(3549); // Default value
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    country: 'India',
    address: '',
    city: '',
    state: '',
    pin_code: '',
    phone: ''
  });



  // Handle form field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit form data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/submit-form/', formData);
      alert('Form submitted successfully!'); // Set success message
      setFormData({ email: '', country: 'India', address: '',city: '',state: '',pin_code: '',phone: ''}); // Clear form data
    } catch (error) {
      alert('Error submitting form. Please try again.'); // Set error message
    }

    // Clear the alert message after 3 seconds
    setTimeout(() => alert(''), 3000);
  };

  // Handle Cash on Delivery
  const handleCashOnDelivery = (e) => {
    e.preventDefault();
    handleSubmit(e); // Use the same form submission for Cash on Delivery
  };

  return (
    <div className="payment-form-container">
      <h2>Delivery</h2>
      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="form-group">
          <label>Email (for Order Updates)</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="Email (for Order Updates)" 
            required
          />
        </div>
        {/* Country */}
        <div className="form-group">
          <label>Country/Region</label>
          <select 
            name="country" 
            value={formData.country} 
            onChange={handleChange}
          >
            <option value="India">India</option>
            {/* Additional countries can be added */}
          </select>
        </div>

        {/* Address */}
        <div className="form-group">
          <label>Address</label>
          <input 
            type="text" 
            name="address" 
            value={formData.address} 
            onChange={handleChange} 
            placeholder="Address" 
            required
          />
        </div>

        {/* City */}
        <div className="form-group">
          <label>City</label>
          <input 
            type="text" 
            name="city" 
            value={formData.city} 
            onChange={handleChange} 
            placeholder="City" 
            required
          />
        </div>

        {/* State */}
        <div className="form-group">
          <label>State</label>
          <select 
            name="state" 
            value={formData.state} 
            onChange={handleChange}
          >
            <option value="Gujarat">Gujarat</option>
            {/* Additional states can be added */}
          </select>
        </div>

        {/* PIN Code */}
        <div className="form-group">
          <label>PIN Code</label>
          <input 
            type="text" 
            name="pin_code" 
            value={formData.pin_code} 
            onChange={handleChange} 
            placeholder="PIN code" 
            required
          />
        </div>

        {/* Phone */}
        <div className="form-group">
          <label>Phone</label>
          <input 
            type="tel" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            placeholder="Phone" 
            required
          />
        </div>

        <div className="checkbox-group">
          <input type="checkbox" id="save-info" />
          <label htmlFor="save-info">Save this information for next time</label>
        </div>

        <h2>Choose your payment method</h2>

        {/* Payment Options */}
        <div className="payment-options">
          <div className="payment-option">
            <GooglePayButton
              environment="TEST"
              paymentRequest={{
                apiVersion: 2,
                apiVersionMinor: 0,
                allowedPaymentMethods: [
                  {
                    type: 'CARD',
                    parameters: {
                      allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                      allowedCardNetworks: ['MASTERCARD', 'VISA'],
                    },
                    tokenizationSpecification: {
                      type: 'PAYMENT_GATEWAY',
                      parameters: {
                        gateway: 'example',
                        gatewayMerchantId: 'exampleGatewayMerchantId',
                      },
                    },
                  },
                ],
                merchantInfo: {
                  merchantId: '12345678901234567890',
                  merchantName: 'Demo Merchant',
                },
                transactionInfo: {
                  totalPriceStatus: 'FINAL',
                  totalPriceLabel: 'Total',
                  totalPrice: price.toString(), // Price in INR
                  currencyCode: 'INR',
                  countryCode: 'IN',
                },
                shippingAddressRequired: true,
                callbackIntents: ['SHIPPING_ADDRESS', 'PAYMENT_AUTHORIZATION'],
              }}
              onLoadPaymentData={paymentRequest => {
                console.log('Success', paymentRequest);
                // Submit form data after payment success
                handleSubmit();
              }}
              onPaymentAuthorized={paymentData => {
                console.log('Payment Authorised Success', paymentData);
                return { transactionState: 'SUCCESS' };
              }}
              onPaymentDataChanged={paymentData => {
                console.log('On Payment Data Changed', paymentData);
                return {};
              }}
              existingPaymentMethodRequired='false'
              buttonColor='black'
              buttonType='Buy'
            />
          </div>

          <div>
            {/* Cash On Delivery */}
            <input 
              type='radio' 
              name="payment" 
              onClick={handleCashOnDelivery} 
            />Cash On Delivery
          </div>
        </div>
      </form>
    </div>
  );
};

export default Del;
