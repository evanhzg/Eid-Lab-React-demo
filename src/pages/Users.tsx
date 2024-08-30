import { useState } from 'react';
import useSWR from 'swr';
import Table from 'react-bootstrap/Table';
import usePagination from '../components/Pagination';
import { Icon } from '@iconify/react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

import 'react-widgets/styles.css';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import NumberPicker from 'react-widgets/NumberPicker';

interface User {
	id: number;
	name: string;
	username: string;
	email: string;
	phone: string;
}

const fetcher = (url: string): Promise<User[]> =>
	fetch(url).then((res) => res.json());

const Users = () => {
	const [usersPerPage, setUsersPerPage] = useState<number>(9);
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
		? users.filter((user) => user.username.length < 9)
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

	const renderTooltip = (props) => (
		<Tooltip
			id='button-tooltip'
			{...props}>
			{props.text}
		</Tooltip>
	);
	return (
		<div className='my-2 mx-4 d-flex flex-column w-75'>
			<h1>Utilisateurs</h1>

			<div className='pb-2 d-flex align-items-end justify-content-between'>
				<p className='ms-2 mb-0 fw-light fst-italic'>
					{filteredUsers.length} résultats.
				</p>
				<div className='d-flex gap-2 align-items-end'>
					<button
						onClick={() => setFilterLongUsernames(!filterLongUsernames)}
						className={`border border-light p-1 d-inline-flex align-items-center justify-content-center ${
							!filterLongUsernames
								? 'border-light bg-light'
								: 'border-dark bg-dark'
						}`}
						style={{ width: '40px', height: '40px' }}>
						<Icon
							icon={'lucide:arrow-down-10'}
							color={`${!filterLongUsernames ? 'black' : 'white'}`}
						/>
					</button>

					<div className='text-start'>
						<label className='fw-bold'>
							Élmts / page <span className='fst-italic fw-light'>(3-9)</span>
						</label>
						<NumberPicker
							className='w-10rem'
							defaultValue={usersPerPage}
							max={9}
							min={3}
							onChange={(value) => {
								if (value !== null && value > 0) {
									setUsersPerPage(value);
								}
							}}
						/>
					</div>
				</div>
			</div>

			<Table
				className='table-fixed'
				striped
				bordered
				hover>
				<thead>
					<tr>
						<th
							className='user-select-none numeric-col cursor-pointer'
							role='button'
							onClick={() => requestSort('id')}>
							ID {renderSortIcon('id')}
						</th>
						<th
							className='user-select-none cursor-pointer'
							role='button'
							onClick={() => requestSort('name')}>
							Nom {renderSortIcon('name')}
						</th>
						<th
							className='user-select-none cursor-pointer'
							role='button'
							onClick={() => requestSort('username')}>
							Pseudo {renderSortIcon('username')}
						</th>
						<th
							className='user-select-none cursor-pointer'
							role='button'
							onClick={() => requestSort('email')}>
							Email {renderSortIcon('email')}
						</th>
						<th
							className='user-select-none cursor-pointer'
							role='button'
							onClick={() => requestSort('phone')}>
							Téléphone {renderSortIcon('phone')}
						</th>
					</tr>
				</thead>
				<tbody>
					{paginatedItems.map((user) => (
						<tr key={user.id}>
							<td className='numeric-col'>{user.id}</td>
							<td>
								<OverlayTrigger
									placement='top'
									overlay={renderTooltip({ text: user.name })}>
									<div className='ellipsis'>{user.name}</div>
								</OverlayTrigger>
							</td>
							<td>
								<OverlayTrigger
									placement='top'
									overlay={renderTooltip({ text: user.username })}>
									<div className='ellipsis'>{user.username}</div>
								</OverlayTrigger>
							</td>
							<td>
								<OverlayTrigger
									placement='top'
									overlay={renderTooltip({ text: user.email })}>
									<div className='ellipsis'>{user.email}</div>
								</OverlayTrigger>
							</td>
							<td>
								<OverlayTrigger
									placement='top'
									overlay={renderTooltip({ text: user.phone })}>
									<div className='ellipsis'>{user.phone}</div>
								</OverlayTrigger>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
			{/* PREV-NEXT BTNS */}
			<div className='d-flex gap-3'>
				<button
					onClick={() => goToPage(currentPage - 1)}
					disabled={currentPage === 1}>
					Previous
				</button>
				<div className='d-flex gap-2'>
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
				</div>
				<button
					onClick={() => goToPage(currentPage + 1)}
					disabled={isLastPage}>
					Next
				</button>
			</div>
		</div>
	);
};

export default Users;
