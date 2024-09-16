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
	const roundedMax = Math.ceil(maxValue / 10) * 10;

	const getYAxisSteps = (max: number) => {
		const step = max > 50 ? 20 : 10;
		const steps = [];
		for (let i = 0; i <= max; i += step) {
			steps.push(i);
		}
		return steps.reverse();
	};

	const yAxisSteps = getYAxisSteps(roundedMax);

	const calculateBarHeight = (value: number) => (value / roundedMax) * 100;

	return (
		<div className='user-graph-container'>
			<div className='user-graph'>
				<div className='y-axis'>
					{yAxisSteps.map((step) => (
						<div
							key={step}
							className='y-axis-step'>
							<span className='y-axis-label'>{step}</span>
							<div className='x-axis-bar'></div>
						</div>
					))}
				</div>
				<div className='graph-bars-container'>
					{data.map((item, index) => (
						<div
							key={index}
							className='graph-bar-group'>
							<Tooltip
								content={
									<div className='tooltip-content'>
										<p>
											<strong>
												{new Date(item.date).toLocaleDateString('en-GB', {
													day: 'numeric',
													month: 'numeric',
												})}
											</strong>
										</p>
										<p>{item.students} Students</p>
									</div>
								}>
								<div
									className='bar students'
									style={{ height: `${calculateBarHeight(item.students)}%` }}
								/>
							</Tooltip>
							<Tooltip
								content={
									<div className='tooltip-content'>
										<p>
											<strong>
												{new Date(item.date).toLocaleDateString('en-GB', {
													day: 'numeric',
													month: 'numeric',
												})}
											</strong>
										</p>
										<p>{item.professionals} Professionals</p>
									</div>
								}>
								<div
									className='bar professionals'
									style={{
										height: `${calculateBarHeight(item.professionals)}%`,
									}}
								/>
							</Tooltip>
						</div>
					))}
				</div>
			</div>
			<div className='x-axis'>
				{data.map((item, index) => (
					<div
						key={index}
						className='x-axis-label'>
						{new Date(item.date).toLocaleDateString('en-GB', {
							day: 'numeric',
							month: 'numeric',
						})}
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
