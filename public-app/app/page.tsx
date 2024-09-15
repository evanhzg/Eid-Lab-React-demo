'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';

import { useOffers, Offer } from '../hooks/useOffers';
import Link from 'next/link';
import './styles/homepage.css';
import Card from './components/Card';
import Input from './components/Input';
import Button, { SendButton } from './components/Button';

const OfferCard: React.FC<{ offer: Offer }> = ({ offer }) => (
	<Card
		className='offer-card'
		title={offer.title}>
		<div className='offer-content'>
			<div className='offer-informations-container'>
				<div className='offer-informations-group'>
					<div className='offer-informations'>
						<Icon icon='mdi:tie' /> <p>{offer.company.name}</p>
					</div>

					<div className='offer-informations'>
						{/* domain */}
						<Icon icon='mdi:domain' /> <p>{offer.domain ?? 'Informatique'}</p>
					</div>

					<div className='offer-informations'>
						<Icon icon='mdi:file-document-outline' />
						<p>
							{offer.contractType ?? 'Durée indéfinie'}
							{offer.startDate &&
							offer.endDate &&
							offer.endDate > offer.startDate
								? `${Math.ceil(
										(new Date(offer.endDate).getTime() -
											new Date(offer.startDate).getTime()) /
											(1000 * 60 * 60 * 24 * 30)
								  )} mois`
								: ''}
						</p>
					</div>
				</div>

				<div className='offer-informations-group'>
					<div className='offer-informations'>
						<Icon icon='mdi:location' /> <p>{offer.location}</p>
					</div>
					<div className='offer-informations'>
						<Icon icon='mdi:calendar-range' />
						<p>
							{offer.startDate
								? new Date(offer.startDate).toLocaleDateString('fr-FR', {
										day: '2-digit',
										month: '2-digit',
										year: 'numeric',
								  })
								: 'N/A'}
						</p>
					</div>
					{offer.salary && (
						<div className='offer-informations'>
							<Icon icon='mingcute:pig-money-fill' />
							<p>{offer.salary}€ / mois*</p>
						</div>
					)}
				</div>
			</div>
			{offer.short_description && (
				<div className='offer-description'>
					<Icon icon='mingcute:pig-money-fill' />

					<p>{offer.short_description}</p>
				</div>
			)}
		</div>
		<Link
			className='card-link'
			href={`/offers/${offer._id}`}>
			View Details
		</Link>
	</Card>
);

const OfferFilter: React.FC<{
	onFilterChange: (filters: Record<string, string>) => void;
}> = ({ onFilterChange }) => {
	const [filters, setFilters] = useState({ location: '', salary: '' });

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFilters((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onFilterChange(filters);
	};

	return (
		<form onSubmit={handleSubmit}>
			<Input
				type='text'
				label='Location ?'
				name='location'
				value={filters.location}
				onChange={handleChange}
			/>
			<Input
				type='text'
				label='Min. Salary ?'
				name='salary'
				value={filters.salary}
				onChange={handleChange}
			/>
			<Button type='submit'>Apply</Button>
		</form>
	);
};

export default function Home() {
	const { offers, loading, error, setParams } = useOffers();
	const [theme, setTheme] = useState('light');

	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
	};

	useEffect(() => {
		document.body.setAttribute('data-theme', theme);
	}, [theme]);

	const handleFilterChange = (filters: Record<string, string>) => {
		setParams(filters);
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<main>
			<Button onClick={toggleTheme}>
				{theme === 'light' ? (
					<Icon
						icon='line-md:moon-filled-alt-to-sunny-filled-loop-transition'
						style={{ fontSize: '1.5em' }}
						color='var(--highlight-color)'
					/>
				) : (
					<Icon
						icon='line-md:moon-rising-filled-loop'
						style={{ fontSize: '1.5em' }}
						color='var(--info-color)'
					/>
				)}
			</Button>
			<OfferFilter onFilterChange={handleFilterChange} />
			<div className='offer-grid'>
				{offers.map((offer) => (
					<OfferCard
						key={offer._id}
						offer={offer}
					/>
				))}
			</div>
		</main>
	);
}
