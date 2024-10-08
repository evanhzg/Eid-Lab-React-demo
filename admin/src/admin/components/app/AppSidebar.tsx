import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react/dist/iconify.js';
import '../../../shared/styles/ui/Sidebar.css';
import unpawsLogo from '../../../shared/assets/unpaws-logo-yellow.png';
import { logout } from '../../../services/auth';

const AppSidebar: React.FC = () => {
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate('/auth');
	};

	return (
		<nav className='sidebar'>
			<div className='sidebar-header'>
				<div className='sidebar-logo-title'>
					<img
						src={unpawsLogo}
						alt='Unpaws Logo'
						className='sidebar-logo'
					/>
					<h1 className='sidebar-title'>unpaws</h1>
					<p className='sidebar-title-complement'>ADMIN</p>
				</div>
			</div>
			<ul className='sidebar-menu'>
				<li>
					<NavLink
						to='/'
						className={({ isActive }) => (isActive ? 'active' : '')}>
						<Icon icon='tabler:dashboard-filled' />
						<p>Dashboard</p>
					</NavLink>
				</li>
				<li>
					<NavLink
						to='/students'
						className={({ isActive }) => (isActive ? 'active' : '')}>
						<Icon icon='ic:round-school' />
						<p>Students</p>
					</NavLink>
				</li>
				<li>
					<NavLink
						to='/companies'
						className={({ isActive }) => (isActive ? 'active' : '')}>
						<Icon icon='material-symbols:enterprise' />
						<p>Companies</p>
					</NavLink>
				</li>
				<li>
					<NavLink
						to='/pros'
						className={({ isActive }) => (isActive ? 'active' : '')}>
						<Icon icon='mdi:tie' />
						<p>Professionals</p>
					</NavLink>
				</li>
				<li>
					<NavLink
						to='/offers'
						className={({ isActive }) => (isActive ? 'active' : '')}>
						<Icon icon='mingcute:paper-fill' />
						<p>Offers</p>
					</NavLink>
				</li>
				<li>
					<NavLink
						to='/error404'
						className={({ isActive }) => (isActive ? 'active' : '')}>
						<Icon icon='material-symbols:error' />
						<p>404 Page</p>
					</NavLink>
				</li>
				<li>
					<button
						onClick={handleLogout}
						className='logout-button'>
						<Icon icon='mdi:logout' />
						<p>Logout</p>
					</button>
				</li>
			</ul>
		</nav>
	);
};

export default AppSidebar;
