import React from 'react'
import Dialog from '@mui/material/Dialog';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import CreateCategorieGroup from './createcategoriegroup.dialog'
import UpdateCategorieGroup from './updatecategoriegroup.dialog';
import DeleteCategorieGroup from './deletecategoriegroup.dialog';

import CreateCollaborateur from './createcollabo.dialog';
import UpdateCollaborateur from './updatecollabo.dialog';
import SuspendUserDialog from './suspenduser.dialog';

import { useDialogueStore } from '@/store/dialogue.store';


export default function Dialogue() {

	const { dialogue, backdrop } = useDialogueStore()

	return (
		<>
			<Dialog
				sx={{ '& .MuiDialog-paper': { width: '80%' } }}
				maxWidth={dialogue?.size || "sm"}
				open={dialogue?.open}
				scroll="paper"
			>
				{
					dialogue?.view === "create-group-categorie" ?
						<CreateCategorieGroup/>
					: dialogue?.view === "update-group-categorie" ?
						<UpdateCategorieGroup/>
					: dialogue?.view === "delete-group-categorie" ?
						<DeleteCategorieGroup/>
					: dialogue?.view === "create-collaborateur" ?
						<CreateCollaborateur/>
					: dialogue?.view === "update-collaborateur" ?
						<UpdateCollaborateur/>
					: dialogue?.view === "suspend-collaborateur" ?
						<SuspendUserDialog/>
					:
						<div />
				}
			</Dialog>

			<Backdrop
				sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={backdrop.active}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
		</>
	);
}
