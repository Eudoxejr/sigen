import React, { useRef, useEffect, useState } from "react";
import {
    Button,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
} from "@material-tailwind/react";
import { useDialogueStore } from "@/store/dialogue.store";
import { DocumentEditorContainerComponent, Toolbar } from '@syncfusion/ej2-react-documenteditor';
import { useNavigate } from "react-router-dom";

// import { SwitchComponent } from "@syncfusion/ej2-react-buttons";

function ViewTemplate() {

    const navigate = useNavigate();
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
        container.current.documentEditor.documentName = "Template de minute";
        container.current.documentEditorSettings.showRuler = true;
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

    return (
        <>
            <DialogHeader className="flex items-center justify-between text-sm ">
                Visionner le template de minute

                { !load ?

                    <div className=" flex flex-row justify-center items-center gap-x-1 " >

                        <Button
                            variant="text"
                            color="green"
                            onClick={() => {
                                navigate('/dashboard/minutes/edit', {state: dialogue.data} )
                                setDialogue({
                                    size: "sm",
                                    open: false,
                                    view: null,
                                    data: null,
                                })
                            }}
                            className="mr-1"
                        >
                            <span>Modifier</span>
                        </Button>

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

            <DialogBody className=" h-[550px] flex flex-col" divider>
                <div className="control-section">
                    <div className="flex-container">
                        <div>
                            <DocumentEditorContainerComponent id="container" ref={container} style={{ display: "block" }} height={500} serviceUrl={hostUrl}  enableSfdtExport={true} enableToolbar={true} restrictEditing={true} locale="fr-FR" />
                        </div>
                    </div>
                </div>
            </DialogBody>

            <DialogFooter></DialogFooter>

        </>
    );

}

export default ViewTemplate;
