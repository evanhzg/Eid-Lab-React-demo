'use client';

import React, { useState } from 'react';
import { useOffers, Offer } from '../hooks/useOffers';
import Link from 'next/link';

const OfferCard: React.FC<{ offer: Offer }> = ({ offer }) => (
	<div className='bg-white shadow-md rounded-lg p-6 mb-4'>
		<h2 className='text-xl font-bold mb-2'>{offer.title}</h2>
		<p className='text-gray-600 mb-2'>{offer.company.name}</p>
		<p className='text-gray-600 mb-2'>{offer.location}</p>
		<p className='text-gray-600 mb-4'>{offer.salary}</p>
		<Link
			href={`/offers/${offer._id}`}
			className='text-blue-500 hover:underline'>
			View Details
		</Link>
	</div>
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
		<form
			onSubmit={handleSubmit}
			className='mb-8'>
			<input
				type='text'
				name='location'
				placeholder='Location'
				value={filters.location}
				onChange={handleChange}
				className='border p-2 mr-2'
			/>
			<input
				type='text'
				name='salary'
				placeholder='Minimum Salary'
				value={filters.salary}
				onChange={handleChange}
				className='border p-2 mr-2'
			/>
			<button
				type='submit'
				className='bg-blue-500 text-white p-2 rounded'>
				Apply Filters
			</button>
		</form>
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
		<main className='container mx-auto px-4 py-8'>
			<h1 className='text-3xl font-bold mb-8'>Job Offers</h1>
			<OfferFilter onFilterChange={handleFilterChange} />
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
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
