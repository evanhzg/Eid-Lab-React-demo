import React from 'react';
import '../../styles/components/UserGraph.css';

interface UserData {
	date: string;
	students: number;
	professionals: number;
}

interface UserGraphProps {
	data: UserData[];
}

const UserGraph: React.FC<UserGraphProps> = ({ data }) => {
	const maxValue = Math.max(
		...data.flatMap((d) => [d.students, d.professionals])
	);

	return (
		<div className='user-graph'>
			<h3>New Users</h3>
			<div className='graph-container'>
				{data.map((item, index) => (
					<div
						key={index}
						className='graph-bar'>
						<div
							className='bar students'
							style={{ height: `${(item.students / maxValue) * 100}%` }}></div>
						<div
							className='bar professionals'
							style={{
								height: `${(item.professionals / maxValue) * 100}%`,
							}}></div>
						<span className='date-label'>{item.date}</span>
					</div>
				))}
			</div>
			<div className='legend'>
				<div className='legend-item'>
					<div className='legend-color students'></div>
					<span>Students</span>
				</div>
				<div className='legend-item'>
					<div className='legend-color professionals'></div>
					<span>Professionals</span>
				</div>
			</div>
		</div>
	);
};

export default UserGraph;
