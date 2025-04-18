import * as React from "react";
import { Link } from "react-router-dom";

import { FaFolderMinus } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa6";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";

import { FaFolderPlus } from "react-icons/fa6";

export default function SubFolder() {
  return (
    <div className="">
      <div className="my-6 flex flex-col justify-between lg:flex-row">
        <div className="order-2 w-full p-3 lg:order-1 lg:w-[80%]">
          <Breadcrumbs separator=">" aria-label="breadcrumb">
            <Link underline="hover" color="inherit" to="/">
              MUI
            </Link>
            <Link underline="hover" color="inherit" to="">
              Core
            </Link>
            <Typography color="text.primary">Sub Folder</Typography>
          </Breadcrumbs>

          <div className="my-4 flex flex-wrap">
            <Link
              to="/dashboard/old/files"
              className="my-3 mr-6 cursor-pointer"
            >
              <FaFolderMinus size={125} color="FFC312" />
              <h4>Sub Folder 1</h4>
            </Link>

            <Link
              to="/dashboard/old/files"
              className="my-3 mr-6 cursor-pointer"
            >
              <FaFolderMinus size={125} color="FFC312" />
              <h4>Sub Folder 2</h4>
            </Link>

            <Link
              to="/dashboard/old/files"
              className="my-3 mr-6 cursor-pointer"
            >
              <FaFolderMinus size={125} color="FFC312" />
              <h4>Sub Folder 3</h4>
            </Link>

            <Link
              to="/dashboard/old/files"
              className="my-3 mr-6 cursor-pointer"
            >
              <FaFolderMinus size={125} color="FFC312" />
              <h4>Sub Folder 4</h4>
            </Link>

            <Link
              to="/dashboard/old/files"
              className="my-3 mr-6 cursor-pointer"
            >
              <FaFolderMinus size={125} color="FFC312" />
              <h4>Sub Folder 5</h4>
            </Link>

            <Link
              to="/dashboard/old/files"
              className="my-3 mr-6 cursor-pointer"
            >
              <FaFolderMinus size={125} color="FFC312" />
              <h4>Sub Folder 6</h4>
            </Link>

            <Link
              to="/dashboard/old/files"
              className="my-3 mr-6 cursor-pointer"
            >
              <FaFolderMinus size={125} color="FFC312" />
              <h4>Sub Folder 7</h4>
            </Link>

            <Link
              to="/dashboard/old/files"
              className="my-3 mr-6 cursor-pointer"
            >
              <FaFolderMinus size={125} color="FFC312" />
              <h4>Sub Folder 8</h4>
            </Link>

            <div className="my-7 mr-7 flex h-[95px] w-[120px] cursor-pointer items-center justify-center rounded-md bg-secondary">
              <FaFolderPlus size={40} color="#2C93EB" />
            </div>
          </div>
        </div>

        <div className="order-1 w-full rounded-md border border-[#ddd] p-7 md:h-auto lg:order-2 lg:min-h-[90vh] lg:w-[20%] ">
          <div className="my-6 flex items-center">
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-md bg-red-600">
              <FaFolderMinus size={18} color="white" />
            </div>
            <div className="ml-8">
              <h2>Catégories du Sub Folder</h2>
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

          <h2 className="my-6 font-bold">Charger du Sub Folder</h2>

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
