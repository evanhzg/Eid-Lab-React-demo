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
	const [formData, setFormData] = useState<Student>(
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

	const [errors, setErrors] = useState<Partial<Student>>({});

	useEffect(() => {
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
		setErrors({});
	}, [student]);

	const validateForm = () => {
		const newErrors: Partial<Student> = {};
		if (!formData.first_name) newErrors.first_name = 'First name is required';
		if (!formData.last_name) newErrors.last_name = 'Last name is required';
		if (!formData.email) newErrors.email = 'Email is required';
		else if (!/\S+@\S+\.\S+/.test(formData.email))
			newErrors.email = 'Email is invalid';
		if (!formData.phone) newErrors.phone = 'Phone is required';
		if (!formData.country) newErrors.country = 'Country is required';
		if (!formData.region) newErrors.region = 'Region is required';
		if (!formData.city) newErrors.city = 'City is required';
		if (!formData.school) newErrors.school = 'School is required';
		if (!formData.grade) newErrors.grade = 'Grade is required';
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

	const formatDate = (date: string | Date) => {
		if (!date) return 'N/A';
		return new Date(date).toLocaleString();
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
								error={!!errors.first_name}
								helperText={errors.first_name}
							/>
							<TextField
								fullWidth
								margin='normal'
								id='last_name'
								label='Nom'
								value={formData.last_name}
								onChange={handleChange}
								error={!!errors.last_name}
								helperText={errors.last_name}
							/>
							<TextField
								fullWidth
								margin='normal'
								id='email'
								label='Email'
								value={formData.email}
								onChange={handleChange}
								error={!!errors.email}
								helperText={errors.email}
							/>
							<TextField
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
								error={!!errors.country}
								helperText={errors.country}
							/>
							<TextField
								fullWidth
								margin='normal'
								id='region'
								label='Région'
								value={formData.region}
								onChange={handleChange}
								error={!!errors.region}
								helperText={errors.region}
							/>
							<TextField
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
								error={!!errors.school}
								helperText={errors.school}
							/>
							<TextField
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
					<div className='modal-form-group'>
						<label>Dates</label>
						<div>
							<TextField
								fullWidth
								margin='normal'
								id='created_at'
								label='Date de création'
								value={formatDate(formData.created_at)}
								InputProps={{
									readOnly: true,
								}}
							/>
							<TextField
								fullWidth
								margin='normal'
								id='updated_at'
								label='Date de mise à jour'
								value={formatDate(formData.updated_at)}
								InputProps={{
									readOnly: true,
								}}
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
