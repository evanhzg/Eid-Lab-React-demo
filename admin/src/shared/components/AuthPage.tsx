import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../services/auth';
import api from '../../services/api';
import { APP_NAME } from '../../config';
import Input from './ui/Input';
import Select from './ui/Select';
import '../styles/Auth.css';

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

	const userTypeOptions = [
		{ value: 'student', label: 'Student' },
		{ value: 'professional', label: 'Professional' },
		{ value: 'admin', label: 'Admin' },
	];

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		try {
			if (isLogin) {
				const response = await api.post('/auth/login', { email, password });
				localStorage.setItem('userRole', response.data.role);
				navigate('/students');
			} else {
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
				localStorage.setItem('userRole', response.data.role);
				navigate('/dashboard');
			}
		} catch (error: any) {
			console.error('Auth error:', error);
			setError(error.response?.data?.message || 'Authentication failed');
		}
	};

	return (
		<Box className='auth-container'>
			<Paper className='auth-paper'>
				<img
					src='/unpaws-logo.png'
					alt='Unpaws Logo'
					className='auth-logo'
				/>
				<Typography
					variant='h4'
					component='h1'
					gutterBottom
					className='auth-title'>
					{APP_NAME}
				</Typography>
				<form
					onSubmit={handleSubmit}
					className='auth-form'>
					<Input
						label='Email'
						type='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<Input
						label='Password'
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					{!isLogin && (
						<>
							<Input
								label='Confirm Password'
								type='password'
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
							/>
							<Select
								label='User Type'
								value={userType}
								onChange={(e) => setUserType(e.target.value)}
								options={userTypeOptions}
								required
							/>
						</>
					)}
					{error && (
						<Typography
							color='error'
							className='auth-error'>
							{error}
						</Typography>
					)}
					<Button
						type='submit'
						variant='contained'
						color='primary'
						fullWidth
						className='auth-submit-button'>
						{isLogin ? 'Login' : 'Sign Up'}
					</Button>
				</form>
				<Button
					onClick={() => setIsLogin(!isLogin)}
					className='auth-toggle-button'>
					{isLogin
						? 'Need an account? Sign Up'
						: 'Already have an account? Login'}
				</Button>
			</Paper>
		</Box>
	);
};

export default AuthPage;
