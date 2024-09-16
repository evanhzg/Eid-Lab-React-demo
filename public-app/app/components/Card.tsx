import React from 'react';
import '../styles/components/Card.css';

interface CardProps {
	className?: string;
	title: string;
	children: React.ReactNode;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
}

const Card: React.FC<CardProps> = ({
	className,
	title,
	children,
	onMouseEnter,
	onMouseLeave,
}) => {
	return (
		<div
			className={`card ${className || ''}`}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}>
			<h2 className='card-title'>{title}</h2>
			{children}
		</div>
	);
};

export default Card;
