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

interface User {
	_id?: string;
	numericId?: number;
	name: string;
	username: string;
	email: string;
	phone: string;
}

const Users = () => {
	const [usersPerPage, setUsersPerPage] = useState<number>(10);
	const [filterLongUsernames, setFilterLongUsernames] =
		useState<boolean>(false);
	const [sortConfig, setSortConfig] = useState<{
		key: keyof User;
		direction: 'asc' | 'desc';
	}>({ key: 'numericId', direction: 'asc' });
	const { currentPage, goToPage, paginate } = usePagination<User>(usersPerPage);

	const [users, setUsers] = useState<User[]>([]);
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [newUser, setNewUser] = useState<User>({
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
			.get('http://localhost:5000/users')
			.then((response) => setUsers(response.data))
			.catch((error: any) => console.error('Error fetching users:', error));
	}, []);
	if (!users) return <div>Loading...</div>;

	const filteredUsers = users.filter((user) => {
		// Apply the long usernames filter
		if (filterLongUsernames && user.username.length >= 9) {
			return false;
		}

		// Apply the search and selected filters
		const userValues =
			selectedFilters.length > 0
				? selectedFilters
						.map((filter) => user[filter] || '')
						.join(' ')
						.toLowerCase()
				: Object.values(user).join(' ').toLowerCase();

		return userValues.includes(searchQuery.toLowerCase());
	});

	const sortedUsers = [...filteredUsers].sort((a, b) => {
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
		setNewUser({
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

	const handleEditModalShow = (user: User) => {
		setEditingUser(user);
		setIsEditing(true);
		setShowAddModal(true);
	};

	const paginatedUsers = paginate({ users: sortedUsers });
	const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
	const isLastPage = currentPage >= totalPages;

	const requestSort = (key: keyof User) => {
		let direction: 'asc' | 'desc' = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key, direction });
	};

	const columns = ['numericId', 'name', 'username', 'email', 'phone'];

	const renderSortIcon = (key: keyof User) => {
		if (sortConfig.key !== key) return null;
		if (sortConfig.direction === 'asc')
			return <Icon icon='eva:arrow-up-fill' />;
		if (sortConfig.direction === 'desc')
			return <Icon icon='eva:arrow-down-fill' />;
		return null;
	};

	const handleAddUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (isEditing && editingUser) {
			setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
		} else {
			setNewUser({ ...newUser, [e.target.name]: e.target.value });
		}
	};

	const handleAddUserSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (isEditing && editingUser) {
			axios
				.put(`http://localhost:5000/users/${editingUser._id}`, editingUser)
				.then((response) => {
					const updatedUser: User = response.data.user;
					setUsers((prevUsers) =>
						prevUsers.map((user) =>
							user._id === updatedUser._id ? updatedUser : user
						)
					);
					setEditingUser(null);
					setIsEditing(false);
				})
				.catch((error) => console.error('Error updating user:', error));
		} else {
			axios
				.post('http://localhost:5000/users/create', newUser)
				.then((response) => {
					const createdUser: User = response.data.user;
					setUsers((prevUsers) => [...prevUsers, createdUser]);
				})
				.catch((error) => console.error('Error creating user:', error));
		}

		setShowAddModal(false);
		setNewUser({
			name: '',
			username: '',
			email: '',
			phone: '',
		});
	};

	const handleDeleteUser = (userId: string) => {
		axios
			.delete(`http://localhost:5000/users/${userId}`)
			.then(() => {
				setUsers((prevUsers) =>
					prevUsers.filter((user) => user._id !== userId)
				);
			})
			.catch((error) => console.error('Error deleting user:', error));
	};

	const handleCreateDefaultUser = () => {
		const defaultUser = {
			name: 'John Doe',
			username: 'johndoe',
			email: 'john@doe.com',
			phone: '0123456789',
		};

		axios
			.post('http://localhost:5000/users/create', defaultUser)
			.then((response) => {
				const createdUser = response.data;
				setUsers((prevUsers) => [...prevUsers, createdUser]);
			})
			.catch((error) => console.error('Error creating default user:', error));
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
							onClick={handleCreateDefaultUser}
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
								<Form onSubmit={handleAddUserSubmit}>
									<Form.Group
										className='mb-3'
										controlId='formBasicName'>
										<Form.Label>Nom</Form.Label>
										<Form.Control
											type='text'
											placeholder='John Doe'
											name='name'
											value={isEditing ? editingUser?.name : newUser.name} // Use editingUser if editing
											onChange={handleAddUserChange}
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
												isEditing ? editingUser?.username : newUser.username
											} // Use editingUser if editing
											onChange={handleAddUserChange}
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
											value={isEditing ? editingUser?.email : newUser.email} // Use editingUser if editing
											onChange={handleAddUserChange}
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
											value={isEditing ? editingUser?.phone : newUser.phone} // Use editingUser if editing
											onChange={handleAddUserChange}
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
								defaultValue={usersPerPage}
								max={10}
								min={5}
								onChange={(value) => {
									if (value !== null && value > 0) {
										setUsersPerPage(value);
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
					data={paginatedUsers}
					sortConfig={sortConfig}
					requestSort={requestSort}
					renderSortIcon={renderSortIcon}
					handleEditModalShow={handleEditModalShow}
					handleDeleteUser={handleDeleteUser}
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
						{filteredUsers.length} résultats.
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

export default Users;
