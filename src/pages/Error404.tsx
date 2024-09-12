import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';
import { Icon } from '@iconify/react';
import '../styles/error404.css';

const Error404: React.FC = () => {
	const navigate = useNavigate();

	return (
		<Box className='error-404-container'>
			<Icon
				icon='mdi:paw-off'
				className='error-404-icon'
			/>
			<h2 className='error-404-title'>404: Page Not Found</h2>
			<p className='error-404-subtitle'>
				Oops! Looks like this page has gone for a walk.
			</p>
		</Box>
	);
};

export default Error404;
