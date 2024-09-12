import React, { useState, useEffect } from 'react';
import UserGraph from '../components/analytics/UserGraph';
import LatestCompanies from '../components/analytics/LatestCompanies';
import NumericStats from '../components/analytics/NumericStats';
import { getCompanies } from '../../services/companyService';
import { getOffers } from '../../services/offerService';
import { getStudents } from '../../services/studentService';
import { getProfessionals } from '../../services/professionalService';
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

				// Fetch students and professionals
				const students = await getStudents();
				const professionals = await getProfessionals();

				// Set numeric stats
				setNumericStats([
					{
						label: 'Total Users',
						sublabel: '(' + students.length + ' Students)',
						value: students.length + professionals.length,
						icon: '👥',
					},
					{ label: 'Active Offers', value: offers.length, icon: '📋' },
					{ label: 'Companies', value: companies.length, icon: '🏢' },
				]);

				// Calculate user data for the graph (last 5 days)
				const last5Days = [...Array(5)]
					.map((_, i) => {
						const date = new Date();
						date.setDate(date.getDate() - i);
						return date.toISOString().split('T')[0];
					})
					.reverse();

				const userGraphData = last5Days.map((date) => ({
					date,
					students: students.filter((s) => {
						// Ensure created_at is a Date object
						const createdAt = new Date(s.created_at);
						return createdAt.toISOString().startsWith(date);
					}).length,
					professionals: professionals.filter((p) => {
						// Ensure created_at is a Date object
						const createdAt = new Date(p.created_at);
						return createdAt.toISOString().startsWith(date);
					}).length,
				}));

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
