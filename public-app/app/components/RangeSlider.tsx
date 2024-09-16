import React from 'react';
import '../styles/components/RangeSlider.css';

interface RangeSliderProps {
	min: number;
	max: number;
	step: number;
	values: [number, number];
	onChange: (values: [number, number]) => void;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
	min,
	max,
	step,
	values,
	onChange,
}) => {
	const [minValue, maxValue] = values;

	const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newMin = Math.min(Number(e.target.value), maxValue - step);
		onChange([newMin, maxValue]);
	};

	const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newMax = Math.max(Number(e.target.value), minValue + step);
		onChange([minValue, newMax]);
	};

	const getPercent = (value: number) => ((value - min) / (max - min)) * 100;

	return (
		<div className='range-slider'>
			<input
				type='range'
				min={min}
				max={max}
				step={step}
				value={minValue}
				onChange={handleMinChange}
				className='slider min-slider'
			/>
			<input
				type='range'
				min={min}
				max={max}
				step={step}
				value={maxValue}
				onChange={handleMaxChange}
				className='slider max-slider'
			/>
			<div className='range-slider__track'></div>
			<div
				className='range-slider__range'
				style={{
					left: `${getPercent(minValue)}%`,
					width: `${getPercent(maxValue) - getPercent(minValue)}%`,
				}}></div>
			<div className='range-slider__values'>
				<span>{minValue}</span>
				<span>{maxValue}</span>
			</div>
		</div>
	);
};

export default RangeSlider;
