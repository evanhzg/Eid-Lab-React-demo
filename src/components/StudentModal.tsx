import React from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
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
		student || { numericId: 0, name: '', username: '', email: '', phone: '' }
	);

	React.useEffect(() => {
		setFormData(
			student || { numericId: 0, name: '', username: '', email: '', phone: '' }
		);
	}, [student]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		setFormData((prevState) => ({ ...prevState, [id]: value }));
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
						id='name'
						label='Name'
						value={formData.name}
						onChange={handleChange}
					/>
					<TextField
						fullWidth
						margin='normal'
						id='username'
						label='Username'
						value={formData.username}
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
