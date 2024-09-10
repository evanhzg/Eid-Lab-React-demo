import React, { useState, useEffect, useCallback } from 'react';
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

const Offers: React.FC = () => {
	const [offers, setOffers] = useState<Offer[]>([]);
	const [companies, setCompanies] = useState<Company[]>([]);
	const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

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
				await updateOffer(offerData._id, offerData);
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
				onClick={() => handleDeleteOffer(offer._id!)}
				icon='mdi:file-document-remove'
				color='var(--error-color)'
				style={{ cursor: 'pointer' }}
			/>
		</div>
	);

	const columns: Column<Offer>[] = [
		{ header: 'Titre', accessor: 'title', width: 170 },
		{
			header: 'Entreprise',
			accessor: 'company',
			width: 100,
			cell: (value: ObjectId | { _id: ObjectId; name: string }) =>
				getCompanyName(value),
		},
		{ header: 'Type', accessor: 'contractType', width: 170 },
		{ header: 'Lieu', accessor: 'location', width: 170 },
		{
			header: 'Statut',
			accessor: 'available',
			width: 100,
		},
	];

	return (
		<div className='offers-container'>
			<div className='offers-header'>
				<Typography
					variant='h4'
					component='h1'>
					Offres
				</Typography>
				<Button
					variant='contained'
					color='primary'
					onClick={() => handleOpenModal()}>
					<Icon icon='mdi:file-document-plus' />
				</Button>
			</div>
			<ResizableTable
				columns={columns}
				data={sortedOffers.map((offer) => ({
					...offer,
					created_at: formatDate(offer.created_at),
					updated_at: formatDate(offer.updated_at),
				}))}
				renderActions={renderActions}
				requestSort={requestSort}
				sortConfig={sortConfig}
			/>
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
