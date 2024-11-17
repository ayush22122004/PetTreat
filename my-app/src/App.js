import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home/Home.js';
import DogFood from './card-pages/DogFood.js';
import CatFood from './card-pages/CatFood.js';
import DogTreat from './card-pages/DogTreat.js';
import CatTreat from './card-pages/CatTreat.js';
import Toys from './card-pages/Toys.js';
import Card1 from './after-card/card1';
import Del from './delivery/Del.js'
import Thankyou from './thankyou/Thankyou.js'
// import Signup from './Login/FormComponent.js'
import Login from './Login/LoginForm.js'
import Cart from './after-card/Cart.js';
import UserDetails from './Home/UserDetails.js';
import Profile from './profile/Profile.js'
import Signup from './Login/FormComponent.js'
import Contact from './Contact/Contact.js'
function App() {
    return (
        <>
        <Router>
            <Routes>

                <Route path="/" element={<Login />}/>
                <Route path="/Signup" element={<Signup />} /> 
                <Route path="/Home" element={<Home />}/>
                <Route path="/DogFood" element={<DogFood />} />
                <Route path="/CatFood" element={<CatFood />} />
                <Route path="/DogTreat" element={<DogTreat />} />
                <Route path="/CatTreat" element={<CatTreat />} />
                <Route path="/Toys" element={<Toys />} />
                <Route path="/card1/:productId" element={<Card1 />} />
                <Route path="/Del" element={<Del />} />
                <Route path="/Thankyou" element={<Thankyou />} />
                <Route path="/Cart" element={<Cart />} />
                <Route path="/user-details" element={<UserDetails />} />
                <Route path="/Profile" element={<Profile />} />
                <Route path="/Contact" element={<Contact />} />
            </Routes>
        </Router>
        </>
    );
}

export default App;
