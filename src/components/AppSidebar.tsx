import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/sidebar.css';
import { Icon } from '@iconify/react/dist/iconify.js';

const AppSidebar: React.FC = () => {
	return (
		<nav className='sidebar'>
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
			</ul>
		</nav>
	);
};

export default AppSidebar;
