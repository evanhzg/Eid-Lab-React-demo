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
	SelectChangeEvent,
} from '@mui/material';
import { styled, BoxProps } from '@mui/system';
import '../styles/modal.css';

interface Company {
	_id: string;
	name: string;
	size: string;
	type: string;
	acceptsUnsolicited: boolean;
	domains: string[];
	countries: string[];
	cities: string[];
	description: string;
	shortDescription: string;
	logo: string;
	available: boolean;
}

interface CompanyModalProps {
	open: boolean;
	onClose: () => void;
	onSave: (company: Company) => void | Promise<void>;
	company?: Company;
}

const ScrollableBox = styled(Box)<BoxProps>(({ theme }) => ({
	maxHeight: 'calc(100vh - 200px)',
	overflowY: 'auto',
}));

const CompanyModal: React.FC<CompanyModalProps> = ({
	open,
	onClose,
	onSave,
	company,
}) => {
	const [formData, setFormData] = useState<Company>({
		_id: '',
		name: '',
		size: '',
		type: '',
		acceptsUnsolicited: false,
		domains: [],
		countries: [],
		cities: [],
		description: '',
		shortDescription: '',
		logo: '',
		available: true,
	});

	const [errors, setErrors] = useState<Partial<Record<keyof Company, string>>>(
		{}
	);

	useEffect(() => {
		if (company) {
			setFormData(company);
		} else {
			setFormData({
				_id: '',
				name: '',
				size: '',
				type: '',
				acceptsUnsolicited: false,
				domains: [],
				countries: [],
				cities: [],
				description: '',
				shortDescription: '',
				logo: '',
				available: true,
			});
		}
		setErrors({});
	}, [company]);

	const validateForm = () => {
		const newErrors: Partial<Record<keyof Company, string>> = {};
		if (!formData.name) newErrors.name = 'Le nom est requis';
		if (!formData.size) newErrors.size = 'La taille est requise';
		if (!formData.type) newErrors.type = 'Le type est requis';
		if (formData.countries.length === 0)
			newErrors.countries = 'Au moins un pays est requis';
		if (formData.cities.length === 0)
			newErrors.cities = 'Au moins une ville est requise';
		if (!formData.description)
			newErrors.description = 'La description est requise';
		if (!formData.shortDescription)
			newErrors.shortDescription = 'La description courte est requise';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleChange = (
		e:
			| React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
			| SelectChangeEvent
	) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
		if (errors[name as keyof Company]) {
			setErrors((prevErrors) => ({
				...prevErrors,
				[name]: undefined,
			}));
		}
	};

	const handleArrayChange =
		(name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value.split(',').map((item) => item.trim());
			setFormData((prev) => ({ ...prev, [name]: value }));
			if (errors[name as keyof Company]) {
				setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
			}
		};

	const handleSave = () => {
		if (validateForm()) {
			onSave(formData);
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
					{company ? "Modifier l'entreprise" : 'Ajouter une entreprise'}
				</Typography>
				<ScrollableBox
					component='form'
					className='modal-form'>
					<TextField
						className='modal-input'
						fullWidth
						margin='normal'
						name='name'
						label='Nom'
						value={formData.name}
						onChange={handleChange}
						error={!!errors.name}
						helperText={errors.name}
					/>
					<FormControl
						fullWidth
						margin='normal'
						error={!!errors.size}>
						<InputLabel>Taille</InputLabel>
						<Select
							name='size'
							value={formData.size}
							onChange={handleChange}>
							<MenuItem value='1-10'>1-10</MenuItem>
							<MenuItem value='11-50'>11-50</MenuItem>
							<MenuItem value='51-100'>51-100</MenuItem>
							<MenuItem value='101-500'>101-500</MenuItem>
							<MenuItem value='501+'>501+</MenuItem>
						</Select>
						{errors.size && (
							<Typography color='error'>{errors.size}</Typography>
						)}
					</FormControl>
					<FormControl
						fullWidth
						margin='normal'
						error={!!errors.type}>
						<InputLabel>Type</InputLabel>
						<Select
							name='type'
							value={formData.type}
							onChange={handleChange}>
							<MenuItem value='Startup'>Startup</MenuItem>
							<MenuItem value='Agence'>Agence</MenuItem>
							<MenuItem value='Grand Groupe'>Grand Groupe</MenuItem>
							<MenuItem value='PME'>PME</MenuItem>
							<MenuItem value='ESN'>ESN</MenuItem>
							<MenuItem value='Fonction publique'>Fonction publique</MenuItem>
							<MenuItem value='Autre'>Autre</MenuItem>
						</Select>
						{errors.type && (
							<Typography color='error'>{errors.type}</Typography>
						)}
					</FormControl>
					<FormControlLabel
						control={
							<Switch
								checked={formData.acceptsUnsolicited}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										acceptsUnsolicited: e.target.checked,
									}))
								}
								name='acceptsUnsolicited'
							/>
						}
						label='Accepte les candidatures spontanées'
					/>
					<TextField
						className='modal-input'
						fullWidth
						margin='normal'
						name='domains'
						label='Domaines'
						value={formData.domains.join(', ')}
						onChange={handleArrayChange('domains')}
						helperText='Séparez les domaines par des virgules'
					/>
					<TextField
						className='modal-input'
						fullWidth
						margin='normal'
						name='countries'
						label='Pays'
						value={formData.countries.join(', ')}
						onChange={handleArrayChange('countries')}
						error={!!errors.countries}
						helperText={errors.countries || 'Séparez les pays par des virgules'}
					/>
					<TextField
						className='modal-input'
						fullWidth
						margin='normal'
						name='cities'
						label='Villes'
						value={formData.cities.join(', ')}
						onChange={handleArrayChange('cities')}
						error={!!errors.cities}
						helperText={errors.cities || 'Séparez les villes par des virgules'}
					/>
					<TextField
						className='modal-input'
						fullWidth
						margin='normal'
						name='description'
						label='Description'
						value={formData.description}
						onChange={handleChange}
						multiline
						rows={4}
						error={!!errors.description}
						helperText={errors.description}
					/>
					<TextField
						className='modal-input'
						fullWidth
						margin='normal'
						name='shortDescription'
						label='Description courte'
						value={formData.shortDescription}
						onChange={handleChange}
						error={!!errors.shortDescription}
						helperText={errors.shortDescription}
					/>
					<TextField
						className='modal-input'
						fullWidth
						margin='normal'
						name='logo'
						label='URL du logo'
						value={formData.logo}
						onChange={handleChange}
					/>
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
				</ScrollableBox>
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

export default CompanyModal;
