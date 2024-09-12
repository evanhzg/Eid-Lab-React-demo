import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { checkAuthStatus } from '../utils/auth';

const ProtectedRoute: React.FC = () => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

	useEffect(() => {
		const checkAuth = async () => {
			const authStatus = await checkAuthStatus();
			setIsAuthenticated(authStatus);
		};
		checkAuth();
	}, []);

	if (isAuthenticated === null) {
		// Still checking authentication status
		return <div>Loading...</div>;
	}

	return isAuthenticated ? (
		<Outlet />
	) : (
		<Navigate
			to='/auth'
			replace
		/>
	);
};

export default ProtectedRoute;
