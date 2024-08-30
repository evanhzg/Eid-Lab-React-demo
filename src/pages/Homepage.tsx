import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import Table from 'react-bootstrap/Table';
import usePagination from '../components/Pagination';
import { Icon } from '@iconify/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

interface User {
	id: number;
	name: string;
	username: string;
	email: string;
	phone: string;
}

const fetcher = (url: string): Promise<User[]> =>
	fetch(url).then((res) => res.json());

const Swr = () => {
	const [usersPerPage, setUsersPerPage] = useState<number>(10);
	const [filterLongUsernames, setFilterLongUsernames] =
		useState<boolean>(false);
	const [sortConfig, setSortConfig] = useState<{
		key: keyof User;
		direction: 'asc' | 'desc';
	}>({ key: 'id', direction: 'asc' });
	const { currentPage, goToPage, paginate } = usePagination<User>(usersPerPage);

	const { data: users, error } = useSWR<User[]>(
		`https://jsonplaceholder.typicode.com/users?page=${currentPage}`,
		fetcher
	);

	if (error) return <div>Failed to load users</div>;
	if (!users) return <div>Loading...</div>;

	const filteredUsers = filterLongUsernames
		? users.filter((user) => user.username.length < 10)
		: users;

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

	const paginatedItems = paginate({ users: sortedUsers });
	const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
	const isLastPage = currentPage >= totalPages;

	const requestSort = (key: keyof User) => {
		let direction: 'asc' | 'desc' = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key, direction });
	};

	const renderSortIcon = (key: keyof User) => {
		if (sortConfig.key !== key) return null;
		if (sortConfig.direction === 'asc')
			return <Icon icon='eva:arrow-up-fill' />;
		if (sortConfig.direction === 'desc')
			return <Icon icon='eva:arrow-down-fill' />;
		return null;
	};

	return (
		<div className='my-2 mx-4 d-flex flex-column gap-4 w-100'>
			<p>Page actuelle: {currentPage}</p>
			<p>Utilisateurs retournés: {filteredUsers.length}</p>
			<div>
				<label>
					Nombre d'utilisateurs par page:
					<input
						type='number'
						value={usersPerPage}
						onChange={(e) => {
							const value = parseInt(e.target.value, 10);
							if (!isNaN(value) && value > 0) {
								setUsersPerPage(value);
							}
						}}
						min='1'
					/>
				</label>
			</div>
			<div>
				<label>
					<input
						type='checkbox'
						checked={filterLongUsernames}
						onChange={() => setFilterLongUsernames(!filterLongUsernames)}
					/>
					Afficher uniquement les pseudos de moins de 10 caractères
				</label>
			</div>
			<Table
				striped
				bordered
				hover>
				<thead>
					<tr>
						<th
							className='user-select-none'
							role='button'
							onClick={() => requestSort('id')}>
							ID {renderSortIcon('id')}
						</th>
						<th
							className='user-select-none'
							role='button'
							onClick={() => requestSort('name')}>
							Nom {renderSortIcon('name')}
						</th>
						<th
							className='user-select-none'
							role='button'
							onClick={() => requestSort('username')}>
							Pseudo {renderSortIcon('username')}
						</th>
						<th
							className='user-select-none'
							role='button'
							onClick={() => requestSort('email')}>
							Email {renderSortIcon('email')}
						</th>
						<th
							className='user-select-none'
							role='button'
							onClick={() => requestSort('phone')}>
							Téléphone {renderSortIcon('phone')}
						</th>
					</tr>
				</thead>
				<tbody>
					{paginatedItems.map((user) => (
						<tr key={user.id}>
							<td>{user.id}</td>
							<td>{user.name}</td>
							<td>{user.username}</td>
							<td>{user.email}</td>
							<td>{user.phone}</td>
						</tr>
					))}
				</tbody>
			</Table>
			<div>
				<button
					onClick={() => goToPage(currentPage - 1)}
					disabled={currentPage === 1}>
					Previous
				</button>
				{Array.from({ length: totalPages }, (_, index) => index + 1).map(
					(page) => (
						<button
							key={page}
							onClick={() => goToPage(page)}
							disabled={page === currentPage}>
							{page}
						</button>
					)
				)}
				<button
					onClick={() => goToPage(currentPage + 1)}
					disabled={isLastPage}>
					Next
				</button>
			</div>
		</div>
	);
};

export default Swr;
