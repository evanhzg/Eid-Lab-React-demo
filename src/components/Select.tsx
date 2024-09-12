import React, { useState } from 'react';
import '../styles/components/select.css';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	label: string;
	options: { value: string; label: string }[];
}

const Select: React.FC<SelectProps> = ({ label, options, ...props }) => {
	const [isFocused, setIsFocused] = useState(false);
	const [hasValue, setHasValue] = useState(false);

	const handleFocus = () => setIsFocused(true);
	const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
		setIsFocused(false);
		setHasValue(!!e.target.value);
	};

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setHasValue(!!e.target.value);
		if (props.onChange) {
			props.onChange(e);
		}
	};

	return (
		<div className={`custom-select ${isFocused || hasValue ? 'focused' : ''}`}>
			<select
				{...props}
				onFocus={handleFocus}
				onBlur={handleBlur}
				onChange={handleChange}>
				<option
					value=''
					disabled
					selected
					hidden></option>
				{options.map((option) => (
					<option
						key={option.value}
						value={option.value}>
						{option.label}
					</option>
				))}
			</select>
			<label>{label}</label>
		</div>
	);
};

export default Select;
