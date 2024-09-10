import React, { useState, useEffect, useContext } from 'react';
import {
	TextField,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@mui/material';
import { Icon } from '@iconify/react';
import axios from 'axios';
import ResizableTable from '../components/ResizableTable';
import CompanyModal from '../components/CompanyModal';
import { AlertContext } from '../App';

interface Company {
	_id: string;
	numericId: number;
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
	createdAt: string;
	updatedAt: string;
}

const Companies = () => {
	const [companies, setCompanies] = useState<Company[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedCompany, setSelectedCompany] = useState<Company | undefined>();
	const [sortConfig, setSortConfig] = useState<{
		key: string;
		direction: 'asc' | 'desc';
	} | null>(null);
	const addAlert = useContext(AlertContext);
	const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
	const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);

	useEffect(() => {
		fetchCompanies();
	}, []);

	const fetchCompanies = async () => {
		try {
			const response = await axios.get('http://localhost:5000/api/companies');
			setCompanies(response.data);
		} catch (error) {
			console.error('Error fetching companies:', error);
			addAlert?.('Erreur lors de la récupération des entreprises', 'error');
		}
	};

	const handleEdit = (id: string) => {
		const company = companies.find((c) => c._id === id);
		setSelectedCompany(company);
		setIsModalOpen(true);
	};

	const handleDelete = (id: string) => {
		setCompanyToDelete(id);
		setIsConfirmDialogOpen(true);
	};

	const confirmDelete = async () => {
		if (companyToDelete) {
			try {
				await axios.delete(
					`http://localhost:5000/api/companies/${companyToDelete}`
				);
				addAlert?.('Entreprise supprimée avec succès', 'success');
				fetchCompanies();
			} catch (error) {
				console.error('Error deleting company:', error);
				addAlert?.("Erreur lors de la suppression de l'entreprise", 'error');
			}
		}
		setIsConfirmDialogOpen(false);
		setCompanyToDelete(null);
	};

	const handleSave = async (company: Partial<Company>) => {
		try {
			if (selectedCompany) {
				await axios.put(
					`http://localhost:5000/api/companies/${selectedCompany._id}`,
					company
				);
				addAlert?.('Entreprise mise à jour avec succès', 'success');
			} else {
				await axios.post('http://localhost:5000/api/companies', company);
				addAlert?.('Entreprise créée avec succès', 'success');
			}
			setIsModalOpen(false);
			fetchCompanies();
		} catch (error) {
			console.error('Error saving company:', error);
			addAlert?.("Erreur lors de l'enregistrement de l'entreprise", 'error');
		}
	};

	const requestSort = (key: string | number) => {
		let direction: 'asc' | 'desc' = 'asc';
		if (
			sortConfig &&
			sortConfig.key === key &&
			sortConfig.direction === 'asc'
		) {
			direction = 'desc';
		}
		setSortConfig({ key: key.toString(), direction });
	};

	const sortedCompanies = React.useMemo(() => {
		let sortableCompanies = [...companies];
		if (sortConfig !== null) {
			sortableCompanies.sort((a, b) => {
				if (
					a[sortConfig.key as keyof Company] <
					b[sortConfig.key as keyof Company]
				) {
					return sortConfig.direction === 'asc' ? -1 : 1;
				}
				if (
					a[sortConfig.key as keyof Company] >
					b[sortConfig.key as keyof Company]
				) {
					return sortConfig.direction === 'asc' ? 1 : -1;
				}
				return 0;
			});
		}
		return sortableCompanies;
	}, [companies, sortConfig]);

	const filteredCompanies = sortedCompanies.filter((company) =>
		Object.values(company).some((value) =>
			value.toString().toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	const columns = [
		{ header: 'ID', accessor: 'numericId', width: 100 },
		{ header: 'Nom', accessor: 'name', width: 200 },
		{ header: 'Taille', accessor: 'size', width: 100 },
		{ header: 'Type', accessor: 'type', width: 150 },
		{
			header: 'Accepte candidatures spontanées',
			accessor: 'acceptsUnsolicited',
			width: 200,
		},
		{ header: 'Domaines', accessor: 'domains', width: 200 },
		{ header: 'Pays', accessor: 'countries', width: 150 },
		{ header: 'Villes', accessor: 'cities', width: 150 },
		{ header: 'Disponible', accessor: 'available', width: 100 },
		{ header: 'Créé le', accessor: 'createdAt', width: 200 },
		{ header: 'Mis à jour le', accessor: 'updatedAt', width: 200 },
	];

	const formatDate = (date: Date | string | undefined) => {
		if (!date) return 'N/A';
		const parsedDate = typeof date === 'string' ? new Date(date) : date;
		if (isNaN(parsedDate.getTime())) return 'N/A';
		return new Intl.DateTimeFormat('fr-FR', {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
		}).format(parsedDate);
	};

	return (
		<div>
			<div className='table-actions'>
				<TextField
					className='search-input'
					label='Rechercher'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					fullWidth
					margin='normal'
				/>
				<Button
					variant='contained'
					onClick={() => {
						setSelectedCompany(undefined);
						setIsModalOpen(true);
					}}>
					<Icon
						icon='bi:building-fill-add'
						style={{ fontSize: '1.5em' }}
					/>
				</Button>
			</div>
			<ResizableTable
				columns={columns}
				data={filteredCompanies.map((company) => ({
					...company,
					createdAt: formatDate(company.createdAt),
					updatedAt: formatDate(company.updatedAt),
					acceptsUnsolicited: company.acceptsUnsolicited ? 'Oui' : 'Non',
					available: company.available ? 'Oui' : 'Non',
					domains: company.domains.join(', '),
					countries: company.countries.join(', '),
					cities: company.cities.join(', '),
				}))}
				renderActions={(row) => (
					<div className='action-buttons'>
						<Icon
							onClick={() => handleEdit(row._id)}
							icon='bi:building-fill-gear'
							color='var(--success-color)'
							style={{ cursor: 'pointer' }}
						/>
						<Icon
							onClick={() => handleDelete(row._id)}
							icon='bi:building-fill-slash'
							color='var(--error-color)'
							style={{ cursor: 'pointer' }}
						/>
					</div>
				)}
				requestSort={requestSort}
				sortConfig={sortConfig}
			/>
			<CompanyModal
				open={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={handleSave}
				company={selectedCompany}
			/>
			<Dialog
				open={isConfirmDialogOpen}
				onClose={() => setIsConfirmDialogOpen(false)}
				aria-labelledby='alert-dialog-title'
				aria-describedby='alert-dialog-description'>
				<DialogTitle id='alert-dialog-title'>
					{'Confirmer la suppression'}
				</DialogTitle>
				<DialogContent>
					<DialogContentText id='alert-dialog-description'>
						Êtes-vous sûr de vouloir supprimer cette entreprise ? Cette action
						est irréversible.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => setIsConfirmDialogOpen(false)}
						color='primary'>
						Annuler
					</Button>
					<Button
						onClick={confirmDelete}
						color='primary'
						autoFocus>
						Confirmer
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default Companies;
