import React from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { NavLink } from 'react-router-dom';

const AppSidebar: React.FC = () => {
	return (
		<Sidebar style={{ height: '100vh' }}>
			<Menu iconShape='square'>
				<MenuItem>
					<NavLink to='/'>Dashboard</NavLink>
				</MenuItem>
				<MenuItem>
					<NavLink to='/tables'>Tables</NavLink>
				</MenuItem>
				<MenuItem>
					<NavLink to='/profile'>Profile</NavLink>
				</MenuItem>
				<MenuItem>
					<NavLink to='/analytics'>Analytics</NavLink>
				</MenuItem>
				<MenuItem>
					<NavLink to='/error404'>404 Page</NavLink>
				</MenuItem>
			</Menu>
		</Sidebar>
	);
};

export default AppSidebar;
