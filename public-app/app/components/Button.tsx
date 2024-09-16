import React from 'react';
import '../styles/components/Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
	return (
		<button
			className='custom-button'
			{...props}>
			{children}
		</button>
	);
};

const SendButton: React.FC<ButtonProps> = ({ children, ...props }) => {
	return (
		<button
			type='submit'
			className='custom-button'
			{...props}>
			{children}
		</button>
	);
};

export { Button, SendButton };
export default Button;
