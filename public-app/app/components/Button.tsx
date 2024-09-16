import React from 'react';
import '../styles/components/Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
	return (
		<button
			className={`custom-button ${className || ''}`}
			{...props}>
			{children}
		</button>
	);
};

const SendButton: React.FC<ButtonProps> = ({
	children,
	className,
	...props
}) => {
	return (
		<button
			type='submit'
			className={`custom-button ${className || ''}`}
			{...props}>
			{children}
		</button>
	);
};

export { Button, SendButton };
export default Button;
