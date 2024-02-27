import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import { MaterialTailwindControllerProvider } from "@/context";
import "../public/css/tailwind.css";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import { PhotoProvider } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

import dayjs from 'dayjs'
import 'dayjs/locale/fr';

dayjs.locale('fr')

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <PhotoProvider maskOpacity={0.5} loop={1} >
      <BrowserRouter>
        <ThemeProvider>
          <MaterialTailwindControllerProvider>
            <App />
            <ToastContainer autoClose={4000} />
          </MaterialTailwindControllerProvider>
        </ThemeProvider>
      </BrowserRouter>
    </PhotoProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
