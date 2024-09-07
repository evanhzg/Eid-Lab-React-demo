import { useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';
import axios from 'axios';
import ResizableTable from '../components/ResizableTable';
import useTableConfig from '../hooks/useStudentTableConfig';
import StudentModal from '../components/StudentModal';
import { Icon } from '@iconify/react';
import { Student } from '../types';

const Students = () => {
	const [students, setStudents] = useState<Student[]>([]);
	const [selectedStudent, setSelectedStudent] = useState<Student | undefined>(
		undefined
	);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const {
		sortedStudents,
		totalPages,
		isLastPage,
		requestSort,
		sortConfig,
		setCurrentPage,
		currentPage,
		searchQuery,
		setSearchQuery,
		nextPage,
		prevPage,
		setItemsPerPageCount,
	} = useTableConfig(students, 10);

	useEffect(() => {
		const fetchStudents = async () => {
			try {
				const response = await axios.get('http://localhost:5001/api/students'); // Update the API endpoint
				console.log('API Response:', response.data); // Debugging: Log the API response
				const transformedData = response.data.map(
					(student: { createdAt: any; updatedAt: any }) => ({
						...student,
						created_at: student.createdAt,
						updated_at: student.updatedAt,
					})
				);
				setStudents(Array.isArray(transformedData) ? transformedData : []);
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

	const generatePageButtons = () => {
		const total = totalPages;
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
		{ header: 'Prénom', accessor: 'first_name', width: 150 },
		{ header: 'Nom', accessor: 'last_name', width: 150 },
		{ header: 'Email', accessor: 'email', width: 200 },
		{ header: 'Téléphone', accessor: 'phone', width: 150 },
		{ header: 'Pays', accessor: 'country', width: 150 },
		{ header: 'Région', accessor: 'region', width: 150 },
		{ header: 'Ville', accessor: 'city', width: 150 },
		{ header: 'École', accessor: 'school', width: 150 },
		{ header: 'Niveau', accessor: 'grade', width: 100 },
		{ header: 'Disponible', accessor: 'available', width: 100 },
		{ header: 'Créé le', accessor: 'created_at', width: 150 },
		{ header: 'Mis à jour le', accessor: 'updated_at', width: 150 },
	];

	const formatDate = (date: Date | string | undefined) => {
		console.log('formatDate called with:', date); // Debugging: Log the date value
		if (!date) return 'N/A';
		const parsedDate = typeof date === 'string' ? new Date(date) : date;
		if (isNaN(parsedDate.getTime())) return 'N/A';
		return new Intl.DateTimeFormat('fr-FR', {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
		}).format(parsedDate);
	};

	return (
		<div>
			<div className='table-actions'>
				<TextField
					className='search-input'
					label='Rechercher'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					fullWidth
					margin='normal'
				/>
				<Button
					variant='contained'
					onClick={() => {
						setSelectedStudent(undefined);
						setIsModalOpen(true);
					}}>
					<Icon icon='mingcute:user-add-fill' />
				</Button>
			</div>
			<ResizableTable
				columns={columns}
				data={sortedStudents.map((student) => ({
					...student,
					created_at: formatDate(student.created_at),
					updated_at: formatDate(student.updated_at),
				}))}
				renderActions={(row) => (
					<div className='action-buttons'>
						<Icon
							onClick={() => handleEdit(row._id)}
							icon='mingcute:user-edit-fill'
							color='var(--success-color)'
							style={{ cursor: 'pointer' }}
						/>
						<Icon
							onClick={() => handleDelete(row._id)}
							icon='mingcute:user-remove-fill'
							color='var(--error-color)'
							style={{ cursor: 'pointer' }}
						/>
					</div>
				)}
				requestSort={requestSort}
				sortConfig={sortConfig}
			/>
			<div className='pagination-controls'>
				<Button
					variant='contained'
					onClick={prevPage}
					disabled={currentPage === 1}>
					<Icon icon='mingcute:arrow-left-fill' />
				</Button>
				{generatePageButtons().map((page, index) =>
					typeof page === 'number' ? (
						<Button
							className={currentPage === page ? 'highlighted-button' : ''}
							variant='contained'
							key={index}
							onClick={() => setCurrentPage(page)}>
							{page}
						</Button>
					) : (
						<Button
							variant='contained'
							key={index}
							disabled
							style={{ cursor: 'default' }}>
							{page}
						</Button>
					)
				)}
				<Button
					variant='contained'
					onClick={nextPage}
					disabled={isLastPage}>
					<Icon icon='mingcute:arrow-right-fill' />
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
