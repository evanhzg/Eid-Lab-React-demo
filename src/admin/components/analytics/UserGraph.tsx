import React from 'react';
import '../../styles/components/analytics/UserGraph.css';
import Tooltip from '../../../shared/components/ui/Tooltip';

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
			<div className='graph-container'>
				{data.map((item, index) => (
					<div
						key={index}
						className='graph-bar'>
						<div className='bar-wrapper'>
							<div
								className='bar students'
								style={{
									height: `${(item.students / maxValue) * 100}%`,
								}}>
								<Tooltip
									content={
										<div>
											<p>
												<strong>Date:</strong> {item.date}
											</p>
											<p>
												<strong>Students:</strong> {item.students}
											</p>
											<p>
												<strong>Professionals:</strong> {item.professionals}
											</p>
										</div>
									}
								/>
							</div>
							<div
								className='bar professionals'
								style={{
									height: `${(item.professionals / maxValue) * 100}%`,
								}}>
								<Tooltip
									content={
										<div>
											<p>
												<strong>Date:</strong> {item.date}
											</p>
											<p>
												<strong>Students:</strong> {item.students}
											</p>
											<p>
												<strong>Professionals:</strong> {item.professionals}
											</p>
										</div>
									}
								/>
							</div>
						</div>
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
