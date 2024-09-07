import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Students from './pages/Students';
import Error404 from './pages/Error404';
import AppSidebar from './components/AppSidebar';
import './App.css';
import { Icon } from '@iconify/react/dist/iconify.js';

const App = () => {
	const [theme, setTheme] = useState('light');

	useEffect(() => {
		const savedTheme = localStorage.getItem('theme') || 'light';
		setTheme(savedTheme);
		document.documentElement.setAttribute('data-theme', savedTheme);
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		setTheme(newTheme);
		document.documentElement.setAttribute('data-theme', newTheme);
		localStorage.setItem('theme', newTheme);
	};

	return (
		<Router>
			<div style={{ display: 'flex', height: '100vh' }}>
				<AppSidebar />
				<div style={{ flexGrow: 1, padding: '20px' }}>
					<button
						onClick={toggleTheme}
						style={{ marginBottom: '20px' }}>
						{theme === 'light' ? (
							<Icon
								icon='line-md:moon-filled-alt-to-sunny-filled-loop-transition'
								style={{ fontSize: '1.5em' }}
								color='var(--highlight-color)'
							/>
						) : (
							<Icon
								icon='line-md:moon-rising-filled-loop'
								style={{ fontSize: '1.5em' }}
								color='var(--info-color)'
							/>
						)}{' '}
					</button>
					<Routes>
						<Route
							path='/'
							element={<Error404 />}
						/>
						<Route
							path='/tables'
							element={<Error404 />}
						/>
						<Route
							path='/students'
							element={<Students />}
						/>
					</Routes>
				</div>
			</div>
		</Router>
	);
};

export default App;
