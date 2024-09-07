import React, { useRef, useState, useEffect } from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import './ResizableTable.css';

interface Column {
	header: string;
	accessor: string;
	width: number;
}

interface ResizableTableProps<T> {
	columns: Column[];
	data: T[];
}

const ResizableTable = <T,>({ columns, data }: ResizableTableProps<T>) => {
	const tableRef = useRef<HTMLDivElement>(null);
	const [colWidths, setColWidths] = useState(columns.map((col) => col.width));

	const renderTooltip = (props: any) => (
		<Tooltip
			id='button-tooltip'
			{...props}>
			{props.text}
		</Tooltip>
	);

	useEffect(() => {
		// Handle resizing logic if needed
	}, []);

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
								style={{ width: `${colWidths[index]}px` }}>
								{col.header}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((row, rowIndex) => (
						<tr key={rowIndex}>
							{columns.map((col, colIndex) => (
								<td
									key={colIndex}
									style={{ width: `${colWidths[colIndex]}px` }}>
									{String(row[col.accessor as keyof T])}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ResizableTable;
