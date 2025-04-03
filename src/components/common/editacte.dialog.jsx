import React, { useRef, useEffect, useState } from "react";
import {
    Button,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import { useDialogueStore } from "@/store/dialogue.store";
import { DocumentEditorContainerComponent, Print } from '@syncfusion/ej2-react-documenteditor';
import { useNavigate, useLocation } from "react-router-dom";
import { UploadFilesToS3 } from "@/utils/uploadS3V3";
import { toast } from 'react-toastify';
import { useMutation } from "@tanstack/react-query";
import { FoldersApi } from "@/api/api";
// import { SwitchComponent } from "@syncfusion/ej2-react-buttons";
DocumentEditorContainerComponent.Inject(Print);

const toolbarOptions = [
    // "New",
    // "Open",
    "Separator",
    "Undo",
    "Redo",
    "Separator",
    // {
    //     prefixIcon: "sf-icon-InsertMergeField",
    //     tooltipText: "Insert Field",
    //     text: onWrapText("Insert Field"),
    //     id: "InsertField",
    // },
    // {
    //     prefixIcon: "sf-icon-FinishMerge",
    //     tooltipText: "Merge Document",
    //     text: onWrapText("Merge Document"),
    //     id: "MergeDocument",
    // },
    "Separator",
    "Image",
    "Table",
    "Hyperlink",
    "Bookmark",
    "TableOfContents",
    "Separator",
    "Header",
    "Footer",
    "PageSetup",
    "PageNumber",
    "Break",
    "Separator",
    "Find",
    "Separator",
    "Comments",
    "TrackChanges",
    "Separator",
    "LocalClipboard",
    "RestrictEditing",
    "Separator",
    "FormFields",
    "UpdateFields"
];

function EditActe() {

    const navigate = useNavigate();
    const {state} = useLocation();
    const { setDialogue, dialogue } = useDialogueStore();
    const [load, setload] = useState(true);
    let container = useRef(null);
    let hostUrl = "https://services.syncfusion.com/react/production/api/documenteditor/";

    useEffect(() => {
        rendereComplete();
    }, []);

    const loadDocumentFromURL = async () => {
        fetch(dialogue.data.url)
        .then(response => response.text()) // Assurez-vous que le contenu est lu correctement
        .then(sfdtContent => {
            container.current.documentEditor.open(sfdtContent);
            setload(false)
        })
        .catch(error => {
            console.error('Erreur lors du chargement du fichier SFDT:', error);
        });
    };

    const onLoadDefault = () => {
        loadDocumentFromURL()
        container.current.documentEditorSettings.showRuler = true;
        container.current.toolbarItems = toolbarOptions;
    };

    const rendereComplete = () => {
        window.onbeforeunload = function () {
            return "Want to save your changes?";
        };
        container.current.documentEditor.pageOutline = "#E0E0E0";
        container.current.documentEditor.acceptTab = true;
        container.current.documentEditor.resize();
        onLoadDefault();
    };

    const { mutate, isLoading } = useMutation({
        mutationFn: async (data) => {
            return FoldersApi.updateFolders(state?.id, data)
        },
        gcTime: 0,
        onSuccess: (response) => {
            toast.success('L\'acte brouillon est créé avec succès', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });

            navigate("/dashboard/dossiers/view", {
                replace: true,
                state: { ...state, ...response.data },
            });
        },
        onError: ({ response }) => {
            toast.error('Une erreur s\'est produite lors de l\'ajout de l\'acte brouillon', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });
        }
    })

    const saveBrouillon = async () => {
        container.current.documentEditor.saveAsBlob('Sfdt').then(async(blob) => {
            await UploadFilesToS3([
                {
                    preview: blob,
                    fileName: "Acte-Brouillon",
                    isSfdt: true,
                }  
            ])
            .then((s3Link) => {
                mutate({
                    draftActeLocation: s3Link[0]?.url,
                })
            })
            .catch((err) => {
                toast.error("Une erreur s'est produite lors de l'enrégistrement de l'acte brouillon", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "colored",
                });
            })
        })
    };

    return (
        <>
            <DialogHeader className="flex items-center justify-between text-sm ">
                
                Editer l'acte brouillon

                { !load ?

                    <div className=" flex flex-row justify-center items-center gap-x-1 " >

                        <Button
                            onClick={() => saveBrouillon()}
                            variant="text"
                            color="green"
                            className="mr-1"
                            disabled={isLoading}
                        >
                            <span>{isLoading ? "Enrégistrement..." : "Enrégistrer"}</span>
                        </Button>

                        {dialogue.data?.isPrint &&
                            <Button
                                variant="text"
                                color="cyan"
                                onClick={() => container.current.documentEditor.print()}
                                className="mr-1"
                            >
                                <span>Imprimer</span>
                            </Button>
                        }

                        <Button
                            variant="text"
                            color="red"
                            onClick={() =>
                                setDialogue({
                                    size: "sm",
                                    open: false,
                                    view: null,
                                    data: null,
                                })
                            }
                            className="mr-1"
                        >
                            <span>Fermer</span>
                        </Button>
                    </div>

                :

                    <Button
                        variant="filled"
                        color="green"
                        disabled={true}
                        className="mr-1"
                    >
                        <span>Chargement...</span>
                    </Button>

                }


            
            </DialogHeader>

            <DialogBody className=" h-[700px] flex flex-col" divider>
                <div className="control-section">
                    <div className="flex-container">
                        <div>
                            <DocumentEditorContainerComponent id="container" ref={container} style={{ display: "block" }} height={700} serviceUrl={hostUrl} enablePrint={true} enableSfdtExport={true} enableToolbar={true} restrictEditing={false} locale="fr-FR" />
                        </div>
                    </div>
                </div>
            </DialogBody>

            <DialogFooter></DialogFooter>

        </>
    );

}

export default EditActe;
