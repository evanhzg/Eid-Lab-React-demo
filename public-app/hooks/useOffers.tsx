import { useState, useEffect } from 'react';
import { fetchOffers } from '../lib/api';

export interface Offer {
	_id: string;
	title: string;
	company: string;
	location: string;
	description: string;
	salary: string;
	postedDate: string;
}

export const useOffers = (initialParams: Record<string, any> = {}) => {
	const [offers, setOffers] = useState<Offer[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [params, setParams] = useState(initialParams);

	useEffect(() => {
		const loadOffers = async () => {
			try {
				setLoading(true);
				const data = await fetchOffers(params);
				setOffers(data);
				setError(null);
			} catch (err) {
				setError('Failed to fetch offers');
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		loadOffers();
	}, [params]);

	return { offers, loading, error, setParams };
};
