import { useState } from 'react';
import usePaginate from './usePaginate';
import { Student } from '../types';

interface SortConfig {
	key: keyof Student;
	direction: 'asc' | 'desc';
}

const useStudentTableConfig = (
	students: Student[],
	studentsPerPage: number
) => {
	const [sortConfig, setSortConfig] = useState<SortConfig>({
		key: 'numericId',
		direction: 'asc',
	});
	const [searchQuery, setSearchQuery] = useState('');

	const {
		currentPage,
		itemsPerPage,
		goToPage,
		nextPage,
		prevPage,
		paginate,
		totalPages,
		setItemsPerPageCount,
	} = usePaginate<Student>(studentsPerPage);

	const sortedStudents = [...students].sort((a, b) => {
		if (a[sortConfig.key] < b[sortConfig.key])
			return sortConfig.direction === 'asc' ? -1 : 1;
		if (a[sortConfig.key] > b[sortConfig.key])
			return sortConfig.direction === 'asc' ? 1 : -1;
		return 0;
	});

	const filteredStudents = sortedStudents.filter((student) =>
		Object.values(student).some((value) =>
			value.toString().toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	const paginatedStudents = paginate({ items: filteredStudents });

	const requestSort = (key: keyof Student) => {
		let direction: 'asc' | 'desc' = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key, direction });
	};

	return {
		sortedStudents: paginatedStudents,
		totalPages: totalPages({ items: filteredStudents }),
		isLastPage: currentPage >= totalPages({ items: filteredStudents }),
		requestSort,
		sortConfig,
		setCurrentPage: goToPage,
		currentPage,
		searchQuery,
		setSearchQuery,
		nextPage,
		prevPage,
		setItemsPerPageCount,
	};
};

export default useStudentTableConfig;
