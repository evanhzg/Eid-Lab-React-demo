import React, { useState, useRef, useEffect } from 'react';
import '../../styles/ui/Tooltip.css';

interface TooltipProps {
	children: React.ReactNode;
	content: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
	const [isVisible, setIsVisible] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const tooltipRef = useRef<HTMLDivElement>(null);

	const handleMouseMove = (e: React.MouseEvent) => {
		if (tooltipRef.current) {
			const rect = tooltipRef.current.getBoundingClientRect();
			setPosition({
				x: e.clientX - rect.width / 2,
				y: e.clientY - rect.height - 10, // 10px above the cursor
			});
		}
	};

	useEffect(() => {
		if (isVisible) {
			document.addEventListener('mousemove', handleMouseMove as any);
		}
		return () => {
			document.removeEventListener('mousemove', handleMouseMove as any);
		};
	}, [isVisible]);

	return (
		<div
			className='tooltip-container'
			onMouseEnter={() => setIsVisible(true)}
			onMouseLeave={() => setIsVisible(false)}>
			{children}
			{isVisible && (
				<div
					className='tooltip'
					ref={tooltipRef}
					style={{
						left: `${position.x}px`,
						top: `${position.y}px`,
						position: 'fixed',
					}}>
					{content}
				</div>
			)}
		</div>
	);
};

export default Tooltip;
