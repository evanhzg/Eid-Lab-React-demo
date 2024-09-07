import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import './ResizableTable.css';

interface Column {
	header: string;
	accessor: string;
	width: number;
}

interface ResizableTableProps {
	columns: Column[];
	data: any[];
	renderActions?: (row: any) => React.ReactNode;
}

const ResizableTable: React.FC<ResizableTableProps> = ({
	columns,
	data,
	renderActions,
}) => {
	const tableRef = React.useRef<HTMLDivElement>(null);
	const [colWidths, setColWidths] = React.useState(
		columns.map((col) => col.width)
	);

	return (
		<div
			className='table-container py-2'
			ref={tableRef}>
			<table className='table-fixed table-striped table-bordered table-hover'>
				<thead>
					<tr>
						{columns.map((col, index) => (
							<th
								key={index}
								style={{ width: `${colWidths[index]}px` }}>
								{col.header}
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
									{row[col.accessor]}
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
