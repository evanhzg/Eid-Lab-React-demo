import React, { useState, useEffect } from 'react';
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
import '../styles/modal.css';
import { Icon } from '@iconify/react';

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
	const [formData, setFormData] = useState<Student>({
		_id: '',
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
	});

	const [errors, setErrors] = useState<Partial<Student>>({});

	useEffect(() => {
		if (student) {
			setFormData({
				...student,
				created_at: new Date(student.created_at),
				updated_at: new Date(student.updated_at),
			});
		} else {
			setFormData({
				_id: '',
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
			});
		}
		setErrors({});
	}, [student]);

	const validateForm = () => {
		const newErrors: Partial<Student> = {};
		if (!formData.first_name) newErrors.first_name = 'Le prénom est requis';
		if (!formData.last_name) newErrors.last_name = 'Le nom est requis';
		if (!formData.email) newErrors.email = "L'email est requis";
		else if (!/\S+@\S+\.\S+/.test(formData.email))
			newErrors.email = "L'email est invalide";
		if (!formData.phone) newErrors.phone = 'Le téléphone est requis';
		if (!formData.country) newErrors.country = 'Le pays est requis';
		if (!formData.region) newErrors.region = 'La région est requise';
		if (!formData.city) newErrors.city = 'La ville est requise';
		if (!formData.school) newErrors.school = "L'école est requise";
		if (!formData.grade) newErrors.grade = 'Le niveau est requis';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value, type, checked } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[id]: type === 'checkbox' ? checked : value,
		}));
		if (errors[id as keyof Student]) {
			setErrors((prevErrors) => ({ ...prevErrors, [id]: undefined }));
		}
	};

	const handleSave = () => {
		if (validateForm()) {
			const updatedFormData: Student = {
				...formData,
				updated_at: new Date(),
				created_at: formData.created_at
					? new Date(formData.created_at)
					: new Date(),
			};
			onSave(updatedFormData);
		}
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'
			className='custom-modal'>
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
							<div className='form-field-container'>
								<Icon
									icon='fluent:important-12-filled'
									className='required-icon'
								/>
								<TextField
									className='modal-input'
									fullWidth
									margin='normal'
									id='first_name'
									label='Prénom'
									value={formData.first_name}
									onChange={handleChange}
									error={!!errors.first_name}
									helperText={errors.first_name}
								/>
							</div>
							<div className='form-field-container'>
								<Icon
									icon='fluent:important-12-filled'
									className='required-icon'
								/>
								<TextField
									className='modal-input'
									fullWidth
									margin='normal'
									id='last_name'
									label='Nom'
									value={formData.last_name}
									onChange={handleChange}
									error={!!errors.last_name}
									helperText={errors.last_name}
								/>
							</div>
						</div>
						<div>
							<div className='form-field-container'>
								<Icon
									icon='fluent:important-12-filled'
									className='required-icon'
								/>
								<TextField
									className='modal-input'
									fullWidth
									margin='normal'
									id='email'
									label='Email'
									value={formData.email}
									onChange={handleChange}
									error={!!errors.email}
									helperText={errors.email}
								/>
							</div>
							<div className='form-field-container'>
								<TextField
									className='modal-input'
									fullWidth
									margin='normal'
									id='phone'
									label='Téléphone'
									value={formData.phone}
									onChange={handleChange}
									error={!!errors.phone}
									helperText={errors.phone}
								/>
							</div>
						</div>
					</div>
					<div className='modal-form-group'>
						<label>Localisation</label>
						<div>
							<div className='form-field-container'>
								<TextField
									className='modal-input'
									fullWidth
									margin='normal'
									id='country'
									label='Pays'
									value={formData.country}
									onChange={handleChange}
									error={!!errors.country}
									helperText={errors.country}
								/>
							</div>
							<div className='form-field-container'>
								<TextField
									className='modal-input'
									fullWidth
									margin='normal'
									id='region'
									label='Région'
									value={formData.region}
									onChange={handleChange}
									error={!!errors.region}
									helperText={errors.region}
								/>
							</div>
							<div className='form-field-container'>
								<TextField
									className='modal-input'
									fullWidth
									margin='normal'
									id='city'
									label='Ville'
									value={formData.city}
									onChange={handleChange}
									error={!!errors.city}
									helperText={errors.city}
								/>
							</div>
						</div>
					</div>
					<div className='modal-form-group'>
						<label>Scolarité</label>
						<div>
							<div className='form-field-container'>
								<Icon
									icon='fluent:important-12-filled'
									className='required-icon'
								/>
								<TextField
									className='modal-input'
									fullWidth
									margin='normal'
									id='school'
									label='École'
									value={formData.school}
									onChange={handleChange}
									error={!!errors.school}
									helperText={errors.school}
								/>
							</div>
							<div className='form-field-container'>
								<TextField
									className='modal-input'
									fullWidth
									margin='normal'
									id='grade'
									label='Niveau'
									value={formData.grade}
									onChange={handleChange}
									error={!!errors.grade}
									helperText={errors.grade}
								/>
							</div>
						</div>
					</div>

					<div className='modal-form-group'>
						<label>Statut</label>
						<div>
							<FormControlLabel
								control={
									<Switch
										checked={formData.available}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												available: e.target.checked,
											}))
										}
										name='available'
									/>
								}
								label={
									<span
										style={{
											color: formData.available
												? 'var(--success-color)'
												: 'var(--error-color)',
										}}>
										{formData.available ? 'Disponible' : 'Indisponible'}
									</span>
								}
							/>
						</div>
					</div>
				</Box>
				<Box className='modal-actions'>
					<Button
						variant='contained'
						onClick={onClose}
						className='modal-button'>
						Fermer
					</Button>
					<Button
						variant='contained'
						onClick={handleSave}
						className='modal-button'>
						Enregistrer
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};

export default StudentModal;
