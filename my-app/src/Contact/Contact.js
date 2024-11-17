import React, { useState, useEffect } from 'react';
import './contact.css'
import axios from 'axios';
function Contact(){
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
    return(
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
    )
}
export default Contact