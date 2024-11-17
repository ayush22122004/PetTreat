import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './thankyou.css';

const ThankYou = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(33); // Starting from warehouse (33%)

  useEffect(() => {
    const handleBackButton = (e) => {
      e.preventDefault();
      navigate('/Home');
    };

    window.history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', handleBackButton);

    // Simulate order progress (e.g., after placing order, it moves through stages)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) return prev + 33; // Increment progress (adjust time for realism)
        clearInterval(progressInterval);
        return prev;
      });
    }, 2000); // Change state every 2 seconds (adjust as needed)

    return () => {
      window.removeEventListener('popstate', handleBackButton);
      clearInterval(progressInterval);
    };
  }, [navigate]);

  const backHome = () => {
    navigate('/Home');
  };

  return (
    <div className="thank-you-container">
      <h1>Thank You for Your Order!</h1>
      <p>Your order has been placed successfully.</p>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        <div className="progress-icons">
          <span className={`icon ${progress >= 33 ? 'active' : ''}`}>🏡</span>
          <span className={`icon ${progress >= 66 ? 'active' : ''}`}>🐕</span>
          <span className={`icon ${progress >= 100 ? 'active' : ''}`}>🏭</span>
        </div>
      </div>

      <button className="back-home-button" onClick={backHome}>
        Back To Home
      </button>
    </div>
  );
};

export default ThankYou;
