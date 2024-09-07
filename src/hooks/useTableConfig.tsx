import { useState } from 'react';

interface Student {
	numericId: number;
	name: string;
	username: string;
	email: string;
	phone: string;
}

interface SortConfig {
	key: keyof Student;
	direction: 'asc' | 'desc';
}

const useTableConfig = (students: Student[], studentsPerPage: number) => {
	const [sortConfig, setSortConfig] = useState<SortConfig>({
		key: 'numericId',
		direction: 'asc',
	});
	const [currentPage, setCurrentPage] = useState(1);

	const sortedStudents = [...students].sort((a, b) => {
		if (a[sortConfig.key] < b[sortConfig.key])
			return sortConfig.direction === 'asc' ? -1 : 1;
		if (a[sortConfig.key] > b[sortConfig.key])
			return sortConfig.direction === 'asc' ? 1 : -1;
		return 0;
	});

	const filteredStudents = sortedStudents; // Apply any filtering logic here
	const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
	const isLastPage = currentPage >= totalPages;

	const requestSort = (key: keyof Student) => {
		let direction: 'asc' | 'desc' = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key, direction });
	};

	return {
		sortedStudents,
		totalPages,
		isLastPage,
		requestSort,
		sortConfig,
		setCurrentPage,
		currentPage,
	};
};

export default useTableConfig;
