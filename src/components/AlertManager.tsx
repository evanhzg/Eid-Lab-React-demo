import React, { useState, useEffect, useCallback } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { Icon } from '@iconify/react';

export interface AlertItem {
	id: number;
	message: string;
	type: 'error' | 'success' | 'info' | 'warning';
	closing?: boolean;
}

interface AlertManagerProps {
	setAddAlert: React.Dispatch<
		React.SetStateAction<
			((message: string, type: AlertItem['type']) => void) | null
		>
	>;
}

const AlertManager: React.FC<AlertManagerProps> = ({ setAddAlert }) => {
	const [alerts, setAlerts] = useState<AlertItem[]>([]);

	const addAlert = useCallback((message: string, type: AlertItem['type']) => {
		setAlerts((prevAlerts) => [
			...prevAlerts,
			{ id: Date.now(), message, type },
		]);
	}, []);

	useEffect(() => {
		setAddAlert(() => addAlert);
	}, [addAlert, setAddAlert]);

	useEffect(() => {
		const timer = setInterval(() => {
			setAlerts((prevAlerts) => {
				if (prevAlerts.length > 0) {
					const [firstAlert, ...rest] = prevAlerts;
					return [{ ...firstAlert, closing: true }, ...rest];
				}
				return prevAlerts;
			});
		}, 4000);

		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		const closingAlerts = alerts.filter((alert) => alert.closing);
		if (closingAlerts.length > 0) {
			const timer = setTimeout(() => {
				setAlerts((prevAlerts) => prevAlerts.filter((alert) => !alert.closing));
			}, 300);
			return () => clearTimeout(timer);
		}
	}, [alerts]);

	const removeAlert = (id: number) => {
		setAlerts((prevAlerts) =>
			prevAlerts.map((alert) =>
				alert.id === id ? { ...alert, closing: true } : alert
			)
		);
	};

	const getAlertColor = (type: AlertItem['type']) => {
		switch (type) {
			case 'error':
				return 'var(--error-color)';
			case 'success':
				return 'var(--success-color)';
			case 'info':
				return 'var(--info-color)';
			case 'warning':
				return 'var(--warning-color)';
			default:
				return 'var(--secondary-color)';
		}
	};

	return (
		<>
			{alerts.map((alert, index) => (
				<Snackbar
					key={alert.id}
					open={true}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
					style={{ bottom: `${index * 60 + 16}px` }}>
					<Alert
						severity={alert.type}
						className={`custom-alert ${alert.closing ? 'closing' : ''}`}
						style={
							{
								'--alert-bg-color': getAlertColor(alert.type),
							} as React.CSSProperties
						}
						action={
							<button
								className='close-button'
								onClick={() => removeAlert(alert.id)}>
								<Icon icon='mingcute:close-fill' />
							</button>
						}>
						{alert.message}
					</Alert>
				</Snackbar>
			))}
		</>
	);
};

export { AlertManager };
