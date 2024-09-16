import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import '../styles/pages/Error404.css';

const Error404: React.FC = () => {
	const navigate = useNavigate();

	return (
		<Box className='error-404-container'>
			<img
				src='/unpaws-logo.png'
				alt='Unpaws Logo'
				className='error-404-logo'
			/>
			<h2 className='error-404-title'>404: Page Not Found</h2>
			<p className='error-404-subtitle'>
				Oops! Looks like this page has gone for a walk.
			</p>
			<button
				className='error-404-button'
				onClick={() => navigate('/')}>
				find a new home
			</button>
		</Box>
	);
};

export default Error404;
