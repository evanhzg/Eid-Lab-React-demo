import React from 'react';
import '../styles/components/Card.css';
import { Icon } from '@iconify/react';
interface CardProps {
	title: string;
	children: React.ReactNode;
	className?: string;
}

const Card: React.FC<CardProps> = ({ className, title, children }) => {
	return (
		<div className={`${className} card`}>
			<h2 className='card-title'>
				<Icon icon='flat-color-icons:dvd-logo' /> {title}
			</h2>
			{children}
		</div>
	);
};

export default Card;
