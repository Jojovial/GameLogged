import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Home.css';


const Home = () => {
    const dispatch = useDispatch();

    return (
        <div className="home-container">
            <h2>Home</h2>
            <div className="home-wrapper">
                <div className="home-entries">
                    <h2>Entry Stuff Goes Here</h2>
                </div>
                <div className="home-memory-card">
                    <h2>Memory-Card Stuf Goes Here</h2>
                </div>
                <div className="home-dialogue-box">
                    <h2>Dialogue Box Stuff Goes Here</h2>
                </div>
            </div>
        </div>
    )
};

export default Home;
