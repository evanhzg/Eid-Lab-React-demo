import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import usePagination from '../components/Pagination';
import { Icon } from '@iconify/react';
import { Tooltip, OverlayTrigger, Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select';
import 'react-widgets/styles.css';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NumberPicker from 'react-widgets/NumberPicker';
import axios from 'axios';
import ResizableTable from '../components/ResizableTable';

interface Student {
	_id?: string;
	numericId?: number;
	name: string;
	username: string;
	email: string;
	phone: string;
}

const Students = () => {
	const [studentsPerPage, setStudentsPerPage] = useState<number>(10);
	const [filterLongUsernames, setFilterLongUsernames] =
		useState<boolean>(false);
	const [sortConfig, setSortConfig] = useState<{
		key: keyof Student;
		direction: 'asc' | 'desc';
	}>({ key: 'numericId', direction: 'asc' });
	const { currentPage, goToPage, paginate } =
		usePagination<Student>(studentsPerPage);

	const [students, setStudents] = useState<Student[]>([]);
	const [editingStudent, setEditingStudent] = useState<Student | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [newStudent, setNewStudent] = useState<Student>({
		name: '',
		username: '',
		email: '',
		phone: '',
	});
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
	const filterOptions = [
		{ value: 'name', label: 'Name' },
		{ value: 'username', label: 'Username' },
		{ value: 'email', label: 'Email' },
		{ value: 'phone', label: 'Phone' },
	];
	const [isMultiselectVisible, setMultiselectVisible] = useState(false);

	useEffect(() => {
		axios
			.get('http://localhost:5000/students')
			.then((response) => setStudents(response.data))
			.catch((error: any) => console.error('Error fetching students:', error));
	}, []);
	if (!students) return <div>Loading...</div>;

	const filteredStudents = students.filter((student) => {
		// Apply the long usernames filter
		if (filterLongUsernames && student.username.length >= 9) {
			return false;
		}

		// Apply the search and selected filters
		const studentValues =
			selectedFilters.length > 0
				? selectedFilters
						.map((filter) => student[filter] || '')
						.join(' ')
						.toLowerCase()
				: Object.values(student).join(' ').toLowerCase();

		return studentValues.includes(searchQuery.toLowerCase());
	});

	const sortedStudents = [...filteredStudents].sort((a, b) => {
		const aValue = a[sortConfig.key];
		const bValue = b[sortConfig.key];
		if (aValue < bValue) {
			return sortConfig.direction === 'asc' ? -1 : 1;
		}
		if (aValue > bValue) {
			return sortConfig.direction === 'asc' ? 1 : -1;
		}
		return 0;
	});

	const [showAddModal, setShowAddModal] = useState(false);

	const handleAddModalClose = () => {
		setShowAddModal(false);
		setIsEditing(false);
		setNewStudent({
			name: '',
			username: '',
			email: '',
			phone: '',
		});
	};

	const handleAddModalShow = () => {
		setShowAddModal(true);
		setIsEditing(false);
	};

	const handleEditModalShow = (student: Student) => {
		setEditingStudent(student);
		setIsEditing(true);
		setShowAddModal(true);
	};

	const paginatedStudents = paginate({ students: sortedStudents });
	const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
	const isLastPage = currentPage >= totalPages;

	const requestSort = (key: keyof Student) => {
		let direction: 'asc' | 'desc' = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key, direction });
	};

	const columns = ['numericId', 'name', 'username', 'email', 'phone'];

	const renderSortIcon = (key: keyof Student) => {
		if (sortConfig.key !== key) return null;
		if (sortConfig.direction === 'asc')
			return <Icon icon='eva:arrow-up-fill' />;
		if (sortConfig.direction === 'desc')
			return <Icon icon='eva:arrow-down-fill' />;
		return null;
	};

	const handleAddStudentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (isEditing && editingStudent) {
			setEditingStudent({ ...editingStudent, [e.target.name]: e.target.value });
		} else {
			setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
		}
	};

	const handleAddStudentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (isEditing && editingStudent) {
			axios
				.put(
					`http://localhost:5000/students/${editingStudent._id}`,
					editingStudent
				)
				.then((response) => {
					const updatedStudent: Student = response.data.student;
					setStudents((prevStudents) =>
						prevStudents.map((student) =>
							student._id === updatedStudent._id ? updatedStudent : student
						)
					);
					setEditingStudent(null);
					setIsEditing(false);
				})
				.catch((error) => console.error('Error updating student:', error));
		} else {
			axios
				.post('http://localhost:5000/students/create', newStudent)
				.then((response) => {
					const createdStudent: Student = response.data.student;
					setStudents((prevStudents) => [...prevStudents, createdStudent]);
				})
				.catch((error) => console.error('Error creating student:', error));
		}

		setShowAddModal(false);
		setNewStudent({
			name: '',
			username: '',
			email: '',
			phone: '',
		});
	};

	const handleDeleteStudent = (studentId: string) => {
		axios
			.delete(`http://localhost:5000/students/${studentId}`)
			.then(() => {
				setStudents((prevStudents) =>
					prevStudents.filter((student) => student._id !== studentId)
				);
			})
			.catch((error) => console.error('Error deleting student:', error));
	};

	const handleCreateDefaultStudent = () => {
		const defaultStudent = {
			name: 'John Doe',
			username: 'johndoe',
			email: 'john@doe.com',
			phone: '0123456789',
		};

		axios
			.post('http://localhost:5000/students/create', defaultStudent)
			.then((response) => {
				const createdStudent = response.data;
				setStudents((prevStudents) => [...prevStudents, createdStudent]);
			})
			.catch((error) =>
				console.error('Error creating default student:', error)
			);
	};

	const isFirstPage = currentPage === 1;

	const generatePageButtons = () => {
		let pages: (number | string)[] = [];

		if (totalPages <= 5) {
			pages = Array.from({ length: totalPages }, (_, index) => index + 1);
		} else {
			if (currentPage <= 3) {
				pages = [1, 2, 3, 4, '...', totalPages];
			} else if (currentPage >= totalPages - 2) {
				pages = [
					1,
					'...',
					totalPages - 3,
					totalPages - 2,
					totalPages - 1,
					totalPages,
				];
			} else {
				pages = [
					1,
					'...',
					currentPage - 1,
					currentPage,
					currentPage + 1,
					'...',
					totalPages,
				];
			}
		}

		return pages;
	};

	return (
		<div className='d-flex'>
			<div className='my-2 mx-4 d-flex flex-column w-75'>
				<h1>Utilisateurs</h1>

				<div className='d-flex align-items-end justify-content-between'>
					<div className='d-flex flex-column w-25'>
						<div className='d-flex w-100 justify-content-between gap-2'>
							<input
								className='searchbar'
								type='text'
								placeholder='Search...'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
							<button
								onClick={() => setMultiselectVisible(!isMultiselectVisible)}
								className='bg-dark'>
								<Icon
									className='fs-6'
									icon='mdi:filter-menu'
									color='white'
								/>
							</button>
						</div>
					</div>

					<div className='d-flex gap-2 align-items-end'>
						<button
							onClick={handleCreateDefaultStudent}
							className='bg-warning'>
							<Icon
								className='fs-6'
								icon='mdi:cursor-default-click'
								color='black'
							/>
						</button>
						<button
							onClick={handleAddModalShow}
							className='bg-success'>
							<Icon
								className='fs-6'
								icon='mingcute:user-add-fill'
								color='white'
							/>
						</button>

						{/* add/edit modal */}
						<Modal
							show={showAddModal}
							onHide={handleAddModalClose}>
							<Modal.Header closeButton>
								<Modal.Title>
									{isEditing ? 'Modifier' : 'Ajouter'} un utilisateur
								</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<Form onSubmit={handleAddStudentSubmit}>
									<Form.Group
										className='mb-3'
										controlId='formBasicName'>
										<Form.Label>Nom</Form.Label>
										<Form.Control
											type='text'
											placeholder='John Doe'
											name='name'
											value={isEditing ? editingStudent?.name : newStudent.name} // Use editingStudent if editing
											onChange={handleAddStudentChange}
											required
										/>
									</Form.Group>

									<Form.Group
										className='mb-3'
										controlId='formBasicUsername'>
										<Form.Label>Pseudo</Form.Label>
										<Form.Control
											type='text'
											placeholder='johnny69'
											name='username'
											value={
												isEditing
													? editingStudent?.username
													: newStudent.username
											} // Use editingStudent if editing
											onChange={handleAddStudentChange}
											required
										/>
									</Form.Group>

									<Form.Group
										className='mb-3'
										controlId='formBasicEmail'>
										<Form.Label>Email</Form.Label>
										<Form.Control
											type='email'
											placeholder='johndoe@test.com'
											name='email'
											value={
												isEditing ? editingStudent?.email : newStudent.email
											} // Use editingStudent if editing
											onChange={handleAddStudentChange}
											required
										/>
									</Form.Group>

									<Form.Group
										className='mb-3'
										controlId='formBasicPhone'>
										<Form.Label>Téléphone</Form.Label>
										<Form.Control
											type='text'
											placeholder='0612345678'
											name='phone'
											value={
												isEditing ? editingStudent?.phone : newStudent.phone
											} // Use editingStudent if editing
											onChange={handleAddStudentChange}
											required
										/>
									</Form.Group>

									<Button
										variant='success'
										type='submit'>
										{isEditing ? 'Modifier' : 'Créer'}
									</Button>
								</Form>
							</Modal.Body>
							<Modal.Footer>
								<Button
									variant='secondary'
									onClick={handleAddModalClose}>
									Fermer
								</Button>
							</Modal.Footer>
						</Modal>

						<div className='text-start'>
							<label className='fw-bold'>
								Élmts / page <span className='fst-italic fw-light'>(5-10)</span>
							</label>
							<NumberPicker
								className='w-10rem'
								defaultValue={studentsPerPage}
								max={10}
								min={5}
								onChange={(value) => {
									if (value !== null && value > 0) {
										setStudentsPerPage(value);
									}
								}}
							/>
						</div>
					</div>
				</div>
				<div className='d-flex pt-2 gap-2'>
					{isMultiselectVisible && (
						<>
							<Select
								className={`w-50 multiselect ${
									isMultiselectVisible ? 'show' : ''
								}`}
								isMulti
								options={filterOptions}
								onChange={(selectedOptions) =>
									setSelectedFilters(
										selectedOptions.map((option) => option.value)
									)
								}
							/>

							<button
								onClick={() => setFilterLongUsernames(!filterLongUsernames)}
								className={`border border-light ${
									!filterLongUsernames
										? 'border-light bg-light'
										: 'border-dark bg-dark'
								}`}>
								<Icon
									className='fs-6'
									icon={'lucide:arrow-down-10'}
									color={`${!filterLongUsernames ? 'black' : 'white'}`}
								/>
							</button>
						</>
					)}
				</div>
				<ResizableTable
					columns={columns}
					data={paginatedStudents}
					sortConfig={sortConfig}
					requestSort={requestSort}
					renderSortIcon={renderSortIcon}
					handleEditModalShow={handleEditModalShow}
					handleDeleteStudent={handleDeleteStudent}
				/>

				{/* PREV-NEXT BTNS */}
				<div className='d-flex justify-content-between align-items-center'>
					<div className='d-flex gap-3'>
						<button
							onClick={() => goToPage(currentPage - 1)}
							disabled={isFirstPage}>
							Previous
						</button>
						<div className='d-flex gap-2'>
							{generatePageButtons().map((page, index) => (
								<button
									key={index}
									onClick={() => {
										if (typeof page === 'number') {
											goToPage(page);
										}
									}}
									disabled={page === currentPage}>
									{page}
								</button>
							))}
						</div>
						<button
							onClick={() => goToPage(currentPage + 1)}
							disabled={isLastPage}>
							Next
						</button>
					</div>
					<p className='ms-2 mb-0 fw-light fst-italic'>
						{filteredStudents.length} résultats.
					</p>
				</div>
			</div>
			{/* INFOS */}
			<div className='d-flex flex-column align-items-center flex-fill'>
				<h2>Informations</h2>
			</div>
		</div>
	);
};

export default Students;
