import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import ProfessionalModal from '../components/modals/ProfessionalModal.tsx';
import {
	Professional,
	Column,
	Company,
	ObjectId,
} from '../../shared/types/index.ts';
import {
	getProfessionals,
	createProfessional,
	updateProfessional,
	deleteProfessional,
} from '../../services/professionalService.ts';
import { getCompanies } from '../../services/companyService.ts';
import { useContext } from 'react';
import { AlertContext } from '../../App.tsx';
import { usePagination } from '../hooks/usePagination.tsx';
import Table from '../../shared/components/ui/Table.tsx';

const columns: Column<Professional>[] = [
	{
		header: 'Nom',
		accessor: 'last_name',
	},
	{
		header: 'Prénom',
		accessor: 'first_name',
	},
	{
		header: 'Email',
		accessor: 'email',
	},
	{
		header: 'Téléphone',
		accessor: 'phone',
	},
	{
		header: 'Entreprise',
		accessor: 'company',
		cell: (value: any) => value?.name || '',
	},
	{
		header: 'Poste',
		accessor: 'position',
	},
	{
		header: 'LinkedIn',
		accessor: 'linkedin',
	},
	{
		header: 'Statut',
		accessor: 'available',
	},
	{
		header: 'Créé le',
		accessor: 'created_at',
	},
	{
		header: 'Mis à jour le',
		accessor: 'updated_at',
	},
];

