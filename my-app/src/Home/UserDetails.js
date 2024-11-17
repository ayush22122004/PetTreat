import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserDetails.css';
import { useLocation, useNavigate } from 'react-router-dom';

const UserDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State hooks
  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [contactDetails, setContactDetails] = useState({ email: '', phone: '' });
  const [addressDetails, setAddressDetails] = useState({ address: '', city: '', state: '', pincode: '', country: '' });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [navbarData, setNavbarData] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const product = location.state?.product || {};
  const [footerData, setFooterData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ description: '', image: null, rating: 0 });

  // Fetch footer data
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

  // Fetch navbar data
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

  // Load user details from localStorage and calculate delivery charge
  useEffect(() => {
    const storedUserDetails = JSON.parse(localStorage.getItem('userDetails'));
    setUserDetails(storedUserDetails);
    setContactDetails({ email: storedUserDetails.email, phone: storedUserDetails.phone });
    setAddressDetails({
      address: storedUserDetails.address,
      city: storedUserDetails.city,
      state: storedUserDetails.state,
      pincode: storedUserDetails.pincode,
      country: storedUserDetails.country
    });

    const calculateDeliveryCharge = (price) => {
      return price < 500 ? 50 : 0; // ₹50 for orders below ₹500, free otherwise
    };
    
    const charge = calculateDeliveryCharge(product.price);
    setDeliveryCharge(charge);
  }, [product.price]);

  // Review form submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('description', newReview.description);
    formData.append('image', newReview.image);
    formData.append('rating', newReview.rating);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/reviews/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setReviews([...reviews, response.data]);
      setNewReview({ description: '', image: null, rating: 0 });
      alert('Thank you for your review!');
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  // Input change handlers
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    if (name === 'image') {
      setNewReview({ ...newReview, image: e.target.files[0] });
    } else {
      setNewReview({ ...newReview, [name]: value });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email' || name === 'phone') {
      setContactDetails({ ...contactDetails, [name]: value });
    } else {
      setAddressDetails({ ...addressDetails, [name]: value });
    }
  };

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleProceedToOrder = async () => {
    const orderDetails = {
      username: userDetails.username,
      product_description: product.description,
      product_weight: product.weight,
      product_price: product.price,
      delivery_charge: deliveryCharge,
      total_price: product.price + deliveryCharge,
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/create-order/', orderDetails);
      if (response.status === 201) {
        navigate('/Thankyou');
      } else {
        alert('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order.');
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/update-address/', {
        username: userDetails.username,
        ...addressDetails,
        ...contactDetails,
      });

      if (response.status === 200) {
        setUserDetails({ ...userDetails, ...addressDetails, ...contactDetails });
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

  const totalPrice = product.price + deliveryCharge;

  if (!footerData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Navbar Section */}
      <div className="navbar">
        {navbarData && (
          <>
            <img src={navbarData.logo} alt="Logo" className="logo" />
            <div className="links">
              <ul className={isMobile ? 'nav-links-mobile' : ''} onClick={() => setIsMobile(false)}>
                {navbarData.links.map((link, index) => (
                  <li key={index}><a href={link.url}>{link.label}</a></li>
                ))}
              </ul>
            </div>
            <div className="menu-icon" onClick={() => setIsMobile(!isMobile)}>
              <img src="/path/to/menu-icon.png" alt="Menu" />
            </div>
            <div onClick={() => navigate('/Profile')} className="profile">
              <img src={navbarData.profile_logo} alt="Profile" />
            </div>
          </>
        )}
      </div>

      {/* User Details and Order Section */}
      <div className="user-details-container container">
        <div className="row">
          <div className="col-md-6">
            {userDetails ? (
              <div className="user-details-card">
                <h1 className="user-details-header">User Details</h1>
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
                  </div>
                )}
              </div>
            ) : (
              <div>No user details found.</div>
            )}
          </div>

          {/* Product and Order Summary */}
          <div className="col-md-6">  
        {/* Display Price, Delivery Charge, and Total Price */}
        <div className="price-details">
          <h3>Price Details</h3>
          <p><strong>Price:</strong> ₹{product.price}</p>
          <p><strong>Delivery Charge:</strong> ₹{deliveryCharge}</p>
          <p><strong>Total Price:</strong> ₹{totalPrice}</p>
        </div>

        <button className="proceed-to-order" onClick={handleProceedToOrder}>
          Proceed to Order
        </button>
      </div>
        </div>
      </div>

      {/* Footer Section */}
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
            <div className='col review'>
              <h3>Submit Your Review</h3>
              <form onSubmit={handleReviewSubmit}>
                <textarea
                  className='review-textarea'
                  name='description'
                  value={newReview.description}
                  onChange={handleReviewChange}
                  placeholder='Write your review here...'
                  required
                />
                <input
                  className='image-upload'
                  type='file'
                  name='image'
                  accept='image/*'
                  onChange={handleReviewChange}
                />
                <input
                  className='rating-input'
                  type='number'
                  name='rating'
                  value={newReview.rating}
                  onChange={handleReviewChange}
                  min='1'
                  max='5'
                  placeholder='Rating (1-5)'
                  required
                />
                <button type='submit'>Submit Review</button>
              </form>
            </div>
          </div>
          <div>
            <p className='copy'>© 2024 PetTreat</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default UserDetails;
