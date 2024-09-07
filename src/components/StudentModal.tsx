import React from 'react';
import {
	Modal,
	Box,
	Typography,
	TextField,
	Button,
	Switch,
	FormControlLabel,
} from '@mui/material';
import { Student } from '../types';

interface StudentModalProps {
	open: boolean;
	onClose: () => void;
	onSave: (student: Student) => void | Promise<void>;
	student?: Student;
}

const StudentModal: React.FC<StudentModalProps> = ({
	open,
	onClose,
	onSave,
	student,
}) => {
	const [formData, setFormData] = React.useState<Student>(
		student || {
			numericId: 0,
			first_name: '',
			last_name: '',
			email: '',
			phone: '',
			country: '',
			region: '',
			city: '',
			school: '',
			grade: '',
			available: false,
		}
	);

	React.useEffect(() => {
		setFormData(
			student || {
				numericId: 0,
				first_name: '',
				last_name: '',
				email: '',
				phone: '',
				country: '',
				region: '',
				city: '',
				school: '',
				grade: '',
				available: false,
			}
		);
	}, [student]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value, type, checked } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[id]: type === 'checkbox' ? checked : value,
		}));
	};

	const handleSave = () => {
		onSave(formData);
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'>
			<Box className='modal-box'>
				<Typography
					id='modal-modal-title'
					variant='h6'
					component='h2'
					className='modal-title'>
					{student ? 'Edit Student' : 'Add Student'}
				</Typography>
				<Box
					component='form'
					className='modal-form'>
					<TextField
						fullWidth
						margin='normal'
						id='first_name'
						label='First Name'
						value={formData.first_name}
						onChange={handleChange}
					/>
					<TextField
						fullWidth
						margin='normal'
						id='last_name'
						label='Last Name'
						value={formData.last_name}
						onChange={handleChange}
					/>
					<TextField
						fullWidth
						margin='normal'
						id='email'
						label='Email'
						value={formData.email}
						onChange={handleChange}
					/>
					<TextField
						fullWidth
						margin='normal'
						id='phone'
						label='Phone'
						value={formData.phone}
						onChange={handleChange}
					/>
					<TextField
						fullWidth
						margin='normal'
						id='country'
						label='Country'
						value={formData.country}
						onChange={handleChange}
					/>
					<TextField
						fullWidth
						margin='normal'
						id='region'
						label='Region'
						value={formData.region}
						onChange={handleChange}
					/>
					<TextField
						fullWidth
						margin='normal'
						id='city'
						label='City'
						value={formData.city}
						onChange={handleChange}
					/>
					<TextField
						fullWidth
						margin='normal'
						id='school'
						label='School'
						value={formData.school}
						onChange={handleChange}
					/>
					<TextField
						fullWidth
						margin='normal'
						id='grade'
						label='Grade'
						value={formData.grade}
						onChange={handleChange}
					/>
					<FormControlLabel
						control={
							<Switch
								checked={formData.available}
								onChange={handleChange}
								id='available'
							/>
						}
						label='Available'
					/>
				</Box>
				<Box className='modal-actions'>
					<Button
						variant='contained'
						onClick={onClose}
						className='modal-button'>
						Close
					</Button>
					<Button
						variant='contained'
						onClick={handleSave}>
						Save Changes
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};

export default StudentModal;
