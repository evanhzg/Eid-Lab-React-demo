import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import './ResizableTable.css';
import { Icon } from '@iconify/react/dist/iconify.js';

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
	requestSort: (key: T) => void;
	sortConfig: SortConfig;
}

const ResizableTable: React.FC<ResizableTableProps<any>> = ({
	columns,
	data,
	renderActions,
	requestSort,
	sortConfig,
}) => {
	const tableRef = React.useRef<HTMLDivElement>(null);
	const [colWidths, setColWidths] = React.useState(
		columns.map((col) => col.width)
	);

	const getSortIndicator = (column: string) => {
		if (sortConfig.key === column) {
			return sortConfig.direction === 'asc' ? (
				<Icon icon='mingcute:az-sort-ascending-letters-fill' />
			) : (
				<Icon icon='mingcute:az-sort-descending-letters-fill' />
			);
		}
		return '';
	};

	const renderCellContent = (row: any, accessor: string) => {
		if (typeof row[accessor] === 'boolean') {
			return row[accessor] ? 'OUI' : 'NON';
		}
		return row[accessor];
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
								onClick={() => requestSort(col.accessor)}>
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
					{data.map((row, rowIndex) => (
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
