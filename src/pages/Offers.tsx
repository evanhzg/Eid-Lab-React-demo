import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	IconButton,
	Button,
	Typography,
	TextField,
} from '@mui/material';
import { Icon } from '@iconify/react';
import OfferModal from '../components/OfferModal';
import { Offer, Column, Company, ObjectId } from '../types';
import {
	getOffers,
	createOffer,
	updateOffer,
	deleteOffer,
} from '../services/offerService.ts';
import { getCompanies } from '../services/companyService.ts';
import '../styles/table.css';
import ResizableTable from '../components/ResizableTable';
import { useSortableData, formatDate } from '../utils/tableUtils.ts';
import { usePagination } from '../hooks/usePagination';

const Offers: React.FC = () => {
	const [offers, setOffers] = useState<Offer[]>([]);
	const [companies, setCompanies] = useState<Company[]>([]);
	const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const {
		currentPage,
		itemsPerPage,
		goToPage,
		nextPage,
		prevPage,
		paginate,
		totalPages,
		setItemsPerPageCount,
	} = usePagination<Offer>(10); // 10 is the initial items per page

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

	const {
		items: sortedOffers,
		requestSort,
		sortConfig,
	} = useSortableData<Offer>(offers);

	const fetchOffers = async () => {
		try {
			const fetchedOffers = await getOffers();
			setOffers(fetchedOffers);
		} catch (error) {
			console.error('Error fetching offers:', error);
		}
	};

	const fetchCompanies = async () => {
		try {
			const fetchedCompanies = await getCompanies();
			setCompanies(fetchedCompanies);
		} catch (error) {
			console.error('Error fetching companies:', error);
		}
	};

	useEffect(() => {
		fetchOffers();
		fetchCompanies();
	}, []);

	const getCompanyName = useCallback(
		(company: ObjectId | { _id: ObjectId; name: string }) => {
			if (typeof company === 'object' && 'name' in company) {
				return company.name;
			}
			const foundCompany = companies.find(
				(c) => c._id.toString() === company.toString()
			);
			return foundCompany ? foundCompany.name : 'Unknown Company';
		},
		[companies]
	);

	const handleOpenModal = (offer?: Offer) => {
		setSelectedOffer(offer || null);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setSelectedOffer(null);
		setIsModalOpen(false);
	};

	const handleSaveOffer = async (offerData: Omit<Offer, '_id'> | Offer) => {
		try {
			if ('_id' in offerData) {
				await updateOffer(offerData._id?.toString()!, offerData);
			} else {
				await createOffer(offerData);
			}
			fetchOffers();
			handleCloseModal();
		} catch (error) {
			console.error('Error saving offer:', error);
		}
	};

	const handleDeleteOffer = async (id: string) => {
		try {
			await deleteOffer(id);
			fetchOffers();
		} catch (error) {
			console.error('Error deleting offer:', error);
		}
	};

	const handleEditOffer = (offer: Offer) => {
		setSelectedOffer(offer);
		setIsModalOpen(true);
	};

	const renderActions = (offer: Offer) => (
		<div className='action-buttons'>
			<Icon
				onClick={() => handleEditOffer(offer)}
				icon='mdi:file-document-refresh'
				color='var(--success-color)'
				style={{ cursor: 'pointer' }}
			/>
			<Icon
				onClick={() => handleDeleteOffer(offer._id?.toString()!)}
				icon='mdi:file-document-remove'
				color='var(--error-color)'
				style={{ cursor: 'pointer' }}
			/>
		</div>
	);

	const columns: Column<Offer>[] = [
		{ header: 'Titre', accessor: 'title' },
		{
			header: 'Entreprise',
			accessor: 'company',
			cell: (value: ObjectId | { _id: ObjectId; name: string }) =>
				getCompanyName(value),
		},
		{ header: 'Type', accessor: 'contractType' },
		{ header: 'Lieu', accessor: 'location' },
		{
			header: 'Statut',
			accessor: 'available',
		},
	];

	const filteredOffers = useMemo(() => {
		return sortedOffers.filter((offer) =>
			Object.values(offer).some((value) =>
				value.toString().toLowerCase().includes(searchQuery.toLowerCase())
			)
		);
	}, [sortedOffers, searchQuery]);

	const currentItems = useMemo(() => {
		return paginate({ items: filteredOffers });
	}, [paginate, filteredOffers]);

	const total = useMemo(() => {
		return totalPages({ items: filteredOffers });
	}, [totalPages, filteredOffers]);

	return (
		<div className='offers-container'>
			<div className='offers-header'>
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
						onClick={() => handleOpenModal()}>
						<Icon
							icon='mdi:file-document-plus'
							style={{ fontSize: '1.5em' }}
						/>
					</Button>
				</div>
			</div>
			<ResizableTable
				columns={columns}
				data={currentItems.map((offer) => ({
					...offer,
					created_at: formatDate(offer.created_at),
					updated_at: formatDate(offer.updated_at),
				}))}
				renderActions={renderActions}
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
			<OfferModal
				open={isModalOpen}
				onClose={handleCloseModal}
				onSave={handleSaveOffer}
				offer={selectedOffer || undefined}
			/>
		</div>
	);
};

export default Offers;
