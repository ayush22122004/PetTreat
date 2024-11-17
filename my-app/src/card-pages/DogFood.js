import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProductCard.css';

function DogFood() {
    const [products, setProducts] = useState([]); // State to store products
    const [isMobile, setIsMobile] = useState(false);
    const [navbarData, setNavbarData] = useState(null);
    const navigate = useNavigate();

    // Fetch products from the Django API
    useEffect(() => {
        axios.get('http://localhost:8000/api/card_images/')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching category data:', error);
            });
    }, []);
    useEffect(() => {
        const fetchNavbarData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/navbar/');
                setNavbarData(response.data);
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching footer data:', error);
            }
        };

        fetchNavbarData();
    }, []);
    const handleCardClick = (id) => {
        console.log("Navigating to product with ID:", id); // Debugging statement
        navigate(`/card1/${id}`);
    };
    const handleShowDetails = () => {
        navigate('/Profile');  // Navigate to the user details page
    };
    const [footerData, setFooterData] = useState(null);
    const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ description: '', image: null, rating: 0 });

    useEffect(() => {
        const fetchFooterData = async () => {
          try {
            const response = await axios.get('http://127.0.0.1:8000/api/footer/');
            setFooterData(response.data);
            console.log(response.data)
          } catch (error) {
            console.error('Error fetching footer data:', error);
          }
        };
    
        fetchFooterData();
      }, []);
      if (!footerData) {
        return <div>Loading...</div>;
      }
      const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('description', newReview.description);
        formData.append('image', newReview.image);
        formData.append('rating', newReview.rating);
    
        try {
          // Send the review to the backend
          const response = await axios.post('http://127.0.0.1:8000/api/reviews/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    
          // Add the newly submitted review to the existing reviews state
          setReviews([...reviews, response.data]);
    
          // Reset the form
          setNewReview({ description: '', image: null, rating: 0 });
          alert('Thank you to rate us!')
        } catch (error) {
          console.error('Error submitting review:', error);
        }
      };
      const handleReviewChange = (e) => {
        const { name, value } = e.target;
        if (name === 'image') {
          setNewReview({ ...newReview, image: e.target.files[0] });
        } else {
          setNewReview({ ...newReview, [name]: value });
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

            <div className="row">
                {products.map(product => (
                    <div className="col-md-3" key={product.id}>
                        <div className="card product-card" onClick={() => handleCardClick(product.id)}>
                            <img
                                src={product.image}  // Dynamically fetched image URL
                                className="card-img-top p-3"
                                alt={product.name}
                            />
                            <div className="card-body">
                                <h6 className="card-title text-center text-warning">{product.name}</h6>
                                <h5 className="card-title">{product.description}</h5>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="text-danger price">₹{product.price}</span>
                                    <small className="text-muted mrp">MRP ₹{product.mrp}</small>
                                    <span className="badge bg-success text-white">{product.discount}% OFF</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
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
)}

        </>
    );
}

export default DogFood;
