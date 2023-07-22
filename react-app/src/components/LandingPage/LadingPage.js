import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import "./LandingPage.css";


const LandingPage = () => {
    const currentUser = useSelector((state) => state.session.user);
    const history = useHistory();

    if (currentUser) {
        history.push('/home');
    };

    const login = () => {
        history.push('/login');
    };

    const signUp = () => {
        history.push('/signup');
    };

    return (
        <div className="landing-page">
            <div className="landing-nav">
            <div className='landing-body-container'>
                <div className='landing-wrapper'>
                    <div className='landing-body'>
                        <h2 className='landing-header'>Video Game Hoarder? You've come to the right place!</h2>
                    </div>
                    <h3 className='landing-pitch'>Tired of not being able to keep track of all the games you want to play? Well you can keep track of them here!</h3>
                </div>
            </div>
                <div className='logo-container'></div>
                <div className='credentials'>
                    <div className='landing-login' onClick={login}>
                        <h2 className='landing-login-text'>Log in</h2>
                    </div>
                    <div className='landing-signup' onClick={signUp}>
                        <h2 className='landing-signup-text'>Sign Up Gamer!</h2>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default LandingPage;
