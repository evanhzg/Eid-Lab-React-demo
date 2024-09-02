import React, { useState, useRef } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import './ResizableTable.css';
import { Icon } from '@iconify/react/dist/iconify.js';

interface User {
	_id?: string;
	numericId?: number;
	name: string;
	username: string;
	email: string;
	phone: string;
}

interface ResizableTableProps {
	columns: string[];
	data: User[];
	sortConfig: { key: keyof User; direction: 'asc' | 'desc' };
	requestSort: (key: keyof User) => void;
	renderSortIcon: (key: keyof User) => JSX.Element | null;
	handleEditModalShow: (userId: string) => void;
	handleDeleteUser: (user: User) => void;
}

const ResizableTable: React.FC<ResizableTableProps> = ({
	columns,
	data,
	sortConfig,
	requestSort,
	renderSortIcon,
	handleEditModalShow,
	handleDeleteUser,
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
			className='resizable-table'
			ref={tableRef}>
			<table className='table-fixed table-striped table-bordered table-hover'>
				<thead>
					<tr>
						{columns.map((col, index) => (
							<th
								key={index}
								style={{ width: `${colWidths[index]}px` }}
								className='user-select-none cursor-pointer'
								onClick={() => requestSort(col as keyof User)}>
								{col} {renderSortIcon(col as keyof User)}
								<div
									className='resizer'
									onMouseDown={handleMouseDown(index)}
								/>
							</th>
						))}
						<th>actions</th>
					</tr>
				</thead>
				<tbody>
					{data.map((user, rowIndex) => (
						<tr key={rowIndex}>
							{columns.map((col, colIndex) => (
								<td
									key={colIndex}
									style={{ width: `${colWidths[colIndex]}px` }}>
									<OverlayTrigger
										placement='top'
										overlay={renderTooltip({
											text: user[col as keyof User],
										})}>
										<div className='ellipsis'>
											{user[col as keyof User] !== undefined
												? user[col as keyof User]
												: 'Loading...'}
										</div>
									</OverlayTrigger>
								</td>
							))}
							<td className='d-flex justify-content-evenly'>
								<button
									onClick={() => handleEditModalShow(user)}
									className='bg-dark d-inline-flex p-1 align-items-center justify-content-center'
									style={{ width: '40px', height: '40px' }}>
									<Icon icon='iconamoon:edit-fill' />
								</button>
								<button
									onClick={() => handleDeleteUser(user._id)}
									className='bg-danger d-inline-flex p-1 align-items-center justify-content-center'
									style={{ width: '40px', height: '40px' }}>
									<Icon icon='mdi:delete-off' />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ResizableTable;
