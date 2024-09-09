import React from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
} from '@mui/material';

interface ConfirmDialogProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	content: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
	open,
	onClose,
	onConfirm,
	title,
	content,
}) => (
	<Dialog
		open={open}
		onClose={onClose}
		className='confirm-dialog'
		PaperProps={{
			style: {
				backgroundColor: 'var(--secondary-color)',
				color: 'var(--primary-text-color)',
				borderRadius: 'var(--border-radius-lg)',
			},
		}}>
		<DialogTitle>{title}</DialogTitle>
		<DialogContent>{content}</DialogContent>
		<DialogActions>
			<Button
				onClick={onClose}
				className='confirm-dialog__button'>
				Cancel
			</Button>
			<Button
				onClick={onConfirm}
				className='delete'
				autoFocus>
				Confirm
			</Button>
		</DialogActions>
	</Dialog>
);

export default ConfirmDialog;
