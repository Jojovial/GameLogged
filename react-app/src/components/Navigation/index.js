import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);

	return (
		<ul className="nav-links">
			<li className="nav-home-link">
				<NavLink exact to="/">GameLogged</NavLink>
			</li>
			{isLoaded && (
				<li className="nav-profile-button">
					<ProfileButton user={sessionUser} />
				</li>
			)}
		</ul>
	);
}

export default Navigation;
