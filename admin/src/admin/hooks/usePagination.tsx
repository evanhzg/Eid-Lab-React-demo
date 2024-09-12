import { useState } from 'react';

interface PaginateProps<T> {
	items: T[];
}

export const usePagination = <T,>(
	initialItemsPerPage: number,
	initialPage = 1
) => {
	const [currentPage, setCurrentPage] = useState(initialPage);
	const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

	const goToPage = (pageNumber: number) => {
		setCurrentPage(pageNumber);
	};

	const nextPage = () => {
		setCurrentPage((prevPage) => prevPage + 1);
	};

	const prevPage = () => {
		setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
	};

	const paginate = (jsonObject: PaginateProps<T>) => {
		const array = jsonObject.items || [];
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;

		return array.slice(startIndex, endIndex);
	};

	const totalPages = (jsonObject: PaginateProps<T>) => {
		return Math.ceil(jsonObject.items.length / itemsPerPage);
	};

	const setItemsPerPageCount = (count: number) => {
		setItemsPerPage(count);
		setCurrentPage(1); // Reset to first page when items per page changes
	};

	return {
		currentPage,
		itemsPerPage,
		goToPage,
		nextPage,
		prevPage,
		paginate,
		totalPages,
		setItemsPerPageCount,
	};
};

export default usePagination;
