import React from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

interface Student {
	_id?: string;
	numericId?: number;
	name: string;
	username: string;
	email: string;
	phone: string;
}

interface StudentModalProps {
	open: boolean;
	onClose: () => void;
	onSave: (student: Student) => void;
	student?: Student;
}

const StudentModal: React.FC<StudentModalProps> = ({
	open,
	onClose,
	onSave,
	student,
}) => {
	const [formData, setFormData] = React.useState<Student>(
		student || { name: '', username: '', email: '', phone: '' }
	);

	React.useEffect(() => {
		setFormData(student || { name: '', username: '', email: '', phone: '' });
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
			<Box
				sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: 400,
					bgcolor: 'background.paper',
					border: '2px solid #000',
					boxShadow: 24,
					p: 4,
				}}>
				<Typography
					id='modal-modal-title'
					variant='h6'
					component='h2'>
					{student ? 'Edit Student' : 'Add Student'}
				</Typography>
				<Box
					component='form'
					sx={{ mt: 2 }}>
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
				<Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
					<Button
						variant='contained'
						onClick={onClose}
						sx={{ mr: 1 }}>
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
