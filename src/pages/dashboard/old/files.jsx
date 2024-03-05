import * as React from "react";
import { Link } from "react-router-dom";

import AddCommentIcon from "@mui/icons-material/AddComment";
import { FaFolderMinus } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa6";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { BsFiletypePdf } from "react-icons/bs";
import { FaFileWord } from "react-icons/fa6";

import { BiSolidFilePlus } from "react-icons/bi";

import ControlPointDuplicateIcon from "@mui/icons-material/ControlPointDuplicate";
import { red } from "@mui/material/colors";

export default function Files() {
  return (
    <div className="">
      <div className="my-6 flex flex-col justify-between lg:flex-row">
        <div className="order-2 w-full p-3 lg:order-1 lg:w-[70%] my-6">
          <Breadcrumbs separator=">" aria-label="breadcrumb">
            <Link underline="hover" color="inherit" to="/">
              MUI
            </Link>
            <Link underline="hover" color="inherit" to="">
              Core
            </Link>
            <Typography color="text.primary">Files</Typography>
          </Breadcrumbs>

          <div className="my-6">
            <h1 className="my-3">Informations utiles</h1>
            <div className="h-60 rounded-md p-4 outline-dashed outline-2 outline-gray-500">
              <p>...</p>
            </div>
          </div>

          <div className="my-10">
            <h1 className="">Fichiers</h1>

            <div className="flex flex-wrap">
              <div className="my-3 mr-6 cursor-pointer">
                <BsFiletypePdf size={100} color="#ff4757" />
                <h4 className="my-4 text-center">File 1</h4>
              </div>

              <div className="my-3 mr-6 cursor-pointer">
                <BsFiletypePdf size={100} color="#ff4757" />
                <h4 className="my-4 text-center">File 1</h4>
              </div>

              <div className="my-3 mr-6 cursor-pointer">
                <FaFileWord size={100} color="#2C93EB" />
                <h4 className="my-4 text-center">File 3</h4>
              </div>

              <div className="my-3 mr-6 cursor-pointer">
                <FaFileWord size={100} color="#2C93EB" />
                <h4 className="my-4 text-center">File 4</h4>
              </div>

              <div className="my-3 mr-6 cursor-pointer">
                <BsFiletypePdf size={100} color="#ff4757" />
                <h4 className="my-4 text-center">File 5</h4>
              </div>
              <div className="my-3 mr-6 cursor-pointer">
                <BsFiletypePdf size={100} color="#ff4757" />
                <h4 className="my-4 text-center">File 6</h4>
              </div>

              <div className="my-3 mr-6 cursor-pointer">
                <FaFileWord size={100} color="#2C93EB" />
                <h4 className="my-4 text-center">File 7</h4>
              </div>

              <div className="my-3 mr-6 cursor-pointer">
                <BsFiletypePdf size={100} color="#ff4757" />
                <h4 className="my-4 text-center">File 8</h4>
              </div>

              <div className="mt-2 mr-7 flex h-[105px] w-[80px] cursor-pointer items-center justify-center rounded-md bg-secondary">
                <BiSolidFilePlus size={40} color="#2C93EB" />
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 w-full rounded-lg border border-[#ddd] p-7 md:h-auto lg:order-2 lg:min-h-[90vh] lg:w-[20%] ">
          <div className="my-6 flex items-center">
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-md bg-red-600">
              <FaFolderMinus size={18} color="white" />
            </div>
            <div className="ml-8">
              <h2>Catégories du File</h2>
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

          <h2 className="my-6 font-bold">Charger du Dossier</h2>

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
