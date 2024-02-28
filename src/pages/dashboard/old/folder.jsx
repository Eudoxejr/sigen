import * as React from "react";
import { Link } from "react-router-dom";

import AddCommentIcon from "@mui/icons-material/AddComment";
import { FaFolderMinus } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa6";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";

import ControlPointDuplicateIcon from "@mui/icons-material/ControlPointDuplicate";
import { red } from "@mui/material/colors";

export default function Folder() {
  return (
    <div className="">
      <div className="my-6 flex">
        <div className="w-[90%]">
          <Breadcrumbs separator=">"  aria-label="breadcrumb">
            <Link underline="hover" color="inherit" to="/">
              MUI
            </Link>
            <Link underline="hover" color="inherit" to="">
              Core
            </Link>
            <Typography color="text.primary">Breadcrumbs</Typography>
          </Breadcrumbs>

          <div className="my-4 flex flex-wrap">
            <div className="my-3 mr-6 cursor-pointer">
              <FaFolderMinus
                size={100}
                color="FFC312"
              />
              <h4>Dossier 1</h4>
            </div>

            <div className="my-3 mr-6 cursor-pointer">
              <FaFolderMinus
                size={100}
                color="FFC312"
              />
              <h4>Dossier 2</h4>
            </div>

            <div className="my-3 mr-6 cursor-pointer">
              <FaFolderMinus
                size={100}
                color="FFC312"
              />
              <h4>Dossier 3</h4>
            </div>

            <div className="my-3 mr-6 cursor-pointer">
              <FaFolderMinus
                size={100}
                color="FFC312"
              />
              <h4>Dossier 4</h4>
            </div>

            <div className="my-3 mr-6 cursor-pointer">
              <FaFolderMinus
                size={100}
                color="FFC312"
              />
              <h4>Dossier 5</h4>
            </div>

            <div className="my-3 mr-6 cursor-pointer">
              <FaFolderMinus
                size={100}
                color="FFC312"
              />
              <h4>Dossier 6</h4>
            </div>

            <div className="my-3 mr-6 cursor-pointer">
              <FaFolderMinus
                size={100}
                color="FFC312"
              />
              <h4>Dossier 7</h4>
            </div>

            <div className="my-3 mr-6 cursor-pointer">
              <FaFolderMinus
                size={100}
                color="FFC312"
              />
              <h4>Dossier 8</h4>
            </div>

            <div className="my-3 mr-6 cursor-pointer">
              <FaFolderMinus
                size={100}
                color="FFC312"
              />
              <h4>Dossier 9</h4>
            </div>

            <div className="my-3 mr-6 cursor-pointer">
              <FaFolderMinus
                size={100}
                color="FFC312"
              />
              <h4>Dossier 10</h4>
            </div>

            <div className="my-3 mr-6 cursor-pointer">
              <FaFolderMinus
                size={100}
                color="FFC312"
              />
              <h4>Dossier 11</h4>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#ddd] p-7 ">



          <div className="my-6 flex items-center">
          <div className="flex justify-center items-center w-[40px] h-[40px] bg-red-600 rounded-md">
          <FaFolderMinus
            size={18}
            color="white"
            
          />
          </div>
            <div className="ml-8">
              <h2>Catégories du dossier</h2>
              <p className="text-gray-500">Succession</p>
            </div>
          </div>

          <div className="my-6 flex items-center">
            <img
              className="h-16 w-16 rounded-full"
              src="/img/bruce-mars.jpeg"
            />
            <div className="ml-3">
              <h2>John DOE</h2>
              <p className="text-gray-500">johndoe@yahoo.fr</p>
            </div>
          </div>

          <h2 className="my-6 font-bold">Charger du dossier</h2>

          <div className="my-6 flex items-center">
            <img className="h-16 w-16 rounded-2xl" src="/img/bruce-mars.jpeg" />
            <div className="ml-3">
              <h2>Elvis DUCAN</h2>
              <p className="text-gray-500">Titulaire</p>
            </div>
          </div>

          <div className="my-6 flex items-center">
            <img className="h-16 w-16 rounded-2xl" src="/img/bruce-mars.jpeg" />
            <div className="ml-3">
              <h2>Elvis DUCAN</h2>
              <p className="text-gray-500">Supléant</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
