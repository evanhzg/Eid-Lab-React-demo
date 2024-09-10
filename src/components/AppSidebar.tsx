import React from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const AppSidebar: React.FC = () => {
	const navigate = useNavigate();

	return (
		<Sidebar style={{ height: '100vh' }}>
			<Menu iconShape='square'>
				<MenuItem onClick={() => navigate('/')}>Dash</MenuItem>
				<MenuItem onClick={() => navigate('/students')}>Students</MenuItem>
				<MenuItem onClick={() => navigate('/companies')}>Companies</MenuItem>
				<MenuItem onClick={() => navigate('/offers')}>Offers</MenuItem>
				<MenuItem onClick={() => navigate('/error404')}>404 Page</MenuItem>
			</Menu>
		</Sidebar>
	);
};

export default AppSidebar;
