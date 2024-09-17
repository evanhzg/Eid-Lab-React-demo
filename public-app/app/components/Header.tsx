'use client';

import { Icon } from '@iconify/react/dist/iconify.js';
import { useState } from 'react';
import '../styles/components/Header.css';
import { UserButton } from './Button';
import Link from 'next/link';

const Header = ({ className }: { className?: string }) => {
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

	return (
		<header className={className}>
			<Link
				href='/'
				className='header-logo'>
				<Icon icon='mdi:paw' />
				<h1>unpaws</h1>
			</Link>
			<nav>
				<ul>
					<li>
						<Link href='/offers'>Find A Job</Link>
					</li>
					<li>Companies</li>
					<li>Blog</li>
					<li>About</li>
					<li>Contact</li>
				</ul>
			</nav>
			<div className='header-actions'>
				<UserButton className='no-account'>SignUp</UserButton>
				<UserButton className='has-account'>Login</UserButton>
			</div>
		</header>
	);
};

export default Header;
