import { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Students from './pages/Students';
import Companies from './pages/Companies';
import Error404 from './pages/Error404';
import AppSidebar from './components/AppSidebar';
import './App.css';
import { Icon } from '@iconify/react/dist/iconify.js';
import { AlertManager, AlertItem } from './components/AlertManager';

export const AlertContext = createContext<
	((message: string, type: AlertItem['type']) => void) | null
>(null);

const App = () => {
	const [theme, setTheme] = useState('dark');
	const [addAlert, setAddAlert] = useState<
		((message: string, type: AlertItem['type']) => void) | null
	>(null);

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

	const testAlerts = () => {
		addAlert?.("Alerte d'erreur", 'error');
		setTimeout(() => addAlert?.('Alerte de confirmation', 'success'), 1000);
		setTimeout(() => addAlert?.("Alerte d'information", 'info'), 2000);
		setTimeout(() => addAlert?.("Alerte d'avertissement", 'warning'), 3000);
	};

	return (
		<AlertContext.Provider value={addAlert}>
			<Router>
				<div
					className='app-container'
					style={{ display: 'flex', height: '100vh' }}>
					<AppSidebar />
					<div style={{ flexGrow: 1, padding: '20px' }}>
						<div className='app-buttons-group'>
							<button
								onClick={toggleTheme}
								className='theme-button'>
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
							<button
								onClick={testAlerts}
								className='theme-button'>
								<Icon
									icon='line-md:bell-alert-filled-loop'
									style={{ fontSize: '1.5em' }}
									color='var(--warning-color)'
								/>
							</button>
						</div>
						<Routes>
							<Route
								path='/'
								element={<Error404 />}
							/>
							<Route
								path='/students'
								element={<Students />}
							/>
							<Route
								path='/companies'
								element={<Companies />}
							/>
						</Routes>
					</div>
					<AlertManager setAddAlert={setAddAlert} />
				</div>
			</Router>
		</AlertContext.Provider>
	);
};

export default App;