const Professionals = () => {
	const [professionals, setProfessionals] = useState<Professional[]>([]);
	const [companies, setCompanies] = useState<Company[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedProfessional, setSelectedProfessional] = useState<
		Professional | undefined
	>();
	const [sortConfig, setSortConfig] = useState<{
		key: string;
		direction: 'asc' | 'desc';
	} | null>(null);
	const addAlert = useContext(AlertContext);
	const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
	const [professionalToDelete, setProfessionalToDelete] = useState<
		string | null
	>(null);
	const {
		currentPage,
		itemsPerPage,
		goToPage,
		nextPage,
		prevPage,
		paginate,
		totalPages,
		setItemsPerPageCount,
	} = usePagination<Professional>(10);

	useEffect(() => {
		fetchProfessionals();
		fetchCompanies();
	}, []);

	const fetchProfessionals = async () => {
		try {
			const fetchedProfessionals = await getProfessionals();
			setProfessionals(fetchedProfessionals);
		} catch (error) {
			console.error('Error fetching professionals:', error);
			addAlert?.('Erreur lors de la récupération des professionnels', 'error');
		}
	};

	const fetchCompanies = async () => {
		try {
			const fetchedCompanies = await getCompanies();
			setCompanies(fetchedCompanies);
		} catch (error) {
			console.error('Error fetching companies:', error);
			addAlert?.('Erreur lors de la récupération des entreprises', 'error');
		}
	};

	const handleEdit = (id: ObjectId) => {
		const professional = professionals.find((p) => p._id?.equals(id));
		setSelectedProfessional(professional);
		setIsModalOpen(true);
	};

	const handleDelete = (id: ObjectId) => {
		setProfessionalToDelete(id.toString());
		setIsConfirmDialogOpen(true);
	};

	const confirmDelete = async () => {
		if (professionalToDelete) {
			try {
				await deleteProfessional(professionalToDelete);
				addAlert?.('Professionnel supprimé avec succès', 'success');
				fetchProfessionals();
			} catch (error) {
				console.error('Error deleting professional:', error);
				addAlert?.('Erreur lors de la suppression du professionnel', 'error');
			}
		}
		setIsConfirmDialogOpen(false);
		setProfessionalToDelete(null);
	};

	const handleSave = async (professional: Omit<Professional, '_id'>) => {
		try {
			if (selectedProfessional) {
				await updateProfessional(
					selectedProfessional._id!.toString(),
					professional
				);
				addAlert?.('Professionnel mis à jour avec succès', 'success');
			} else {
				await createProfessional(professional);
				addAlert?.('Professionnel créé avec succès', 'success');
			}
			setIsModalOpen(false);
			fetchProfessionals();
		} catch (error) {
			console.error('Error saving professional:', error);
			addAlert?.("Erreur lors de l'enregistrement du professionnel", 'error');
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

	const sortedProfessionals = useMemo(() => {
		let sortableProfessionals = [...professionals];
		if (sortConfig !== null) {
			sortableProfessionals.sort((a, b) => {
				if (
					a[sortConfig.key as keyof Professional] <
					b[sortConfig.key as keyof Professional]
				) {
					return sortConfig.direction === 'asc' ? -1 : 1;
				}
				if (
					a[sortConfig.key as keyof Professional] >
					b[sortConfig.key as keyof Professional]
				) {
					return sortConfig.direction === 'asc' ? 1 : -1;
				}
				return 0;
			});
		}
		return sortableProfessionals;
	}, [professionals, sortConfig]);

	const filteredProfessionals = useMemo(() => {
		return sortedProfessionals.filter((professional) =>
			Object.values(professional).some((value) =>
				value.toString().toLowerCase().includes(searchQuery.toLowerCase())
			)
		);
	}, [sortedProfessionals, searchQuery]);

	const currentItems = useMemo(() => {
		return paginate({ items: filteredProfessionals });
	}, [paginate, filteredProfessionals]);

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString('fr-FR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	const generatePageButtons = useCallback(() => {
		const totalPageCount = totalPages({ items: filteredProfessionals });
		const currentPageNumber = currentPage;
		const pageButtons = [];
		const maxButtons = 5;

		if (totalPageCount <= maxButtons) {
			for (let i = 1; i <= totalPageCount; i++) {
				pageButtons.push(i);
			}
		} else {
			if (currentPageNumber <= 3) {
				for (let i = 1; i <= 4; i++) {
					pageButtons.push(i);
				}
				pageButtons.push('...');
				pageButtons.push(totalPageCount);
			} else if (currentPageNumber >= totalPageCount - 2) {
				pageButtons.push(1);
				pageButtons.push('...');
				for (let i = totalPageCount - 3; i <= totalPageCount; i++) {
					pageButtons.push(i);
				}
			} else {
				pageButtons.push(1);
				pageButtons.push('...');
				for (let i = currentPageNumber - 1; i <= currentPageNumber + 1; i++) {
					pageButtons.push(i);
				}
				pageButtons.push('...');
				pageButtons.push(totalPageCount);
			}
		}

		return pageButtons;
	}, [currentPage, totalPages, filteredProfessionals]);

	const total = useMemo(() => {
		return totalPages({ items: filteredProfessionals });
	}, [totalPages, filteredProfessionals]);

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
						setSelectedProfessional(undefined);
						setIsModalOpen(true);
					}}>
					<Icon
						icon='mdi:account-plus'
						style={{ fontSize: '1.5em' }}
					/>
				</Button>
			</div>
			<Table
				columns={columns}
				data={currentItems.map((professional) => ({
					...professional,
					created_at: formatDate(professional.created_at),
					updated_at: formatDate(professional.updated_at),
					available: professional.available ? 'Disponible' : 'Indisponible',
					company: professional.company, // Pass the entire company object
				}))}
				renderActions={(row) => (
					<div className='action-buttons'>
						<Icon
							onClick={() => handleEdit(row._id!)}
							icon='mdi:account-edit'
							color='var(--success-color)'
							style={{ cursor: 'pointer' }}
						/>
						<Icon
							onClick={() => handleDelete(row._id!)}
							icon='mdi:account-remove'
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
			<ProfessionalModal
				open={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={handleSave}
				professional={selectedProfessional}
				companies={companies}
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
						Êtes-vous sûr de vouloir supprimer ce professionnel ? Cette action
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

export default Professionals;
