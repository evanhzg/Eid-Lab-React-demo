import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/ui/Table.css';
import { Icon } from '@iconify/react';

interface Column<T> {
	header: string;
	accessor: keyof T;
	width: number;
	cell?: (value: any) => React.ReactNode;
}

interface SortConfig {
	key: string;
	direction: 'asc' | 'desc';
}

interface TableProps<T> {
	columns: Column<T>[];
	data: T[];
	renderActions?: (row: T) => React.ReactNode;
	requestSort?: (key: keyof T) => void;
	sortConfig?: SortConfig | null;
}

const Table = <T extends Record<string, any>>({
	columns,
	data,
	renderActions,
	requestSort,
	sortConfig: externalSortConfig,
}: TableProps<T>) => {
	const tableRef = React.useRef<HTMLDivElement>(null);
	const [colWidths, setColWidths] = useState(columns.map((col) => col.width));
	const [sortedData, setSortedData] = useState(data);
	const [internalSortConfig, setInternalSortConfig] =
		useState<SortConfig | null>(null);

	const activeSortConfig = externalSortConfig || internalSortConfig;

	useEffect(() => {
		if (activeSortConfig?.key) {
			const sorted = [...data].sort((a, b) => {
				if (a[activeSortConfig.key] < b[activeSortConfig.key]) {
					return activeSortConfig.direction === 'asc' ? -1 : 1;
				}
				if (a[activeSortConfig.key] > b[activeSortConfig.key]) {
					return activeSortConfig.direction === 'asc' ? 1 : -1;
				}
				return 0;
			});
			setSortedData(sorted);
		} else {
			setSortedData(data);
		}
	}, [data, activeSortConfig]);

	const handleSort = useCallback(
		(key: keyof T) => {
			if (requestSort) {
				requestSort(key);
			} else {
				const direction =
					internalSortConfig?.key === key &&
					internalSortConfig.direction === 'asc'
						? 'desc'
						: 'asc';
				setInternalSortConfig({ key: key as string, direction });
			}
		},
		[internalSortConfig, requestSort]
	);

	const getSortIndicator = useCallback(
		(columnAccessor: keyof T) => {
			if (activeSortConfig?.key === columnAccessor) {
				return (
					<Icon
						icon={
							activeSortConfig.direction === 'asc'
								? 'mdi:sort-ascending'
								: 'mdi:sort-descending'
						}
						width='20'
						height='20'
					/>
				);
			}
			return null;
		},
		[activeSortConfig]
	);

	const renderCellContent = useCallback(
		(row: T, accessor: keyof T, cell?: (value: any) => React.ReactNode) => {
			const value = row[accessor];
			if (cell) {
				return cell(value);
			}
			if (typeof value === 'boolean') {
				return (
					<Icon
						icon={value ? 'fluent:checkmark-12-filled' : 'mingcute:close-fill'}
						color={value ? 'var(--success-color)' : 'var(--error-color)'}
						width='24'
						height='24'
					/>
				);
			}
			return value as React.ReactNode;
		},
		[]
	);

	return (
		<div
			className='table-container'
			ref={tableRef}>
			<table>
				<thead>
					<tr>
						{renderActions && <th>Actions</th>}

						{columns.map((col, index) => (
							<th
								key={index}
								onClick={() => handleSort(col.accessor)}>
								<div className='th-children'>
									<p>{col.header}</p>
									{getSortIndicator(col.accessor)}
								</div>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{sortedData.map((row, rowIndex) => (
						<tr key={rowIndex}>
							{renderActions && <td>{renderActions(row)}</td>}
							{columns.map((col, colIndex) => (
								<td key={colIndex}>
									{col.cell
										? col.cell(row[col.accessor])
										: renderCellContent(row, col.accessor, col.cell)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Table;
