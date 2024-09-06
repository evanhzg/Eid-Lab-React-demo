import React, { useState, useRef } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import './ResizableTable.css';
import { Icon } from '@iconify/react/dist/iconify.js';

interface Student {
	_id?: string;
	numericId?: number;
	name: string;
	username: string;
	email: string;
	phone: string;
}

interface ResizableTableProps {
	columns: string[];
	data: Student[];
	sortConfig: { key: keyof Student; direction: 'asc' | 'desc' };
	requestSort: (key: keyof Student) => void;
	renderSortIcon: (key: keyof Student) => JSX.Element | null;
	handleEditModalShow: (studentId: string) => void;
	handleDeleteStudent: (student: Student) => void;
}

const ResizableTable: React.FC<ResizableTableProps> = ({
	columns,
	data,
	sortConfig,
	requestSort,
	renderSortIcon,
	handleEditModalShow,
	handleDeleteStudent,
}) => {
	const [colWidths, setColWidths] = useState(
		new Array(columns.length).fill(150)
	); // Default width of 150px for each column
	const tableRef = useRef(null);

	const handleMouseDown = (index: number) => (e: React.MouseEvent) => {
		const startX = e.clientX;
		const startWidth = colWidths[index];

		const handleMouseMove = (e: MouseEvent) => {
			const newWidth = Math.max(startWidth + e.clientX - startX, 50); // Minimum width of 50px
			setColWidths((prevWidths) => {
				const newWidths = [...prevWidths];
				newWidths[index] = newWidth;
				return newWidths;
			});
		};

		const handleMouseUp = () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	};

	const renderTooltip = (props: any) => (
		<Tooltip
			id='button-tooltip'
			{...props}>
			{props.text}
		</Tooltip>
	);

	return (
		<div
			className='resizable-table py-2'
			ref={tableRef}>
			<table className='table-fixed table-striped table-bordered table-hover'>
				<thead>
					<tr>
						{columns.map((col, index) => (
							<th
								key={index}
								style={{ width: `${colWidths[index]}px` }}
								className='student-select-none cursor-pointer'
								onClick={() => requestSort(col as keyof Student)}>
								{col} {renderSortIcon(col as keyof Student)}
								<div
									className='resizer'
									onMouseDown={handleMouseDown(index)}
								/>
							</th>
						))}
						<th className='action-buttons'>actions</th>
					</tr>
				</thead>
				<tbody>
					{data.map((student, rowIndex) => (
						<tr key={rowIndex}>
							{columns.map((col, colIndex) => (
								<td
									key={colIndex}
									style={{ width: `${colWidths[colIndex]}px` }}>
									<OverlayTrigger
										placement='top'
										overlay={renderTooltip({
											text: student[col as keyof Student],
										})}>
										<div className='ellipsis'>
											{student[col as keyof Student] !== undefined
												? student[col as keyof Student]
												: 'Loading...'}
										</div>
									</OverlayTrigger>
								</td>
							))}
							<td>
								<div className='d-flex justify-content-center gap-3'>
									<button
										onClick={() => handleEditModalShow(student)}
										className='bg-dark d-inline-flex p-1 align-items-center justify-content-center'
										style={{ width: '25px', height: '25px' }}>
										<Icon icon='iconamoon:edit-fill' />
									</button>
									<button
										onClick={() => handleDeleteStudent(student._id)}
										className='bg-danger d-inline-flex p-1 align-items-center justify-content-center'
										style={{ width: '25px', height: '25px' }}>
										<Icon icon='mdi:delete-off' />
									</button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ResizableTable;
