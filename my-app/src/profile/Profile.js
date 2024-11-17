import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css'; // Import the CSS file
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [navbarData, setNavbarData] = useState(null);
  const [footerData, setFooterData] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [contactDetails, setContactDetails] = useState({
    email: '',
    phone: ''
  });
  const [addressDetails, setAddressDetails] = useState({
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: ''
  });
  const [viewAddress, setViewAddress] = useState(false); // To toggle address view
  const [viewOrders, setViewOrders] = useState(false);   // To toggle orders view
  const [selectedOrder, setSelectedOrder] = useState(null); // To manage selected order

  const handleShowDetails = () => {
    navigate('/Profile');  // Navigate to the user details page
  };

  useEffect(() => {
    const fetchNavbarData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/navbar/');
        setNavbarData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching navbar data:', error);
      }
    };

    fetchNavbarData();
  }, []);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/footer/');
        setFooterData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching footer data:', error);
      }
    };

    fetchFooterData();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const username = localStorage.getItem('userDetails');
        const userData = JSON.parse(username);
        const response = await axios.get(`http://127.0.0.1:8000/api/orders?username=${userData.username}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error.response || error.message);
      }
    };

    fetchOrders();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
  };

  useEffect(() => {
    const storedUserDetails = JSON.parse(localStorage.getItem('userDetails'));
    setUserDetails(storedUserDetails);
    setContactDetails({
      email: storedUserDetails.email,
      phone: storedUserDetails.phone
    });
    setAddressDetails({
      address: storedUserDetails.address,
      city: storedUserDetails.city,
      state: storedUserDetails.state,
      pincode: storedUserDetails.pincode,
      country: storedUserDetails.country
    });
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email" || name === "phone") {
      setContactDetails({
        ...contactDetails,
        [name]: value
      });
    } else {
      setAddressDetails({
        ...addressDetails,
        [name]: value
      });
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/update-address/', {
        username: userDetails.username,
        ...addressDetails,
        ...contactDetails
      });

      if (response.status === 200) {
        setUserDetails((prevDetails) => ({
          ...prevDetails,
          ...addressDetails,
          ...contactDetails
        }));
        localStorage.setItem('userDetails', JSON.stringify({ ...userDetails, ...addressDetails, ...contactDetails }));
        setIsEditing(false);
      } else {
        alert('Failed to update details.');
      }
    } catch (error) {
      console.error('Error updating details:', error);
      alert('Error updating details.');
    }
  };

  const handleViewAddress = () => {
    setViewAddress(true);
    setViewOrders(false);
  };

  const handleViewOrders = () => {
    setViewOrders(true);
    setViewAddress(false);
    setSelectedOrder(null); // Reset selected order when switching to orders view
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/cancel-order/', {
        order_id: orderId,
      });
  
      if (response.status === 200) {
        // Update the local orders state to mark the order as canceled
        setOrders((prevOrders) =>
          prevOrders.map(order =>
            order.id === orderId ? { ...order, is_canceled: true } : order
          )
        );
        alert('Order canceled successfully.');
      } else {
        alert('Failed to cancel order.');
      }
    } catch (error) {
      console.error('Error canceling order:', error);
      alert('Error canceling order.');
    }
  };
  

  return (
    <>
      <div className='navbar'>
        {navbarData && (
          <>
            <img src={navbarData.logo} alt='Logo' className='logo' />
            <div className='links'>
              <ul className={isMobile ? 'nav-links-mobile' : ''} onClick={() => setIsMobile(false)}>
                {navbarData.links.map((link, index) => (
                  <li key={index}>
                    <a href={link.url}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className='menu-icon' onClick={() => setIsMobile(!isMobile)}>
              <img src='/path/to/menu-icon.png' alt='Menu' />
            </div>
            <div onClick={handleShowDetails} className='profile'>
              <img src={navbarData.profile_logo} alt='Cart' />
            </div>
          </>
        )}
      </div>
      <div className="profile-container">
        <div className="profile-navbar">
          <h2>Hi {userDetails ? userDetails.username : 'User'}</h2>
          <button onClick={handleViewAddress}>Address</button>
          <button onClick={handleViewOrders}>Orders</button>
          <button onClick={handleLogout}>Logout</button>
        </div>

        <div className="profile-content">
          {viewAddress && (
            <div className="user-details">
              {userDetails ? (
                <div className="user-details-card">
                  <h1 className="user-details-header">Address</h1>
                  <p><strong>Username:</strong> {userDetails.username}</p>

                  {!isEditing ? (
                    <>
                      <p><strong>Email:</strong> {userDetails.email}</p>
                      <p><strong>Phone:</strong> {userDetails.phone}</p>
                      <p><strong>Address:</strong> {userDetails.address}</p>
                      <p><strong>City:</strong> {userDetails.city}</p>
                      <p><strong>State:</strong> {userDetails.state}</p>
                      <p><strong>PIN Code:</strong> {userDetails.pincode}</p>
                      <p><strong>Country:</strong> {userDetails.country}</p>
                      <button className="edit-button" onClick={handleEditToggle}>Edit Details</button>
                    </>
                  ) : (
                    <div className="edit-form">
                      <h2>Edit Details</h2>
                      <input
                        className="input-field"
                        type="email"
                        name="email"
                        value={contactDetails.email}
                        onChange={handleChange}
                        placeholder="Email"
                      />
                      <input
                        className="input-field"
                        type="text"
                        name="phone"
                        value={contactDetails.phone}
                        onChange={handleChange}
                        placeholder="Phone"
                      />
                      <input
                        className="input-field"
                        type="text"
                        name="address"
                        value={addressDetails.address}
                        onChange={handleChange}
                        placeholder="Address"
                      />
                      <input
                        className="input-field"
                        type="text"
                        name="city"
                        value={addressDetails.city}
                        onChange={handleChange}
                        placeholder="City"
                      />
                      <input
                        className="input-field"
                        type="text"
                        name="state"
                        value={addressDetails.state}
                        onChange={handleChange}
                        placeholder="State"
                      />
                      <input
                        className="input-field"
                        type="text"
                        name="pincode"
                        value={addressDetails.pincode}
                        onChange={handleChange}
                        placeholder="PIN Code"
                      />
                      <input
                        className="input-field"
                        type="text"
                        name="country"
                        value={addressDetails.country}
                        onChange={handleChange}
                        placeholder="Country"
                      />
                      <button className="save-button" onClick={handleSave}>Save</button>
                      <button className="cancel-button" onClick={handleEditToggle}>Cancel</button>
                    </div>
                  )}
                </div>
              ) : (
                <p>No user details found.</p>
              )}
            </div>
          )}

{viewOrders && (
        <div className="orders-section">
          <h2>Your Orders</h2>
          <div className="orders-list">
            {orders.length > 0 ? (
              orders.map(order => (
                <div key={order.id} className="order-item" onClick={() => handleSelectOrder(order)}>
                  <p>Order ID: {order.id}</p>
                  <p>Status: {order.is_delivered ? 'Delivered' : 'Not Delivered'}</p>

                  {/* Show cancel button only if the order is not delivered */}
                  {!order.is_delivered && !order.is_canceled && (
                    <button className="cancel-button" onClick={() => handleCancelOrder(order.id)}>Cancel Order</button>
                  )}

                  {/* Display more details for the selected order */}
                  {selectedOrder && selectedOrder.id === order.id && (
                    <div className="order-details">
                      <h3>Order Details for ID: {selectedOrder.id}</h3>
                      <p><strong>Product:</strong> {selectedOrder.product_description}</p>
                      <p><strong>Size:</strong> {selectedOrder.product_weight}</p>
                      <p><strong>Price:</strong> ₹{selectedOrder.product_price}</p>
                      <p><strong>Ordered On:</strong> {new Date(selectedOrder.order_date).toLocaleString()}</p>
                      <p><strong>Status:</strong> {selectedOrder.is_delivered ? 'Delivered' : 'Not Delivered'}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No orders found.</p>
            )}
          </div>
        </div>
      )}
        </div>
      </div>
      {footerData && (
        <div className='footer-div'>
          <footer>
            <div className='row'>
              <div className='col'>
                <img src={footerData.logo} alt='Company Logo' className='footer-logo' />
                <p>{footerData.description}</p>
              </div>
              <div className='col'>
                <h3>Contact Us</h3>
                <p>{footerData.address}</p>
                <p>Email: {footerData.email}</p>
              </div>
              <div className='col'>
                <h3>Quick Links</h3>
                <ul className='footer-link'>
                  {footerData.links.map((link, index) => (
                    <li key={index}><a href={link.url}>{link.label}</a></li>
                  ))}
                </ul>
              </div>
              <div className='col'>
                <h3>Follow Us</h3>
                <div className='social'>
                  {footerData.social_links.map((social, index) => (
                    <a key={index} href={social.url}>
                      <i className={social.icon}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </footer>
        </div>
      )}
    </>
  );
};

export default Profile;
