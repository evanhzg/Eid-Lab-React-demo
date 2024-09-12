import React, { useState, useEffect, useContext, useMemo } from 'react';
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
import ResizableTable from '../components/ResizableTable';
import CompanyModal from '../components/CompanyModal';
import { Company } from '../types';
import { AlertContext } from '../App';
import {
	getCompanies,
	createCompany,
	updateCompany,
	deleteCompany,
} from '../services/companyService';
import { ObjectId } from '../types';
import { usePagination } from '../hooks/usePagination';

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
	const {
		currentPage,
		itemsPerPage,
		goToPage,
		nextPage,
		prevPage,
		paginate,
		totalPages,
		setItemsPerPageCount,
	} = usePagination<Company>(10);

	useEffect(() => {
		fetchCompanies();
	}, []);

	const fetchCompanies = async () => {
		try {
			const fetchedCompanies = await getCompanies();
			console.log('Fetched companies:', fetchedCompanies); // Add this line
			setCompanies(fetchedCompanies);
		} catch (error) {
			console.error('Error fetching companies:', error);
			addAlert?.('Erreur lors de la récupération des entreprises', 'error');
		}
	};

	const handleEdit = (id: string) => {
		const company = companies.find((c) => c._id.toString() === id);
		setSelectedCompany(company);
		setIsModalOpen(true);
	};
	const handleDelete = (id: ObjectId) => {
		setCompanyToDelete(id.toString());
		setIsConfirmDialogOpen(true);
	};

	const confirmDelete = async () => {
		if (companyToDelete) {
			try {
				await deleteCompany(companyToDelete);
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
				await updateCompany(selectedCompany._id!, company);
				addAlert?.('Entreprise mise à jour avec succès', 'success');
			} else {
				await createCompany(company as Omit<Company, '_id'>);
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

	const filteredCompanies = useMemo(() => {
		return sortedCompanies.filter((company) =>
			Object.values(company).some((value) =>
				value.toString().toLowerCase().includes(searchQuery.toLowerCase())
			)
		);
	}, [sortedCompanies, searchQuery]);

	const columns = [
		{ header: 'ID', accessor: 'numericId' },
		{ header: 'Nom', accessor: 'name' },
		{ header: 'Taille', accessor: 'size' },
		{ header: 'Type', accessor: 'type' },
		{
			header: 'Accepte candidatures spontanées',
			accessor: 'acceptsUnsolicited',
		},
		{ header: 'Domaines', accessor: 'domains' },
		{ header: 'Pays', accessor: 'countries' },
		{ header: 'Villes', accessor: 'cities' },
		{ header: 'Disponible', accessor: 'available' },
		{ header: 'Créé le', accessor: 'createdAt' },
		{ header: 'Mis à jour le', accessor: 'updatedAt' },
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

	const generatePageButtons = () => {
		const totalPagesCount = total; // This is now the actual number, not the function
		let pages: (number | string)[] = [];

		if (totalPagesCount <= 5) {
			pages = Array.from({ length: totalPagesCount }, (_, index) => index + 1);
		} else {
			if (currentPage <= 3) {
				pages = [1, 2, 3, 4, '...', totalPagesCount];
			} else if (currentPage >= totalPagesCount - 2) {
				pages = [
					1,
					'...',
					totalPagesCount - 3,
					totalPagesCount - 2,
					totalPagesCount - 1,
					totalPagesCount,
				];
			} else {
				pages = [
					1,
					'...',
					currentPage - 1,
					currentPage,
					currentPage + 1,
					'...',
					totalPagesCount,
				];
			}
		}

		return pages;
	};

	const currentItems = useMemo(() => {
		return paginate({ items: filteredCompanies });
	}, [paginate, filteredCompanies]);

	const total = useMemo(() => {
		return totalPages({ items: filteredCompanies });
	}, [totalPages, filteredCompanies]);

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
				data={currentItems.map((company) => ({
					...company,
					createdAt: formatDate(company.created_at),
					updatedAt: formatDate(company.updated_at),
					domains: company.domains?.join(', ') || '',
					countries: company.countries?.join(', ') || '',
					cities: company.cities?.join(', ') || '',
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
			<div className='pagination-controls'>
				<Button
					className='pagination-button'
					variant='contained'
					onClick={prevPage}
					disabled={currentPage === 1}>
					<Icon icon='mingcute:arrow-left-fill' />
				</Button>
				{generatePageButtons().map((page, index) =>
					typeof page === 'number' ? (
						<Button
							key={index}
							className={
								currentPage === page
									? 'highlighted-button'
									: 'pagination-button'
							}
							variant='contained'
							onClick={() => goToPage(page)}>
							{page.toString()}
						</Button>
					) : (
						<Button
							key={index}
							className='pagination-button'
							variant='contained'
							disabled
							style={{ cursor: 'default' }}>
							{page.toString()}
						</Button>
					)
				)}
				<Button
					className='pagination-button'
					variant='contained'
					onClick={nextPage}
					disabled={currentPage === total}>
					<Icon icon='mingcute:arrow-right-fill' />
				</Button>
			</div>
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
