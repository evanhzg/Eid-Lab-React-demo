import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { Icon } from '@iconify/react';

interface Column {
	header: string;
	accessor: string;
	width: number;
}

interface SortConfig {
	key: string;
	direction: 'asc' | 'desc';
}

interface ResizableTableProps<T> {
	columns: Column[];
	data: any[];
	renderActions?: (row: any) => React.ReactNode;
	requestSort?: (key: keyof T) => void;
	sortConfig?: SortConfig | null;
}

const ResizableTable = <T extends object>({
	columns,
	data,
	renderActions,
	requestSort,
	sortConfig: initialSortConfig,
}: ResizableTableProps<T>) => {
	const tableRef = React.useRef<HTMLDivElement>(null);
	const [colWidths, setColWidths] = React.useState(
		columns.map((col) => col.width)
	);
	const [sortedData, setSortedData] = useState(data);
	const [sortConfig, setSortConfig] = useState<SortConfig | null>(initialSortConfig || null);

	useEffect(() => {
		if (sortConfig?.key) {
			const sorted = [...data].sort((a, b) => {
				if (a[sortConfig.key] < b[sortConfig.key]) {
					return sortConfig.direction === 'asc' ? -1 : 1;
				}
				if (a[sortConfig?.key] > b[sortConfig?.key]) {
					return sortConfig.direction === 'asc' ? 1 : -1;
				}
				return 0;
			});
			setSortedData(sorted);
		} else {	
			setSortedData(data);
		}
	}, [data, sortConfig]);

	const getSortIndicator = (column: string) => {
		// Check if the column data type is boolean
		const isBooleanColumn =
			sortedData.length > 0 && typeof sortedData[0][column] === 'boolean';

		if (sortConfig?.key === column) {
			if (isBooleanColumn) {
				return sortConfig?.direction === 'asc' ? (
					<Icon icon='mdi:order-bool-descending' />
				) : (
					<Icon icon='mdi:order-bool-ascending' />
				);
			} else {
				return sortConfig?.direction === 'asc' ? (
					<Icon icon='mingcute:az-sort-ascending-letters-fill' />
				) : (
					<Icon icon='mingcute:az-sort-descending-letters-fill' />
				);
			}
		}
		return '';
	};

	const renderCellContent = (row: any, accessor: string) => {
		if (typeof row[accessor] === 'boolean') {
			return row[accessor] ? (
				<Icon
					icon='mingcute:check-fill'
					color='var(--success-color)'
				/>
			) : (
				<Icon
					icon='mingcute:close-fill'
					color='var(--error-color)'
				/>
			);
		}
		return row[accessor];
	};

	const handleSort = (column: string) => {
		const newDirection =
			sortConfig?.key === column && sortConfig?.direction === 'asc'
				? 'desc'
				: 'asc';
		setSortConfig({ key: column, direction: newDirection });

		const sorted = [...sortedData].sort((a, b) => {
			if (typeof a[column] === 'boolean' && typeof b[column] === 'boolean') {
				return newDirection === 'asc'
					? a[column] === b[column]
						? 0
						: a[column]
						? -1
						: 1
					: a[column] === b[column]
					? 0
					: a[column]
					? 1
					: -1;
			}
			if (a[column] < b[column]) {
				return newDirection === 'asc' ? -1 : 1;
			}
			if (a[column] > b[column]) {
				return newDirection === 'asc' ? 1 : -1;
			}
			return 0;
		});

		setSortedData(sorted);
	};

	return (
		<div
			className='table-container'
			ref={tableRef}>
			<table>
				<thead>
					<tr>
						{columns.map((col, index) => (
							<th
								key={index}
								style={{ width: `${colWidths[index]}px` }}
								onClick={() => handleSort(col.accessor)}>
								<div className='th-children'>
									<p>{col.header}</p>
									{getSortIndicator(col.accessor)}
								</div>
							</th>
						))}
						{renderActions && <th style={{ width: '150px' }}>Actions</th>}
					</tr>
				</thead>
				<tbody>
					{sortedData.map((row, rowIndex) => (
						<tr key={rowIndex}>
							{columns.map((col, colIndex) => (
								<td
									key={colIndex}
									style={{ width: `${colWidths[colIndex]}px` }}>
									{renderCellContent(row, col.accessor)}
								</td>
							))}
							{renderActions && (
								<td style={{ width: '150px' }}>{renderActions(row)}</td>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ResizableTable;
