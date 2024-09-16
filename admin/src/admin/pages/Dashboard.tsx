import React, { useState, useEffect } from 'react';
import UserGraph from '../components/analytics/UserGraph.tsx';
import LatestCompanies from '../components/analytics/LatestCompanies.tsx';
import NumericStats from '../components/analytics/NumericStats.tsx';
import { getCompanies } from '../../services/companyService.ts';
import { getOffers } from '../../services/offerService.ts';
import { getStudents } from '../../services/studentService.ts';
import { getProfessionals } from '../../services/professionalService.ts';
import '../styles/pages/Dashboard.css';

import { ObjectId } from '../../shared/types/index.ts';

interface LatestCompany {
	id: ObjectId;
	name: string;
	joinedDate: string;
}

interface NumericStat {
	label: string;
	sublabel: string;
	value: number;
	icon: string;
	route: string;
}

interface UserDataPoint {
	date: string;
	students: number;
	professionals: number;
}

const Dashboard: React.FC = () => {
	const [userData, setUserData] = useState<UserDataPoint[]>([]);
	const [latestCompanies, setLatestCompanies] = useState<LatestCompany[]>([]);
	const [numericStats, setNumericStats] = useState<NumericStat[]>([]);

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				// Fetch companies
				const companies = await getCompanies();
				const latestCompaniesData = companies.slice(0, 5).map((company) => ({
					id: company._id,
					name: company.name,
					joinedDate: new Date(company.created_at).toLocaleDateString(),
				}));
				setLatestCompanies(latestCompaniesData);

				// Fetch offers
				const offers = await getOffers();
				const offersThisWeek = offers.filter((offer) => {
					const offerDate = new Date(offer.created_at);
					const today = new Date();
					const oneWeekAgo = new Date(
						today.getTime() - 7 * 24 * 60 * 60 * 1000
					);
					return offerDate >= oneWeekAgo && offerDate <= today;
				}).length;

				// Calculate companies with at least one offer
				const companiesWithOffers = new Set(
					offers
						.filter((offer) => offer.company.name)
						.map((offer) => offer.company.name)
				);
				console.log(companiesWithOffers);
				const companiesWithOffersCount = companiesWithOffers.size;

				// Fetch students and professionals
				const students = await getStudents();
				const professionals = await getProfessionals();

				console.log('Fetched students:', students);
				console.log('Fetched professionals:', professionals);

				// Set numeric stats
				setNumericStats([
					{
						label: 'Total Users',
						sublabel: '(' + students.length + ' Students)',
						value: students.length + professionals.length,
						icon: '👥',
						route: '/users',
					},
					{
						label: 'Active Offers',
						sublabel: `(${offersThisWeek} this week)`,
						value: offersThisWeek,
						icon: '📋',
						route: '/offers',
					},
					{
						label: 'Companies',
						sublabel: `(${companiesWithOffersCount} with active offers)`,
						value: companies.length,
						icon: '🏢',
						route: '/companies',
					},
				]);

				// Calculate user data for the graph (last 5 days)
				const last5Days = [...Array(5)]
					.map((_, i) => {
						const date = new Date();
						date.setDate(date.getDate() - i);
						return date.toISOString().split('T')[0];
					})
					.reverse();

				console.log('Last 5 days:', last5Days);

				const userGraphData = last5Days.map((date) => {
					console.log(`Processing date: ${date}`);

					const studentsCount = students.filter((s) => {
						const createdDate = new Date(s.created_at);
						const matches = createdDate.toISOString().split('T')[0] === date;
						console.log(
							`Student ${s._id} created_at: ${s.created_at}, matches: ${matches}`
						);
						return matches;
					}).length;

					const professionalsCount = professionals.filter((p) => {
						const createdDate = new Date(p.created_at);
						const matches = createdDate.toISOString().split('T')[0] === date;
						console.log(
							`Professional ${p._id} created_at: ${p.created_at}, matches: ${matches}`
						);
						return matches;
					}).length;

					console.log(
						`Date: ${date}, Students: ${studentsCount}, Professionals: ${professionalsCount}`
					);

					return {
						date,
						students: studentsCount,
						professionals: professionalsCount,
					};
				});

				console.log('Final userGraphData:', userGraphData);

				setUserData(userGraphData);
			} catch (error) {
				console.error('Error fetching dashboard data:', error);
			}
		};

		fetchDashboardData();
	}, []);

	return (
		<div className='dashboard'>
			<div className='dashboard-grid'>
				<div className='dashboard-item wide'>
					<UserGraph data={userData} />
				</div>
				<div className='dashboard-item'>
					<LatestCompanies companies={latestCompanies} />
				</div>
				<div className='dashboard-item wide'>
					<NumericStats stats={numericStats} />
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
