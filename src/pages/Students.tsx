import { useEffect, useState, useCallback, useContext } from 'react';
import { Button, TextField } from '@mui/material';
import axios from 'axios';
import ResizableTable from '../components/ResizableTable';
import useTableConfig from '../hooks/useStudentTableConfig';
import StudentModal from '../components/StudentModal';
import { Icon } from '@iconify/react';
import { Student } from '../types';
import ConfirmDialog from '../components/ConfirmDialog';
import { AlertContext } from '../App';

const Students = () => {
	const [students, setStudents] = useState<Student[]>([]);
	const [selectedStudent, setSelectedStudent] = useState<Student | undefined>(
		undefined
	);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
	const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
	const addAlert = useContext(AlertContext);
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

	const fetchStudents = useCallback(async () => {
		try {
			const response = await axios.get('http://localhost:5000/api/students');
			const transformedData = response.data.map((student: any) => ({
				...student,
				created_at: new Date(student.createdAt).toISOString(),
				updated_at: new Date(student.updatedAt).toISOString(),
			}));
			setStudents(Array.isArray(transformedData) ? transformedData : []);
		} catch (error) {
			console.error('Error fetching students:', error);
		}
	}, []);

	useEffect(() => {
		fetchStudents();
	}, [fetchStudents]);

	const handleEdit = (id: string) => {
		const student = students.find((s) => s._id === id);
		setSelectedStudent(student || undefined);
		setIsModalOpen(true);
	};

	const handleDelete = async (id: string) => {
		setStudentToDelete(id);
		setIsConfirmDialogOpen(true);
	};

	const confirmDelete = async () => {
		if (studentToDelete) {
			try {
				await axios.delete(
					`http://localhost:5000/api/students/${studentToDelete}`
				);
				addAlert?.('Student deleted successfully', 'success');
				await fetchStudents();
			} catch (error) {
				console.error('Error deleting student:', error);
				addAlert?.('Error deleting student', 'error');
			}
		}
		setIsConfirmDialogOpen(false);
		setStudentToDelete(null);
	};

	const handleSave = async (student: Student) => {
		try {
			if (selectedStudent) {
				// Edit existing student
				await axios.put(
					`http://localhost:5000/api/students/${selectedStudent._id}`,
					student
				);
				addAlert?.('Student updated successfully', 'success');
			} else {
				// Create new student
				await axios.post('http://localhost:5000/api/students', student);
				addAlert?.('Student created successfully', 'success');
			}
			setIsModalOpen(false);
			setSelectedStudent(undefined);
			// Fetch the updated list of students
			await fetchStudents();
		} catch (error) {
			console.error('Error saving student:', error);
			addAlert?.('Error saving student', 'error');
			if (axios.isAxiosError(error) && error.response) {
				// Handle validation errors from the server
				const validationErrors = error.response.data.details;
				if (validationErrors) {
					// Update the errors state in the StudentModal
					setErrors(validationErrors);
				}
			}
		}
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
		{ header: 'École', accessor: 'school', width: 200 },
		{ header: 'Niveau', accessor: 'grade', width: 100 },
		{ header: 'Disponible', accessor: 'available', width: 100 },
		{ header: 'Créé le', accessor: 'created_at', width: 200 },
		{ header: 'Mis à jour le', accessor: 'updated_at', width: 200 },
	];

	const formatDate = (date: Date | string | undefined) => {
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
					<Icon
						icon='mingcute:user-add-fill'
						style={{ fontSize: '1.5em' }}
					/>
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
					className='pagination-button'
					variant='contained'
					onClick={prevPage}
					disabled={currentPage === 1}>
					<Icon icon='mingcute:arrow-left-fill' />
				</Button>
				{generatePageButtons().map((page, index) =>
					typeof page === 'number' ? (
						<Button
							className={
								currentPage === page
									? 'highlighted-button'
									: 'pagination-button'
							}
							variant='contained'
							key={index}
							onClick={() => setCurrentPage(page)}>
							{page}
						</Button>
					) : (
						<Button
							className='pagination-button'
							variant='contained'
							key={index}
							disabled
							style={{ cursor: 'default' }}>
							{page}
						</Button>
					)
				)}
				<Button
					className='pagination-button'
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
			<ConfirmDialog
				open={isConfirmDialogOpen}
				onClose={() => setIsConfirmDialogOpen(false)}
				onConfirm={confirmDelete}
				title='Confirm Deletion'
				content='Are you sure you want to delete this student?'
			/>
		</div>
	);
};

export default Students;
