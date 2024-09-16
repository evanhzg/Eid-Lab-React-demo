//In order : Header with logo+name - nav - login/register || userMenu/logout
// It is a job board (nav will have links to jobs, companies, blog, about etc)
// Header is fixed on top, logo is on the left, nav is on the center, login/register is on the right
// When the user is logged in, the login/register button is replaced by userMenu/logout button
// UserMenu is a dropdown menu that appears when the user clicks on the user icon
// It has links to the user's profile, their listings, their applications, and their settings
// background color is light-color, text is dark-color, nav is capitalize
// hover changes color
// font is kanit
// logo is a paw Icon from iconify
// name is "unpaws"
// nav is "Find A Job", "Companies", "Blog", "About", "Contact"
// login/register is "Login", "Signup"
// userMenu/logout is a circle icon with a paw print, "Logout"

import { Icon } from '@iconify/react/dist/iconify.js';
import { useState } from 'react';
import '../styles/components/Header.css';
import Button from './Button';
const Header = () => {
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

	return (
		<header>
			<div className='header-logo'>
				<Icon icon='mdi:paw' />
				<h1>unpaws</h1>
			</div>
			<nav>
				<ul>
					<li>Find A Job</li>
					<li>Companies</li>
					<li>Blog</li>
					<li>About</li>
					<li>Contact</li>
				</ul>
			</nav>
			<div className='header-actions'>
				<Button>Login</Button>
				<Button>Register</Button>
			</div>
		</header>
	);
};

export default Header;
