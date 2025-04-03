import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { DocumentEditorContainerComponent, Toolbar } from '@syncfusion/ej2-react-documenteditor';
import { toast } from 'react-toastify';
import { UploadFilesToS3 } from '@/utils/uploadS3V3';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { FoldersApi } from "@/api/api";
import { useNavigate, useLocation } from "react-router-dom";

DocumentEditorContainerComponent.Inject(Toolbar);

let toolbarOptions = [
    "Separator",
    "Undo",
    "Redo",
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
    "FormFields"
];

const ReviewActe = ({ url, mergeAllData }) => {
    const container = useRef(null);
    const [loading, setLoading] = useState(true);
    const {state} = useLocation();
    const navigate = useNavigate();

    const heightRef = useRef(window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
          heightRef.current = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const replaceMergeFields = async (data) => {
        if (!container.current) return;
        const editor = container.current.documentEditor;
    
        for (const fieldName of Object.keys(data)) {
            const fieldPlaceholder = `«${fieldName}»`; // Format des champs
            await editor.search.findAll(fieldPlaceholder); // Trouve tous les champs du même nom
            
            if (editor.search.searchResults.length > 0) { // Vérifie si le champ est bien trouvé
                await editor.search.searchResults.replaceAll(data[fieldName]); // Remplace les valeurs
                await editor.search.searchResults.clear()
            } else {
                console.warn(`⚠️ Champ non trouvé : ${fieldPlaceholder}`);
            }
        }
    };
    
    useEffect(() => {
        setLoading(true)
        const fetchDocument = async () => {
            if (!url) return; // Vérifie si l'URL est définie
            try {
                const response = await axios.get(url, {
                    headers: { "Content-Type": "application/json" },
                });

                if (container.current) {
                    container.current.documentEditor.open(JSON.stringify(response.data));
                    container.current.toolbarItems = toolbarOptions;
                    // Met à jour les champs visibles
                    replaceMergeFields(mergeAllData)
                    setLoading(false);
                }
            } catch (error) {
                console.error("Erreur lors du chargement du fichier SFDT :", error);
                toast.error("Erreur de chargement du fichier !");
                setLoading(false);
            }
        };
        fetchDocument()
        .finally(() => setLoading(false))
    }, [url, mergeAllData]); // Recharge uniquement si `url` change


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
        <div className="w-full">

            <div className=" flex mb-5 justify-between items-center " >
                <h2 className="text-xl font-bold">Aperçu du brouillon</h2>
                <button 
                    disabled={isLoading}
                    onClick={() => saveBrouillon()}
                    className=" bg-green-500 px-4 text-white disabled:bg-gray-600 rounded-md h-[35px]  font-medium text-[13px] " 
                >
                    {isLoading ? "Enrégistrement..." : "Enrégistrer le brouillon"}
                </button>
            </div>
            
            {loading ? <p>Chargement en cours...</p> : null}

            <DocumentEditorContainerComponent
                ref={container}
                enableMailMerge={true}
                serviceUrl="https://services.syncfusion.com/react/production/api/documenteditor/"
                style={{ display: "block" }} height={heightRef.current-180} enableSfdtExport={true} enableToolbar={true} locale="fr-FR"
            />
        </div>
    );
};

export default ReviewActe;
