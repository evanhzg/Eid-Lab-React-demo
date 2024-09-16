import React from 'react';
import '../../styles/components/analytics/LatestCompanies.css';
import { NavLink } from 'react-router-dom';

interface Company {
	id: string;
	name: string;
	joinedDate: string;
}

interface LatestCompaniesProps {
	companies: Company[];
}

const LatestCompanies: React.FC<LatestCompaniesProps> = ({ companies }) => {
	return (
		<div className='latest-companies'>
			<h3>Latest Companies</h3>
			<ul className='company-list'>
				{companies.map((company) => (
					<NavLink
						to={'/companies'}
						key={company.id}
						className='company-item'>
						<span className='company-name'>{company.name}</span>
						<span className='company-date'>{company.joinedDate}</span>
					</NavLink>
				))}
			</ul>
		</div>
	);
};

export default LatestCompanies;
