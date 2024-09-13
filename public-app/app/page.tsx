'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';

import { useOffers, Offer } from '../hooks/useOffers';
import Link from 'next/link';
import './styles/homepage.css';
import Card from './components/Card';

const OfferCard: React.FC<{ offer: Offer }> = ({ offer }) => (
	<Card
		className='offer-card'
		title={offer.title}>
		<div className='offer-content'>
			<div className='offer-informations-container'>
				<div className='offer-informations'>
					<Icon icon='mdi:tie' /> <p>{offer.company.name}</p>
				</div>
				<div className='offer-informations'>
					<Icon icon='mdi:location' /> <p>{offer.location}</p>
				</div>
				{offer.salary && (
					<div className='offer-informations'>
						<Icon icon='mingcute:pig-money-fill' />{' '}
						<p>{offer.salary}€ / mois*</p>
					</div>
				)}
			</div>
			<p className='offer-description'>
				{offer.short_description || 'No description provided.'}
			</p>
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

	const [theme, setTheme] = useState('light');

	const toggleTheme = () => {
		setTheme((prevTheme: string) => (prevTheme === 'light' ? 'dark' : 'light'));
	};

	return (
		<>
			<button
				onClick={toggleTheme}
				className='theme-button'>
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
			</button>
			<form onSubmit={handleSubmit}>
				<input
					type='text'
					name='location'
					placeholder='Location'
					value={filters.location}
					onChange={handleChange}
				/>
				<input
					type='text'
					name='salary'
					placeholder='Minimum Salary'
					value={filters.salary}
					onChange={handleChange}
				/>
				<button type='submit'>Apply Filters</button>
			</form>
		</>
	);
};

export default function Home() {
	const { offers, loading, error, setParams } = useOffers();

	const handleFilterChange = (filters: Record<string, string>) => {
		setParams(filters);
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<main>
			<h1>Job Offers</h1>
			<OfferFilter onFilterChange={handleFilterChange} />
			<div>
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
