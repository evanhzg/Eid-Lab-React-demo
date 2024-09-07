import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import axios from 'axios';
import ResizableTable from '../components/ResizableTable';
import usePaginate from '../hooks/usePaginate';
import StudentModal from '../components/StudentModal';
import { Icon } from '@iconify/react';

interface Student {
	_id?: string;
	numericId?: number;
	name: string;
	username: string;
	email: string;
	phone: string;
}

const Students = () => {
	const [students, setStudents] = useState<Student[]>([]);
	const [selectedStudent, setSelectedStudent] = useState<Student | undefined>(
		undefined
	);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const {
		currentPage,
		itemsPerPage,
		goToPage,
		nextPage,
		prevPage,
		paginate,
		totalPages,
		setItemsPerPageCount,
	} = usePaginate<Student>(10);

	useEffect(() => {
		const fetchStudents = async () => {
			try {
				const response = await axios.get('http://localhost:5001/api/students'); // Update the API endpoint
				console.log('API Response:', response.data); // Debugging: Log the API response
				setStudents(Array.isArray(response.data) ? response.data : []);
			} catch (error) {
				console.error('Error fetching students:', error);
			}
		};

		fetchStudents();
	}, []);

	const handleEdit = (id: string) => {
		const student = students.find((s) => s._id === id);
		setSelectedStudent(student || undefined);
		setIsModalOpen(true);
	};

	const handleDelete = async (id: string) => {
		// Handle delete action
		console.log(`Delete student with id: ${id}`);
		await axios.delete(`http://localhost:5001/api/students/${id}`);
		// Refresh the student list or handle state update
		const response = await axios.get('http://localhost:5001/api/students');
		setStudents(Array.isArray(response.data) ? response.data : []);
	};

	const handleSave = async (student: Student) => {
		if (selectedStudent) {
			// Edit existing student
			await axios.put(
				`http://localhost:5001/api/students/${selectedStudent._id}`,
				student
			);
		} else {
			// Create new student
			await axios.post('http://localhost:5001/api/students', student);
		}
		setIsModalOpen(false);
		setSelectedStudent(undefined);
		// Refresh the student list or handle state update
		const response = await axios.get('http://localhost:5001/api/students');
		setStudents(Array.isArray(response.data) ? response.data : []);
	};

	const paginatedStudents = paginate({ items: students });

	const generatePageButtons = () => {
		const total = totalPages({ items: students });
		let pages: (number | string)[] = [];

		if (total <= 5) {
			pages = Array.from({ length: total }, (_, index) => index + 1);
		} else {
			if (currentPage <= 3) {
				pages = [1, 2, 3, 4, '...', total];
			} else if (currentPage >= total - 2) {
				pages = [1, '...', total - 3, total - 2, total - 1, total];
			} else {
				pages = [
					1,
					'...',
					currentPage - 1,
					currentPage,
					currentPage + 1,
					'...',
					total,
				];
			}
		}

		return pages;
	};

	const columns = [
		{ header: 'ID', accessor: 'numericId', width: 100 },
		{ header: 'Name', accessor: 'name', width: 200 },
		{ header: 'Username', accessor: 'username', width: 200 },
		{ header: 'Email', accessor: 'email', width: 250 },
		{ header: 'Phone', accessor: 'phone', width: 150 },
	];

	return (
		<div>
			<Button
				variant='contained'
				onClick={() => {
					setSelectedStudent(undefined);
					setIsModalOpen(true);
				}}>
				Add Student
			</Button>
			<ResizableTable
				columns={columns}
				data={paginatedStudents}
				renderActions={(row) => (
					<div className='action-buttons'>
						<Icon
							onClick={() => handleEdit(row._id)}
							icon='mingcute:user-edit-fill'
							color='lightgreen'
							style={{ cursor: 'pointer' }}
						/>
						<Icon
							onClick={() => handleDelete(row._id)}
							icon='mingcute:user-remove-fill'
							color='red'
							style={{ cursor: 'pointer' }}
						/>
					</div>
				)}
			/>
			<div className='pagination-controls'>
				<Button
					variant='contained'
					onClick={prevPage}
					disabled={currentPage === 1}>
					Previous
				</Button>
				{generatePageButtons().map((page, index) =>
					typeof page === 'number' ? (
						<Button
							variant='contained'
							key={index}
							onClick={() => goToPage(page)}>
							{page}
						</Button>
					) : (
						<span key={index}>{page}</span>
					)
				)}
				<Button
					variant='contained'
					onClick={nextPage}
					disabled={currentPage === totalPages({ items: students })}>
					Next
				</Button>
			</div>
			<StudentModal
				open={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={handleSave}
				student={selectedStudent}
			/>
		</div>
	);
};

export default Students;
