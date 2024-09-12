import React, { useState, useEffect, createContext } from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
	Outlet,
	useLocation,
} from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Students from './pages/Students';
import Companies from './pages/Companies';
import Offers from './pages/Offers';
import Professionals from './pages/Professionals';
import Error404 from './pages/Error404';
import ProtectedRoute from './components/ProtectedRoute';
import AppSidebar from './components/AppSidebar';
import { AlertManager, AlertItem } from './components/AlertManager';
import './App.css';
import { Icon } from '@iconify/react/dist/iconify.js';

export const AlertContext = createContext<
	((message: string, type: AlertItem['type']) => void) | null
>(null);

const AppContent: React.FC<{
	theme: string;
	toggleTheme: () => void;
	testAlerts: () => void;
}> = ({ theme, toggleTheme, testAlerts }) => {
	const location = useLocation();
	const isAuthPage = location.pathname === '/auth';

	const getPageName = () => {
		const path = location.pathname.split('/')[1];
		return path.charAt(0).toUpperCase() + path.slice(1);
	};

	return (
		<div
			className='app-container'
			style={{ display: 'flex', height: '100vh' }}>
			{!isAuthPage && <AppSidebar />}
			<div style={{ flexGrow: 1, padding: '20px' }}>
				{!isAuthPage && (
					<div className='page-header'>
						<h1 className='page-title'>{getPageName()}</h1>
						<div className='app-buttons-group'>
							<button
								onClick={testAlerts}
								className='theme-button'>
								<Icon
									icon='line-md:bell-alert-filled-loop'
									style={{ fontSize: '1.5em' }}
									color='var(--warning-color)'
								/>
							</button>
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
								)}
							</button>
						</div>
					</div>
				)}
				<Outlet />
			</div>
		</div>
	);
};

const App: React.FC = () => {
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
				<Routes>
					<Route
						path='/auth'
						element={<AuthPage />}
					/>
					<Route element={<ProtectedRoute />}>
						<Route
							element={
								<AppContent
									theme={theme}
									toggleTheme={toggleTheme}
									testAlerts={testAlerts}
								/>
							}>
							<Route
								path='/'
								element={
									<Navigate
										to='/students'
										replace
									/>
								}
							/>
							<Route
								path='/students'
								element={<Students />}
							/>
							<Route
								path='/companies'
								element={<Companies />}
							/>
							<Route
								path='/offers'
								element={<Offers />}
							/>
							<Route
								path='/pros'
								element={<Professionals />}
							/>
						</Route>
					</Route>
					<Route
						path='*'
						element={<Error404 />}
					/>
				</Routes>
				<AlertManager setAddAlert={setAddAlert} />
			</Router>
		</AlertContext.Provider>
	);
};

export default App;
