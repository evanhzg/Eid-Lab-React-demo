import { useState } from 'react';

// On définit PaginateProps en tant que T, soit un type générique défini à chaque définition par l'interface
interface PaginateProps<T> {
	students?: T[];
}

// Idem, avec une virgule pour préciser que la fonction pourrait contenir plusieurs types génériques
const usePagination = <T,>(studentsPerPage: number, initialPage = 1) => {
	// Etat de la page et fonction de mise à jour de l'état
	const [currentPage, setCurrentPage] = useState(initialPage);

	// fonction définissant la page actuelle comme étant celle demandée (via les input associés)
	const goToPage = (pageNumber: number) => {
		setCurrentPage(pageNumber);
	};

	// fonction définissant les items renvoyés sur une pafe de la pagination
	const paginate = (jsonObject: PaginateProps<T>) => {
		const array = jsonObject.students || [];
		const startIndex = (currentPage - 1) * studentsPerPage;
		const endIndex = startIndex + studentsPerPage;

		return array.slice(startIndex, endIndex);
	};

	// On renvoit les fonctions pour pouvoir les utiliser dans App.tsx (ou le reste de l'application)
	return {
		currentPage,
		goToPage,
		paginate,
	};
};

// EXPORT TIME
export default usePagination;
