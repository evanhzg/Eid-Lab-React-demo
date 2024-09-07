import { useEffect, useState } from 'react';
import { Button, Modal, Box, Typography, TextField } from '@mui/material';
import axios from 'axios';
import ResizableTable from '../components/ResizableTable';
import useStudentForm from '../hooks/useStudentForm';
import usePaginate from '../hooks/usePaginate';

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

	const {
		showAddModal,
		openAddModal,
		closeAddModal,
		showEditModal,
		openEditModal,
		closeEditModal,
		currentStudent,
	} = useStudentForm();

	const columns = [
		{ header: 'ID', accessor: 'numericId', width: 100 },
		{ header: 'Name', accessor: 'name', width: 200 },
		{ header: 'Username', accessor: 'username', width: 200 },
		{ header: 'Email', accessor: 'email', width: 250 },
		{ header: 'Phone', accessor: 'phone', width: 150 },
	];

	const handleSave = async (student: Student) => {
		if (currentStudent) {
			// Edit existing student
			await axios.put(
				`http://localhost:5001/api/students/${currentStudent._id}`,
				student
			);
		} else {
			// Create new student
			await axios.post('http://localhost:5001/api/students', student);
		}
		closeAddModal();
		closeEditModal();
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

	return (
		<div>
			<Button
				variant='contained'
				onClick={openAddModal}>
				Add Student
			</Button>
			<ResizableTable
				columns={columns}
				data={paginatedStudents}
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
			<Modal
				open={showAddModal || showEditModal}
				onClose={closeAddModal || closeEditModal}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'>
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: 400,
						bgcolor: 'background.paper',
						border: '2px solid #000',
						boxShadow: 24,
						p: 4,
					}}>
					<Typography
						id='modal-modal-title'
						variant='h6'
						component='h2'>
						{currentStudent ? 'Edit Student' : 'Add Student'}
					</Typography>
					<Box
						component='form'
						sx={{ mt: 2 }}>
						<TextField
							fullWidth
							margin='normal'
							id='formStudentName'
							label='Name'
							defaultValue={currentStudent?.name}
						/>
						<TextField
							fullWidth
							margin='normal'
							id='formStudentUsername'
							label='Username'
							defaultValue={currentStudent?.username}
						/>
						<TextField
							fullWidth
							margin='normal'
							id='formStudentEmail'
							label='Email'
							defaultValue={currentStudent?.email}
						/>
						<TextField
							fullWidth
							margin='normal'
							id='formStudentPhone'
							label='Phone'
							defaultValue={currentStudent?.phone}
						/>
					</Box>
					<Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
						<Button
							variant='contained'
							onClick={closeAddModal || closeEditModal}
							sx={{ mr: 1 }}>
							Close
						</Button>
						<Button
							variant='contained'
							onClick={() =>
								handleSave({
									name: (
										document.getElementById(
											'formStudentName'
										) as HTMLInputElement
									).value,
									username: (
										document.getElementById(
											'formStudentUsername'
										) as HTMLInputElement
									).value,
									email: (
										document.getElementById(
											'formStudentEmail'
										) as HTMLInputElement
									).value,
									phone: (
										document.getElementById(
											'formStudentPhone'
										) as HTMLInputElement
									).value,
								})
							}>
							Save Changes
						</Button>
					</Box>
				</Box>
			</Modal>
		</div>
	);
};

export default Students;
