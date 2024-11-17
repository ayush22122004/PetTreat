import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './card.css';

const Product = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState('');
  const [price, setPrice] = useState(0);
  const [mrp, setMrp] = useState(0);
  const [image, setImage] = useState('');
  const [quantity, setQuantity] = useState(1); // Initialize quantity state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/product_detail/${productId}/`);
        const productData = response.data;
        setProduct(productData);

        if (productData.size_options && productData.size_options.length > 0) {
          const defaultSize = productData.size_options[0];
          setSelectedWeight(defaultSize.weight);
          setPrice(defaultSize.price);
          setMrp(defaultSize.mrp);
          setImage(defaultSize.image);
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProduct();
  }, [productId]);

  // Increment quantity
  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1); // Updates quantity state
  };

  // Decrement quantity
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1); // Decreases quantity if greater than 1
    }
  };

  // Update weight, price, and other details on size change
  const handleWeightChange = (weight, price, mrp, image) => {
    setSelectedWeight(weight);
    setPrice(price);
    setMrp(mrp);
    setImage(image);
    setQuantity(1);  // Reset quantity to 1 when weight changes
  };

  const handleBuyNow = () => {
    navigate('/user-details', {
      state: {
        product: {
          description: product.description,
          weight: selectedWeight,
          price: price * quantity,  
          mrp,
          image,
          quantity, 
        },
      },
    });
  };

  if (!product) return <div>Loading...</div>;

  return (
    <>
      <div className="product-container">
        <div className="product-image">
          <img src={image} alt={product.description} />
        </div>

        <div className="product-details">
          <h1>{product.description}</h1>

          <div className="product-rating">
            <span>⭐⭐⭐⭐☆ {product.rating}</span>
          </div>

          <div className="product-deal">
            <div className="deal-price">
              <span className="price">₹{price * quantity}</span> {/* Adjust price dynamically */}
              <span className="mrp">MRP ₹{mrp}</span>
              <span className="save">SAVE {((mrp - price) / mrp * 100).toFixed(0)}%</span>
              <span className="per100g">
                ({((price * quantity) / parseFloat(selectedWeight)).toFixed(2)}/100g incl. of all taxes)
              </span>
            </div>
          </div>

          <div className="product-sizes">
            {product.size_options.map((size) => (
              <button
                key={size.weight}
                onClick={() => handleWeightChange(size.weight, size.price, size.mrp, size.image)}
                className={selectedWeight === size.weight ? 'active' : ''}
              >
                {size.weight}
              </button>
            ))}
          </div>

          {/* Quantity Controls */}
          <div className="quantity-controls">
            <button onClick={decrementQuantity} disabled={quantity <= 1}>-</button>
            <span>{quantity}</span>  {/* Display updated quantity */}
            <button onClick={incrementQuantity}>+</button>
          </div>

          <button className="buy" onClick={handleBuyNow}>Buy Now</button>
        </div>
      </div>
    </>
  );
};

export default Product;
