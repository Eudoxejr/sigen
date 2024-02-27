import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { stateToHTML } from 'draft-js-export-html';
import { htmlToText } from 'html-to-text';
import { ConfigsApi } from '@/api/api';
import { toast } from 'react-toastify';
import { stateFromHTML } from 'draft-js-import-html';
import { AiOutlineLoading } from 'react-icons/ai';
import { FiLoader } from 'react-icons/fi';
import { isAllowedTo } from '@/utils';
import { Permissions } from '@/data/role-access-data';

const PrivacyPolicies = ({
  className,
  ...props
}) => {
  const [htmlStr, setHtmlStr] = useState("");

  const [editorState, setEditorState] = useState(EditorState?.createEmpty());

  const [toolbarOptions, setToolbarOptions] = useState({
    options: [
      "inline",
      "blockType",
      "fontSize",
      "fontFamily",
      "list",
      "textAlign",
      "colorPicker",
      "link",
      "emoji",
      "remove",
      "history",
    ],
  });

  const onEditorStateChange = (newState) => {
    setEditorState(newState);
    setHtmlStr(stateToHTML(newState?.getCurrentContent()));
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!!htmlToText(htmlStr)?.trim()) {
      setLoading(true);
      await ConfigsApi.updatePolicies(htmlStr)
        .then(({ data: response }) => {
          if (response?.success) {
            toast.success("Les politiques de confidentialité ont été mises à jour !");
          } else {
            toast.error("Une erreur est survenue lors de l'enregistrement des politiques de confidentialité");
          }
        })
        .catch(_ => {
          toast.error("Une erreur est survenue lors de l'enregistrement des politiques de confidentialité");
        })
        .finally(() => setLoading(false));
    } else {
      toast.warn("Veuillez renseigner du contenu");
    }
  };

  // GET SAVED VALUE
  const [fetching, setFetching] = useState(false);

  const handleFetchPolicy = async () => {
    setFetching(true);
    await ConfigsApi.fetchHtmlConfig("policy")
      .then(({ data: response }) => {
        if (response?.success) {
          setEditorState(EditorState?.createWithContent(stateFromHTML(String(response?.data?.value) ?? "")));
          setHtmlStr(String(response?.data?.value) ?? "");
        } else {
          setEditorState(EditorState?.createEmpty());
          setHtmlStr("");
        }
      })
      .catch(_ => {
        setEditorState(EditorState?.createEmpty());
        setHtmlStr("");
      })
      .finally(() => setFetching(false));
  };

  useEffect(() => {
    handleFetchPolicy();
  }, []);

  return (
    <div
      className={`w-full flex flex-col items-center ${className ?? ''}`}
      {...props}
    >
      <div className="w-full h-[40px] flex items-center justify-center">
        {fetching && <AiOutlineLoading size={15} color="#0F123E" className="animate-spin" />}
      </div>
      <EditorWrapper className="mt-[20px]">
        <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={onEditorStateChange}
          editorStyle={{ height: "400px" }}
          toolbar={toolbarOptions}
          readOnly={false}
        />
      </EditorWrapper>
      {isAllowedTo(Permissions.EDIT_SYSTEM_CONFIGS) &&
        <SubmitButton
          className={`mt-[30px] flex items-center justify-center ${loading ? "loading" : ""}`}
          onClick={handleSubmit}
        >
          Enregistrer
          {loading && <FiLoader size={20} className="ml-3 animate-spin" />}
        </SubmitButton>
      }
    </div>
  );
};

export default PrivacyPolicies;

const EditorWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  font-size: 14px;
  .wrapperClassName {
    display: flex;
    flex-direction: column-reverse;
    background: #0F123E08;
    border: 1px solid #0F123EAA;
    border-radius: 10px;
  }
  .toolbarClassName {
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    margin-bottom: 0;
    margin-top: 5px;
    box-shadow: 0px 1.16177px 3.48531px rgba(0, 0, 0, 0.035),
      0px 0.617007px 1.85102px rgba(0, 0, 0, 0.0282725),
      0px 0.25675px 0.770251px rgba(0, 0, 0, 0.0196802);
    padding: 8px 6px 0;
    background-color: #fff;
    justify-content: space-evenly;
  }
  .editorClassName {
    padding: 8px;
  }
`;

const SubmitButton = styled.button`
  height: 45px;
  width: 350px;
  background: #0F123E;
  color: white;
  border: 2px solid #0000;
  border-radius: 7px;
  transition: all 0.2s ease-in-out;
  &.loading {
    background: white !important;
    color: #0F123E !important;
    border: 2px solid #0F123E !important;;
    transition: all 0.2s ease-in-out;
  }
  &:hover {
    background: #0F123EEE;
    color: white;
    border: 2px solid #0000;
    transition: all 0.2s ease-in-out;
  }
`;