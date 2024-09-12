import React, { useState } from 'react';
import '../../styles/ui/Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => {
	const [isFocused, setIsFocused] = useState(false);
	const [hasValue, setHasValue] = useState(false);

	const handleFocus = () => setIsFocused(true);
	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		setIsFocused(false);
		setHasValue(!!e.target.value);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setHasValue(!!e.target.value);
		if (props.onChange) {
			props.onChange(e);
		}
	};

	return (
		<div className={`custom-input ${isFocused || hasValue ? 'focused' : ''}`}>
			<input
				{...props}
				onFocus={handleFocus}
				onBlur={handleBlur}
				onChange={handleChange}
			/>
			<label>{label}</label>
		</div>
	);
};

export default Input;
