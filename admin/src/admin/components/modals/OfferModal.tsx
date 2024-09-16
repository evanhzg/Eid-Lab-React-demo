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
import { getCompanies } from '../../../services/companyService';
import { Company, Offer, ObjectId } from '../../../shared/types';

interface OfferModalProps {
	open: boolean;
	onClose: () => void;
	onSave: (offer: Omit<Offer, '_id'>) => void;
	offer?: Offer;
}

const OfferModal: React.FC<OfferModalProps> = ({
	open,
	onClose,
	onSave,
	offer,
}) => {
	const [companies, setCompanies] = useState<Company[]>([]);
	const [formData, setFormData] = useState<Omit<Offer, '_id'>>({
		title: '',
		company: '' as unknown as ObjectId,
		description: '',
		contractType: 'Stage',
		location: '',
		salary: '',
		requiredSkills: [],
		startDate: new Date(),
		endDate: new Date(),
		available: true,
	});

	useEffect(() => {
		fetchCompanies();
		if (offer) {
			setFormData({
				...offer,
				company: offer.company._id || offer.company, // Use _id if it's an object, otherwise use the value directly
				startDate: offer.startDate ? new Date(offer.startDate) : new Date(),
				endDate: offer.endDate ? new Date(offer.endDate) : new Date(),
			});
		}
	}, [offer]);

	const fetchCompanies = async () => {
		try {
			const fetchedCompanies = await getCompanies();
			setCompanies(fetchedCompanies);
		} catch (error) {
			console.error('Error fetching companies:', error);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave({
			...formData,
			company: formData.company.toString(), // Ensure it's a string when sending to the backend
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
					{offer ? "Modifier l'offre" : 'Ajouter une offre'}
				</Typography>
				<Box
					component='form'
					className='modal-form'>
					<div className='modal-form-group'>
						<label>Informations générales</label>
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
									name='title'
									label='Titre'
									value={formData.title}
									onChange={(e) =>
										setFormData({ ...formData, title: e.target.value })
									}
									required
								/>
							</div>
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
										value={formData.company.toString()} // Convert to string for comparison
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
												{' '}
												{company.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</div>
						</div>
					</div>

					<div className='modal-form-group'>
						<label>Détails de l'offre</label>
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
									<InputLabel>Contract Type</InputLabel>
									<Select
										value={formData.contractType}
										onChange={(e) =>
											setFormData({
												...formData,
												contractType: e.target.value as Offer['contractType'],
											})
										}>
										<MenuItem value='Stage'>Stage</MenuItem>
										<MenuItem value='Apprentissage'>Apprentissage</MenuItem>
										<MenuItem value='Professionnalisation'>
											Professionnalisation
										</MenuItem>
										<MenuItem value='Freelance'>Freelance</MenuItem>
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
									name='location'
									label='Lieu'
									value={formData.location}
									onChange={(e) =>
										setFormData({ ...formData, location: e.target.value })
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
									name='salary'
									label='Salaire'
									value={formData.salary}
									onChange={(e) =>
										setFormData({ ...formData, salary: e.target.value })
									}
								/>
							</div>
							<div className='form-field-container'>
								<TextField
									className='modal-input'
									fullWidth
									margin='normal'
									name='requiredSkills'
									label='Prérequis'
									value={formData.requiredSkills.join(', ')}
									onChange={(e) =>
										setFormData({
											...formData,
											requiredSkills: e.target.value
												.split(',')
												.map((item) => item.trim()),
										})
									}
									helperText='Séparez les prérequis par des virgules'
								/>
							</div>
						</div>
					</div>

					<div className='modal-form-group'>
						<label>Période</label>
						<div>
							<TextField
								className='modal-input'
								fullWidth
								margin='normal'
								name='startDate'
								label='Date de début'
								type='date'
								value={formData.startDate.toISOString().split('T')[0]}
								onChange={(e) =>
									setFormData({
										...formData,
										startDate: new Date(e.target.value),
									})
								}
								InputLabelProps={{
									shrink: true,
								}}
							/>
							<TextField
								className='modal-input'
								fullWidth
								margin='normal'
								name='endDate'
								label='Date de fin'
								type='date'
								value={formData.endDate.toISOString().split('T')[0]}
								onChange={(e) =>
									setFormData({
										...formData,
										endDate: new Date(e.target.value),
									})
								}
								InputLabelProps={{
									shrink: true,
								}}
							/>
						</div>
					</div>

					<div className='modal-form-group'>
						<label>Description</label>
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
									name='description'
									label='Description complète'
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
									multiline
									rows={4}
									required
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
						onClick={handleSubmit}
						className='modal-button'>
						Enregistrer
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};

export default OfferModal;
