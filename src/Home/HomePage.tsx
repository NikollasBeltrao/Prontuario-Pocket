import React, { ChangeEvent, useState } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import { BsArrowLeftShort, BsPlus } from 'react-icons/bs';
import Login from '../Login/LoginPage';

const Home: React.FC = (props) => {
    return(
        <div className="container">
            <div className="home-container">
                <Login/>
            </div>
        </div>
    );
}
export default Home;