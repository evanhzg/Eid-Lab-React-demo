import React, { useState, useEffect } from 'react';
import '../styles/components/Sparkles.css';

const Sparkle = ({ style }: { style: React.CSSProperties }) => (
	<svg
		width='10'
		height='10'
		viewBox='0 0 10 10'
		style={style}>
		<path
			d='M5 0L6.12 3.88L10 5L6.12 6.12L5 10L3.88 6.12L0 5L3.88 3.88L5 0Z'
			fill='var(--brand-color)'
		/>
	</svg>
);

const Sparkles: React.FC<{ isHovered: boolean }> = ({ isHovered }) => {
	const [sparkles, setSparkles] = useState<React.CSSProperties[]>([]);

	useEffect(() => {
		let intervalId: NodeJS.Timeout;

		if (isHovered) {
			intervalId = setInterval(() => {
				setSparkles((prevSparkles) => [
					...prevSparkles,
					{
						left: `${Math.random() * 100}%`,
						top: '-10px',
						animationDuration: `${Math.random() * 2 + 3}s`, // Slower animation
						animationDelay: `${Math.random() * 0.5}s`,
						opacity: Math.random() * 0.5 + 0.5,
					},
				]);
			}, 200); // Adjust interval for sparkle generation rate
		} else {
			setSparkles([]);
		}

		return () => {
			if (intervalId) clearInterval(intervalId);
		};
	}, [isHovered]);

	return (
		<div className='sparkles-container'>
			{sparkles.map((style, index) => (
				<Sparkle
					key={index}
					style={style}
				/>
			))}
		</div>
	);
};

export default Sparkles;
