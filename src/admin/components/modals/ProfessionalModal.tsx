import React, { useState, useEffect } from 'react';
import {
	Modal,
	Box,
	Typography,
	TextField,
	Button,
	Switch,
	FormControlLabel,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
} from '@mui/material';
import { Icon } from '@iconify/react';
import '../../../shared/styles/ui/Modal.css';
import { Company, Professional, ObjectId } from '../../../shared/types';

interface ProfessionalModalProps {
	open: boolean;
	onClose: () => void;
	onSave: (professional: Omit<Professional, '_id'>) => void;
	professional?: Professional;
	companies: Company[];
}

const ProfessionalModal: React.FC<ProfessionalModalProps> = ({
	open,
	onClose,
	onSave,
	professional,
	companies,
}) => {
	const [formData, setFormData] = useState<Omit<Professional, '_id'>>({
		first_name: '',
		last_name: '',
		email: '',
		phone: '',
		company: '' as unknown as ObjectId,
		position: '',
		department: '',
		skills: [],
		active: true,
	});

	useEffect(() => {
		if (professional) {
			setFormData({
				...professional,
				company: professional.company._id || professional.company,
			});
		}
	}, [professional]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave({
			...formData,
			company: formData.company.toString(),
		});
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
					{professional
						? 'Modifier le professionnel'
						: 'Ajouter un professionnel'}
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
									name='first_name'
									label='Prénom'
									value={formData.first_name}
									onChange={(e) =>
										setFormData({ ...formData, first_name: e.target.value })
									}
									required
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
									name='lastName'
									label='Nom'
									value={formData.last_name}
									onChange={(e) =>
										setFormData({ ...formData, last_name: e.target.value })
									}
									required
								/>
							</div>
						</div>
					</div>

					<div className='modal-form-group'>
						<label>Coordonnées</label>
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
									name='email'
									label='Email'
									type='email'
									value={formData.email}
									onChange={(e) =>
										setFormData({ ...formData, email: e.target.value })
									}
									required
								/>
							</div>
							<div className='form-field-container'>
								<TextField
									className='modal-input'
									fullWidth
									margin='normal'
									name='phone'
									label='Téléphone'
									value={formData.phone}
									onChange={(e) =>
										setFormData({ ...formData, phone: e.target.value })
									}
								/>
							</div>
						</div>
					</div>

					<div className='modal-form-group'>
						<label>Informations professionnelles</label>
						<div>
							<div className='form-field-container'>
								<Icon
									icon='fluent:important-12-filled'
									className='required-icon'
								/>
								<FormControl
									fullWidth
									margin='normal'
									required>
									<InputLabel>Entreprise</InputLabel>
									<Select
										value={formData.company.toString()}
										onChange={(e) =>
											setFormData({
												...formData,
												company: e.target.value as unknown as ObjectId,
											})
										}>
										{companies.map((company) => (
											<MenuItem
												key={company._id}
												value={company._id.toString()}>
												{company.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>
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
									name='position'
									label='Poste'
									value={formData.position}
									onChange={(e) =>
										setFormData({ ...formData, position: e.target.value })
									}
									required
								/>
							</div>
						</div>
						<div>
							<div className='form-field-container'>
								<TextField
									className='modal-input'
									fullWidth
									margin='normal'
									name='department'
									label='Département'
									value={formData.department}
									onChange={(e) =>
										setFormData({ ...formData, department: e.target.value })
									}
								/>
							</div>
							<div className='form-field-container'>
								<TextField
									className='modal-input'
									fullWidth
									margin='normal'
									name='skills'
									label='Compétences'
									value={formData.skills.join(', ')}
									onChange={(e) =>
										setFormData({
											...formData,
											skills: e.target.value
												.split(',')
												.map((item) => item.trim()),
										})
									}
									helperText='Séparez les compétences par des virgules'
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
										checked={formData.active}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												active: e.target.checked,
											}))
										}
										name='active'
									/>
								}
								label={
									<span
										style={{
											color: formData.active
												? 'var(--success-color)'
												: 'var(--error-color)',
										}}>
										{formData.active ? 'Actif' : 'Inactif'}
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
						onClick={handleSubmit}
						className='modal-button'>
						Enregistrer
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};

export default ProfessionalModal;
