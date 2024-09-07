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
			created_at: new Date(),
			updated_at: new Date(),
		}
	);

	React.useEffect(() => {
		setFormData(
			student || {
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
				created_at: new Date(),
				updated_at: new Date(),
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
		const updatedFormData = {
			...formData,
			updated_at: new Date(),
		};
		onSave(updatedFormData);
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
					{student ? 'Modifier un étudiant' : 'Ajouter un étudiant'}
				</Typography>
				<Box
					component='form'
					className='modal-form'>
					<div className='modal-form-group'>
						<label>Informations personnelles</label>
						<div>
							<TextField
								fullWidth
								margin='normal'
								id='first_name'
								label='Prénom'
								value={formData.first_name}
								onChange={handleChange}
							/>
							<TextField
								fullWidth
								margin='normal'
								id='last_name'
								label='Nom'
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
								label='Téléphone'
								value={formData.phone}
								onChange={handleChange}
							/>
						</div>
					</div>
					<div className='modal-form-group'>
						<label>Localisation</label>

						<div>
							<TextField
								fullWidth
								margin='normal'
								id='country'
								label='Pays'
								value={formData.country}
								onChange={handleChange}
							/>
							<TextField
								fullWidth
								margin='normal'
								id='region'
								label='Région'
								value={formData.region}
								onChange={handleChange}
							/>
							<TextField
								fullWidth
								margin='normal'
								id='city'
								label='Ville'
								value={formData.city}
								onChange={handleChange}
							/>
						</div>
					</div>
					<div className='modal-form-group'>
						<label>Scolarité</label>
						<div>
							<TextField
								fullWidth
								margin='normal'
								id='school'
								label='École'
								value={formData.school}
								onChange={handleChange}
							/>
							<TextField
								fullWidth
								margin='normal'
								id='grade'
								label='Niveau'
								value={formData.grade}
								onChange={handleChange}
							/>
						</div>
					</div>
					<div className='modal-form-group'>
						<label>Disponibilité</label>
						<div>
							<FormControlLabel
								control={
									<Switch
										checked={formData.available}
										onChange={handleChange}
										id='available'
									/>
								}
								label='Disponible'
							/>
						</div>
					</div>
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
						Enregistrer
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};

export default StudentModal;
