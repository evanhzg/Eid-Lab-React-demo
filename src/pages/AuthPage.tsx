import React, { useState, useEffect } from 'react';
import {
	TextField,
	Button,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Typography,
	Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import axios from 'axios';
import api from '../utils/api';

const AuthPage: React.FC = () => {
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [userType, setUserType] = useState('');
	const [error, setError] = useState('');

	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthenticated()) {
			navigate('/dashboard');
		}
	}, [navigate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		try {
			if (isLogin) {
				const response = await api.post('/auth/login', { email, password });
				console.log('Login response:', response);
				console.log('Login response headers:', response.headers);
				console.log('Cookies after login:', document.cookie);
				localStorage.setItem('userRole', response.data.role);
				localStorage.setItem('token', response.data.token); // Store the token in localStorage as well
				navigate('/students');
			} else {
				// Sign up
				if (password !== confirmPassword) {
					setError('Passwords do not match');
					return;
				}
				const response = await api.post('/auth/register', {
					email,
					password,
					confirmPassword,
					role: userType,
				});
				// The token is now handled by the cookie, so we don't need to store it
				localStorage.setItem('userRole', response.data.role);
				localStorage.setItem('token', response.data.token); // Store the token
				navigate('/dashboard'); // Redirect to dashboard or appropriate page
			}
		} catch (error) {
			console.error('Auth error:', error);
			if (axios.isAxiosError(error) && error.response) {
				setError(error.response.data.message || 'Authentication failed');
			} else {
				setError('An unexpected error occurred');
			}
		}
	};

	return (
		<Box sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
			<Typography
				variant='h4'
				gutterBottom>
				{isLogin ? 'Login' : 'Sign Up'}
			</Typography>
			<form onSubmit={handleSubmit}>
				<TextField
					fullWidth
					label='Email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					margin='normal'
					required
				/>
				<TextField
					fullWidth
					label='Password'
					type='password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					margin='normal'
					required
				/>
				{!isLogin && (
					<>
						<TextField
							fullWidth
							label='Confirm Password'
							type='password'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							margin='normal'
							required
						/>
						<FormControl
							fullWidth
							margin='normal'
							required>
							<InputLabel>User Type</InputLabel>
							<Select
								value={userType}
								onChange={(e) => setUserType(e.target.value)}>
								<MenuItem value='student'>Student</MenuItem>
								<MenuItem value='professional'>Professional</MenuItem>
								<MenuItem value='admin'>Admin</MenuItem>
							</Select>
						</FormControl>
					</>
				)}
				{error && <Typography color='error'>{error}</Typography>}
				<Button
					type='submit'
					variant='contained'
					color='primary'
					fullWidth
					sx={{ mt: 2 }}>
					{isLogin ? 'Login' : 'Sign Up'}
				</Button>
			</form>
			<Button
				onClick={() => setIsLogin(!isLogin)}
				sx={{ mt: 2 }}>
				{isLogin
					? 'Need an account? Sign Up'
					: 'Already have an account? Login'}
			</Button>
		</Box>
	);
};

export default AuthPage;
