import { useState } from 'react';

interface Student {
	[x: string]: any;
	numericId: number;
	name: string;
	username: string;
	email: string;
	phone: string;
}

const useStudentForm = () => {
	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [currentStudent, setCurrentStudent] = useState<Student | null>(null);

	const openAddModal = () => setShowAddModal(true);
	const closeAddModal = () => setShowAddModal(false);

	const openEditModal = (student: Student) => {
		setCurrentStudent(student);
		setShowEditModal(true);
	};
	const closeEditModal = () => {
		setCurrentStudent(null);
		setShowEditModal(false);
	};

	return {
		showAddModal,
		openAddModal,
		closeAddModal,
		showEditModal,
		openEditModal,
		closeEditModal,
		currentStudent,
	};
};

export default useStudentForm;
