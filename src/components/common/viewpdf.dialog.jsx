import React, { useState } from "react";
import { produce } from "immer";
import {
  Button,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import { useDialogueStore } from "@/store/dialogue.store";
import {
  PdfViewerComponent,
  Toolbar,
  Magnification,
  Navigation,
  LinkAnnotation,
  BookmarkView,
  ThumbnailView,
  Print,
  TextSelection,
  TextSearch,
  Annotation,
  FormFields,
  FormDesigner,
  PageOrganizer,
  Inject,
} from "@syncfusion/ej2-react-pdfviewer";

// import { SwitchComponent } from "@syncfusion/ej2-react-buttons";

function ViewPdf() {
  const { setDialogue, dialogue } = useDialogueStore();
  let viewer;
  return (
    <>
      <DialogHeader className="flex items-center justify-between text-sm ">
        Visionner le pdf
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
      </DialogHeader>

      <DialogBody className=" h-[550px] flex flex-col" divider>
        <div className="control-section">
          <div className="flex-container">
            {/* <label htmlFor="checked" className="switchLabel">
              {" "}
              Standalone PDF Viewer{" "}
            </label> */}
            <div className="e-message render-mode-info">
              <span
                className="e-msg-icon render-mode-info-icon"
                title="Turn OFF to render the PDF Viewer as server-backed"
              ></span>
            </div>
            <div>
              {/* <SwitchComponent
                cssClass="buttonSwitch"
                id="checked"
                change={change}
                checked={true}
              ></SwitchComponent> */}
            </div>
          </div>
          {/* Render the PDF Viewer */}
          <PdfViewerComponent
            ref={(scope) => {
              viewer = scope;
            }}
            id="container"
            documentPath={dialogue.data.fileLocation}
            resourceUrl="https://cdn.syncfusion.com/ej2/23.2.6/dist/ej2-pdfviewer-lib"
            style={{ height: "500px" }}
          >
            <Inject
              services={[
                Toolbar,
                Magnification,
                Navigation,
                LinkAnnotation,
                BookmarkView,
                ThumbnailView,
                Print,
                TextSelection,
                TextSearch,
                Annotation,
                FormFields,
                FormDesigner,
                PageOrganizer,
              ]}
            />
          </PdfViewerComponent>
        </div>
      </DialogBody>

      <DialogFooter></DialogFooter>
    </>
  );

}

export default ViewPdf;
