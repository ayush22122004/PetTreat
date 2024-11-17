import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './Home.css';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'bootstrap/dist/css/bootstrap.min.css';;
function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate();
  const handleCart = () => {
    navigate('/Cart');
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  const handleShowDetails = () => {
    navigate('/Profile');  // Navigate to the user details page
  };
  const [footerData, setFooterData] = useState(null);
  const [navbarData, setNavbarData] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [categories, setCategories] = useState([]);
  const [homeCarouselImages, setHomeCarouselImages] = useState([]);
  const [buyPetsCarouselImages, setBuyPetsCarouselImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ description: '', image: null, rating: 0 });


  useEffect(() => {
    // Fetch categories from Django backend
    axios.get('http://127.0.0.1:8000/api/categories/')
      .then(response => {
        setCategories(response.data);
        console.log(response.data)
      })
      .catch(error => console.error('Error fetching categories:', error));

    // Fetch carousel images from Django backend
    axios.get('http://127.0.0.1:8000/api/carousel_images/?carousel_type=home')
      .then(response => {
        setHomeCarouselImages(response.data);
      })
      .catch(error => console.error('Error fetching home carousel images:', error));

    // Fetch buy pets carousel images
    axios.get('http://127.0.0.1:8000/api/carousel_images/?carousel_type=buy_pets')
      .then(response => {
        setBuyPetsCarouselImages(response.data);
      })
      .catch(error => console.error('Error fetching buy pets carousel images:', error));
    axios.get('http://127.0.0.1:8000/api/review_images/')
      .then(response => {
        setReviews(response.data);
      })
      .catch(error => console.error('Error fetching reviews:', error));
  }, []);


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
  useEffect(() => {
    const fetchNavbarData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/navbar/');
        setNavbarData(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching navbar data:', error);
      }
    };

    fetchNavbarData();
  }, []);

  if (!footerData) {
    return <div>Loading...</div>;
  }
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    if (name === 'image') {
      setNewReview({ ...newReview, image: e.target.files[0] });
    } else {
      setNewReview({ ...newReview, [name]: value });
    }
  };
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

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1
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
            {/* <div className='cart' onClick={handleCart}>
              <img src={navbarData.cart_logo} alt='Cart' />
            </div> */}

            <div className='menu-icon' onClick={() => setIsMobile(!isMobile)}>
              <img src='/path/to/menu-icon.png' alt='Menu' />
            </div>

            <div onClick={handleShowDetails} className='profile'>
              <img src={navbarData.profile_logo} alt='Cart' />
            </div>
          </>
        )}
      </div>

      {/* Updated Carousel with dynamic images */}
      <Carousel>
        {homeCarouselImages.map((item) => (
          <Carousel.Item key={item.id}>
            <img
              className="d-block w-100"
              src={`${item.image}`}
              alt={`Slide ${item.id}`}
            />
          </Carousel.Item>
        ))}
      </Carousel>

      <div className='categories'>
        <h1>Popular Categories</h1>
      </div>

      <div className='row'>
        {categories.map(category => (
          <div key={category.id} className='col card'>
            <Link to={`/${category.name.replace(' ', '')}`}>
              <img src={`${category.image}`} alt={category.name} />
              <div>
                <h1 className='labels'>{category.name}</h1>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className='categories'>
        <h1>Buy Pets</h1>
      </div>

      <div>
        <Carousel>
          {buyPetsCarouselImages.map((item) => (
            <Carousel.Item key={item.id}>
              <img
                className="d-block w-100"
                src={`${item.image}`}
                alt={`Slide ${item.id}`}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      <div className='categories'>
        <h1>Happy Customers</h1>
      </div>
      <div className='review-div'>
        <Slider {...settings}>
          {reviews.map((review) => (
            <div key={review.id} className='card-container'>
              <div className='image-container'>
                <img src={review.image} alt='' />
              </div>
              <div className='card-content'>
                <div className='card-body'>
                  <p className='carddes'>{review.description}</p>
                  <p className='cardrate'>{'⭐'.repeat(review.rating)}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
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
}

export default Home;
