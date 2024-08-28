import useSWR from 'swr'; // Call API

import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap (front)
import Table from 'react-bootstrap/Table'; // Front du tableau

import usePagination from './components/Pagination'; // Hook de pagination
import { useState } from 'react'; // Outil de gestion d'états de React

// On définit les types des Objets User et PaginateProps
interface User {
	id: number;
	name: string;
	username: string;
	email: string;
	phone: string;
}

interface PaginateProps {
	users: User[];
}

// Fonction de fetch et définition du retour (un objet json)
const fetcher = (url: string): Promise<User[]> =>
	fetch(url).then((res) => res.json());

const UserTable = () => {
	// Définition des constantes, dont les state (pagination et filtre)
	const [usersPerPage, setUsersPerPage] = useState<number>(3);
	const { currentPage, goToPage, paginate } = usePagination<User>(usersPerPage);
	const [filterLongUsernames, setFilterLongUsernames] =
		useState<boolean>(false);

	// Appel de l'API via SWR
	const { data: users, error } = useSWR<User[]>(
		`https://jsonplaceholder.typicode.com/users?page=${currentPage}`,
		fetcher
	);

	// Front de debug
	if (error) return <div>Aucun utilisateur chargé.</div>;
	if (!users) return <div>Chargement...</div>;

	// Filtre (sur la longueur du pseudo)
	const filteredUsers = filterLongUsernames
		? users.filter((user) => user.username.length < 10)
		: users;

	// Pagination, appel du hook disponible dans le fichier Pagination.txt
	const jsonObject: PaginateProps = { users: filteredUsers };
	const paginatedItems = paginate(jsonObject);

	// Définition de la dernière page pour ne pas avoir de pages vides après celle-ci
	const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
	const isLastPage = currentPage >= totalPages;

	const pageButtons = Array.from(
		{ length: totalPages },
		(_, index) => index + 1
	);

	// Fonction pour changer le nombre d'utilisateurs par page
	const handleUsersPerPageChange = (
		// Check si l'input à changé de valeur dynamiquement (sans reload)
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		//On récupère et définit la nouvelle valeur de l'état usersPerPage avec un nombre max inférieur à 6
		const value = parseInt(event.target.value, 6);
		if (!isNaN(value) && value > 0) {
			setUsersPerPage(value);
		}
	};

	// Mise en place du ReactDOM
	return (
		<div className='my-2 mx-4 d-flex flex-column gap-4 w-100'>
			{/* Des "stats" pour montrer l'application du filtre et de la pagination */}
			<label>Nombre d'éléments par page:</label>

			<input
				type='number'
				value={usersPerPage}
				onChange={handleUsersPerPageChange}
				className='w-25'
			/>
			<p>Page actuelle: {currentPage}</p>
			<p>Utilisateurs totaux retournés: {filteredUsers.length}</p>
			{/* Input de choix du nombre d'utilisateurs affichés par page */}
			<div className='d-flex gap-2'>
				{/* Le filtre */}
				<input
					type='checkbox'
					checked={filterLongUsernames}
					onChange={() => setFilterLongUsernames(!filterLongUsernames)}
				/>
				<label>Afficher uniquement les pseudos de moins de 10 caractères</label>
			</div>
			<Table
				m-auto
				striped
				bordered
				hover>
				<thead>
					<tr>
						<th>id</th>
						<th>Nom</th>
						<th>Pseudo</th>
						<th>Email</th>
						<th>Téléphone</th>
					</tr>
				</thead>
				<tbody>
					{/* map pour appliquer la structure à chaque user, un par un */}
					{users &&
						paginatedItems.map((user) => (
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

			{/* La pagination */}
			<div className='d-flex w-75 justify-content-between m-auto'>
				<button
					onClick={() => goToPage(currentPage - 1)}
					disabled={currentPage === 1}>
					Previous
				</button>
				{pageButtons.map((page) => (
					<button
						key={page}
						onClick={() => goToPage(page)}
						disabled={page === currentPage}>
						{page}
					</button>
				))}
				<button
					onClick={() => goToPage(currentPage + 1)}
					disabled={isLastPage}>
					Next
				</button>
			</div>
		</div>
	);
};

// on exporte la liste d'utilisateurs et tout est good
export default UserTable;
