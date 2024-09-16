import React, { useState, useRef } from 'react';
import '../styles/ui/Tooltip.css';

interface TooltipProps {
	content: React.ReactNode;
	children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
	const [isVisible, setIsVisible] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const containerRef = useRef<HTMLDivElement>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);

	const handleMouseMove = (e: React.MouseEvent) => {
		if (containerRef.current && tooltipRef.current) {
			const rect = containerRef.current.getBoundingClientRect();
			const tooltipRect = tooltipRef.current.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			const tooltipStyle = window.getComputedStyle(tooltipRef.current);
			const paddingLeft = parseFloat(tooltipStyle.paddingLeft);
			const paddingRight = parseFloat(tooltipStyle.paddingRight);
			const tooltipWidth = tooltipRect.width + paddingLeft + paddingRight;

			const rightSpace = window.innerWidth - (rect.left + x + tooltipWidth);
			const xPos = rightSpace < 0 ? x - tooltipWidth : x;

			setPosition({ x: xPos, y });
		}
		setIsVisible(true);
	};

	return (
		<div
			ref={containerRef}
			className='tooltip-container'
			onMouseMove={handleMouseMove}
			onMouseLeave={() => setIsVisible(false)}>
			{children}
			{isVisible && (
				<div
					ref={tooltipRef}
					className='tooltip'
					style={{
						position: 'absolute',
						left: `${position.x}px`,
						top: `${position.y}px`,
					}}>
					{content}
				</div>
			)}
		</div>
	);
};

export default Tooltip;
