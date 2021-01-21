import React from 'react';
import './Home.css';
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