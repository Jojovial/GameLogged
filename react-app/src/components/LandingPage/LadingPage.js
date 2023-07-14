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
        <div>
            <div className="landing-nav">
                <div className='logo-container'></div>
                <div className='credentials'>
                    <div className='landing-login' onClick={login}>
                        Log In
                    </div>
                    <div className='landing-signup' onClick={signUp}>
                        Sign Up Gamer!
                    </div>
                </div>
            </div>
            <div className='landing-body-container'>
                <div className='landing-wrapper'>
                    <div className='landing-body'>
                        <h2 className='landing-header'>Idk what to put here yet</h2>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default LandingPage;
