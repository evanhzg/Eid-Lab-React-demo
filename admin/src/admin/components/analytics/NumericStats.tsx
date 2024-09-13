import React from 'react';
import '../../styles/components/analytics/NumericStats.css';
import { NavLink } from 'react-router-dom';

interface Stat {
	route: string;
	label: string;
	sublabel: string;
	value: number;
	icon: string;
}

interface NumericStatsProps {
	stats: Stat[];
}

const NumericStats: React.FC<NumericStatsProps> = ({ stats }) => {
	return (
		<div className='numeric-stats'>
			{stats.map((stat, index) => (
				<NavLink
					to={stat.route}
					key={index}
					className='stat-item'>
					<div className='stat-icon'>{stat.icon}</div>
					<div className='stat-content'>
						<span className='stat-value'>{stat.value}</span>
						<span className='stat-label'>{stat.label}</span>
						<span className='stat-label'>{stat.sublabel}</span>
					</div>
				</NavLink>
			))}
		</div>
	);
};

export default NumericStats;
