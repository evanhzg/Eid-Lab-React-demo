'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';

import { useOffers, Offer } from '../../hooks/useOffers';
import Link from 'next/link';
import './styles.css';
import Card from '../components/Card';
import Input from '../components/Input';
import Sparkles from '../components/Sparkles';
import Button from '../components/Button';
import RangeSlider from '../components/RangeSlider';

const OfferCard: React.FC<{ offer: Offer }> = ({ offer }) => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<Card
			className='offer-card'
			title={offer.title}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}>
			<Sparkles isHovered={isHovered} />

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
};

const OfferFilter: React.FC<{
	onFilterChange: (filters: Record<string, string | number>) => void;
	onSearchChange: (searchTerm: string) => void;
	minSalary: number;
	maxSalary: number;
}> = ({ onFilterChange, onSearchChange, minSalary, maxSalary }) => {
	const [filters, setFilters] = useState({
		location: '',
		minSalary: 0,
		maxSalary: 4000,
	});
	const [searchTerm, setSearchTerm] = useState('');

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFilters((prev) => ({ ...prev, [name]: value }));
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setSearchTerm(value);
		onSearchChange(value);
	};

	const handleSalaryChange = (values: [number, number]) => {
		setFilters((prev) => ({
			...prev,
			minSalary: values[0],
			maxSalary: values[1],
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onFilterChange(filters);
	};

	return (
		<div className='search-container'>
			<Input
				className='searchbar'
				type='text'
				label='Search...'
				name='search'
				value={searchTerm}
				onChange={handleSearchChange}
			/>
			<form onSubmit={handleSubmit}>
				<Input
					type='text'
					label='Location ?'
					name='location'
					value={filters.location}
					onChange={handleChange}
				/>
				<RangeSlider
					min={0}
					max={4000}
					step={100}
					values={[filters.minSalary, filters.maxSalary]}
					onChange={handleSalaryChange}
				/>
			</form>
		</div>
	);
};

const getSalaryRange = (offers: Offer[]): [number, number] => {
	if (offers.length === 0) return [0, 0];

	const salaries = offers
		.map((offer) => offer.salary)
		.filter(
			(salary): salary is number => salary !== undefined && salary !== null
		)
		.sort((a, b) => a - b);

	return [salaries[0], salaries[salaries.length - 1]];
};

export default function Home() {
	const { offers, loading, error, setParams } = useOffers();
	const [theme, setTheme] = useState('light');
	const [searchTerm, setSearchTerm] = useState('');
	const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 4000]);

	useEffect(() => {
		if (offers.length > 0) {
			setSalaryRange(getSalaryRange(offers));
		}
	}, [offers]);

	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
	};

	useEffect(() => {
		document.body.setAttribute('data-theme', theme);
	}, [theme]);

	const handleFilterChange = (filters: Record<string, string>) => {
		setParams(filters);
	};

	const handleSearchChange = (searchTerm: string) => {
		setSearchTerm(searchTerm);
	};

	const filteredOffers = offers.filter(
		(offer) =>
			offer.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			offer.title.toLowerCase().includes(searchTerm.toLowerCase())
	);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div className='container offers-page'>
			<div className='page-content'>
				<Button
					className='theme-button'
					onClick={toggleTheme}>
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
				<OfferFilter
					onFilterChange={handleFilterChange}
					onSearchChange={handleSearchChange}
					minSalary={120}
					maxSalary={650}
				/>
				<div className='offer-grid'>
					{filteredOffers.map((offer) => (
						<OfferCard
							key={offer._id}
							offer={offer}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
