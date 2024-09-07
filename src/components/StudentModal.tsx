import React from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { Icon } from '@iconify/react/dist/iconify.js';
import ModalClose from '@mui/joy/ModalClose';

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
			<Box className='modal-box'>
				<div className='modal-header'>
					<Typography
						id='modal-modal-title'
						variant='h6'
						component='h2'
						className='modal-title'>
						{student ? 'Modifier un étudiant' : 'Ajouter un étudiant'}
					</Typography>

					<ModalClose onClick={onClose} />
				</div>
				{student && (
					<p>
						<span className='bold-text'>ID:</span> {student.numericId}
					</p>
				)}

				<Box
					component='form'
					className='modal-form'>
					<TextField
						className='modal-input'
						fullWidth
						margin='normal'
						id='name'
						label='Nom'
						value={formData.name}
						onChange={handleChange}
					/>
					<TextField
						className='modal-input'
						fullWidth
						margin='normal'
						id='username'
						label='Prénom'
						value={formData.username}
						onChange={handleChange}
					/>
					<TextField
						className='modal-input'
						fullWidth
						margin='normal'
						id='email'
						label='Email'
						value={formData.email}
						onChange={handleChange}
					/>
					<TextField
						className='modal-input'
						fullWidth
						margin='normal'
						id='phone'
						label='Téléphone'
						value={formData.phone}
						onChange={handleChange}
					/>
				</Box>
				<Box className='modal-actions'>
					<Button
						variant='contained'
						onClick={handleSave}>
						Enregistrer
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};

export default StudentModal;
