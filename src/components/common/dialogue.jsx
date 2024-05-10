import React from 'react'
import Dialog from '@mui/material/Dialog';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import CreateCategorieGroup from './createcategoriegroup.dialog'
import UpdateCategorieGroup from './updatecategoriegroup.dialog';
import DeleteCategorieGroup from './deletecategoriegroup.dialog';

import CreateCollaborateur from './createcollabo.dialog';
import UpdateCollaborateur from './updatecollabo.dialog';
import DeleteUserDialog from './deleteuser.dialog';
import SuspendUserDialog from './suspenduser.dialog';
import CreateClient from './createclient.dialog';
import UpdateClient from './updateclient.dialog';
import DetailsClient from './detailsclient.dialog';
import CreateVariableGroup from './createvariablegroup.dialog';
import CreateVariable from './createvariable.dialog';
import CreateSubfolder from './createsubfolder.dialog';
import CreateSubfolder2 from './createsubfolder2.dialog';
import AddFile from './addfile.dialo';
import ViewPdf from './viewpdf.dialog';
import ViewTemplate from './viewtemplate.dialog';

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
					: dialogue?.view === "delete-collaborateur" ?
						<DeleteUserDialog/>
					: dialogue?.view === "create-client" ?
						<CreateClient/>
					: dialogue?.view === "update-client" ?
						<UpdateClient/>
					: dialogue?.view === "details-client" ?
						<DetailsClient/>
					: dialogue?.view === "create-variable-group" ?
						<CreateVariableGroup/>
					: dialogue?.view === "create-variable" ?
						<CreateVariable/>
					: dialogue?.view === "add-sub-folder" ?
						<CreateSubfolder/>
					: dialogue?.view === "create-folder" ?
						<CreateSubfolder2/>
					: dialogue?.view === "add-file" ?
						<AddFile/>
					: dialogue?.view === "view-pdf" ?
						<ViewPdf/>
					: dialogue?.view === "view-template" ?
						<ViewTemplate/>
					:
						<div />
				}
			</Dialog>

			<Backdrop
				sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={backdrop.active}			>
				<CircularProgress color="inherit" />
			</Backdrop>
		</>
	);
}
