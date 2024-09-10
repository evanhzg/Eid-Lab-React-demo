import React, { useState, useEffect } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Checkbox,
	FormControlLabel,
} from '@mui/material';
import { styled } from '@mui/system';

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
	isOpen: boolean;
	onClose: () => void;
	onSave: (company: Partial<Company>) => void;
	company?: Company;
}

const ScrollableDialogContent = styled(DialogContent)(({ theme }) => ({
	maxHeight: 'calc(100vh - 200px)', // Adjust 200px as needed
	overflowY: 'auto',
}));

const CompanyModal: React.FC<CompanyModalProps> = ({
	isOpen,
	onClose,
	onSave,
	company,
}) => {
	const [formData, setFormData] = useState<Partial<Company>>({
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

	useEffect(() => {
		if (company) {
			setFormData(company);
		} else {
			setFormData({
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
	}, [company]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectChange = (
		e: React.ChangeEvent<{ name?: string; value: unknown }>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name as string]: value }));
	};

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.target;
		setFormData((prev) => ({ ...prev, [name]: checked }));
	};

	const handleArrayChange =
		(name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value.split(',').map((item) => item.trim());
			setFormData((prev) => ({ ...prev, [name]: value }));
		};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(formData);
	};

	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			maxWidth='md'
			fullWidth>
			<DialogTitle>
				{company ? "Modifier l'entreprise" : 'Ajouter une entreprise'}
			</DialogTitle>
			<form onSubmit={handleSubmit}>
				<ScrollableDialogContent>
					<TextField
						name='name'
						label='Nom'
						value={formData.name}
						onChange={handleChange}
						fullWidth
						margin='normal'
						required
					/>
					<FormControl
						fullWidth
						margin='normal'
						required>
						<InputLabel>Taille</InputLabel>
						<Select
							name='size'
							value={formData.size}
							onChange={handleSelectChange}>
							<MenuItem value='1-10'>1-10</MenuItem>
							<MenuItem value='11-50'>11-50</MenuItem>
							<MenuItem value='51-100'>51-100</MenuItem>
							<MenuItem value='101-500'>101-500</MenuItem>
							<MenuItem value='501+'>501+</MenuItem>
						</Select>
					</FormControl>
					<FormControl
						fullWidth
						margin='normal'
						required>
						<InputLabel>Type</InputLabel>
						<Select
							name='type'
							value={formData.type}
							onChange={handleSelectChange}>
							<MenuItem value='Startup'>Startup</MenuItem>
							<MenuItem value='Agence'>Agence</MenuItem>
							<MenuItem value='Grand Groupe'>Grand Groupe</MenuItem>
							<MenuItem value='PME'>PME</MenuItem>
							<MenuItem value='ESN'>ESN</MenuItem>
							<MenuItem value='Fonction publique'>Fonction publique</MenuItem>
							<MenuItem value='Autre'>Autre</MenuItem>
						</Select>
					</FormControl>
					<FormControlLabel
						control={
							<Checkbox
								name='acceptsUnsolicited'
								checked={formData.acceptsUnsolicited}
								onChange={handleCheckboxChange}
							/>
						}
						label='Accepte les candidatures spontanées'
					/>
					<TextField
						name='domains'
						label='Domaines'
						value={formData.domains?.join(', ')}
						onChange={handleArrayChange('domains')}
						fullWidth
						margin='normal'
						helperText='Séparez les domaines par des virgules'
					/>
					<TextField
						name='countries'
						label='Pays'
						value={formData.countries?.join(', ')}
						onChange={handleArrayChange('countries')}
						fullWidth
						margin='normal'
						helperText='Séparez les pays par des virgules'
						required
					/>
					<TextField
						name='cities'
						label='Villes'
						value={formData.cities?.join(', ')}
						onChange={handleArrayChange('cities')}
						fullWidth
						margin='normal'
						helperText='Séparez les villes par des virgules'
						required
					/>
					<TextField
						name='description'
						label='Description'
						value={formData.description}
						onChange={handleChange}
						fullWidth
						margin='normal'
						multiline
						rows={4}
						required
					/>
					<TextField
						name='shortDescription'
						label='Description courte'
						value={formData.shortDescription}
						onChange={handleChange}
						fullWidth
						margin='normal'
						required
					/>
					<TextField
						name='logo'
						label='URL du logo'
						value={formData.logo}
						onChange={handleChange}
						fullWidth
						margin='normal'
					/>
					<FormControlLabel
						control={
							<Checkbox
								name='available'
								checked={formData.available}
								onChange={handleCheckboxChange}
							/>
						}
						label='Disponible'
					/>
				</ScrollableDialogContent>
				<DialogActions>
					<Button onClick={onClose}>Annuler</Button>
					<Button
						type='submit'
						variant='contained'
						color='primary'>
						Enregistrer
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default CompanyModal;
