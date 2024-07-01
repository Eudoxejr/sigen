import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import Dialogue from "./components/common/dialogue";
import RequireAuth from "./layouts/requireAuth";
import { SignIn } from "./pages/auth";
import ForgotPsw from "./pages/auth/forgot-psw";
import ResetPsw from "./pages/auth/reset-psw";
import {
  CategoriesListe,
  CategoriesCreate,
  CollaborateursListe,
  CategoriesEdit,
  ClientsListe,
  DossiersListe,
  DossierCreate,
  MinuteListe,
  MinuteCreate,
} from "./pages/dashboard";
import EditMinute from "./pages/dashboard/minutes/EditMinute";
import Folder from "./pages/dashboard/dossiers/folder";
import Profile from "./pages/dashboard/profile";
import Home from "./pages/dashboard/home";
import CollaboView from "./pages/dashboard/collaborateurs/ViewCollaborateurs";
import RolesListe from "./pages/dashboard/roles/RolesListe";



function App() {

  return (

    // <div className="scrollbar-thin w-screen h-screen scrollbar-thumb-primary scrollbar-track-secondary overflow-scroll" >


    <div className=" flex flex-col flex-1 w-screen h-screen overflow-y-scroll scrollbar-thin overflow-x-hidden " >

      <Routes>

        <Route path="/auth/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth/*" element={<Auth />}>
          <Route path="login" element={<SignIn />} />
          <Route path="forgot-password" element={<ForgotPsw/>} />
          <Route path="reset-password" element={<ResetPsw/>} />
        </Route>

        {/* <Route path="unauthorized" element={<Unauthorized />} /> */}

        <Route path="/dashboard/" element={<Navigate to="/dashboard/accueil" replace />} />
        <Route path="/" element={<Navigate to="/dashboard/accueil" replace />} />
        {/* <Route path="/" element={<Navigate to="/dashboard/dossiers" replace />} /> */}

        <Route path="/dashboard/*"
          element={
            <RequireAuth >
              <Dashboard/>
            </RequireAuth>
          }
        >

          <Route index path="accueil" element={<Home/>} />
          <Route path="profil" element={<Profile/>} />

          <Route path="dossiers">
            <Route index element={<DossiersListe/>} />
            <Route path="add" element={<DossierCreate/>} />
            <Route path="view" element={<Folder/>} />
          </Route>

          <Route path="categories">
            <Route index element={<CategoriesListe/>} />
            <Route path="add" element={<CategoriesCreate/>} />
            <Route path="edit" element={<CategoriesEdit/>} />
          </Route>

          <Route path="collaborateurs">
            <Route index element={<CollaborateursListe/>} />
            <Route path=":id" element={<CollaboView/>} />
          </Route>

          <Route path="clients">
            <Route index element={<ClientsListe/>} />
            <Route path=":id" element={<DossiersListe specificUser={true} />} />
          </Route>

          <Route path="minutes">
            <Route index element={<MinuteListe/>} />
            <Route path="add" element={<MinuteCreate/>} />
            <Route path="edit" element={<EditMinute/>} />
          </Route>

          <Route path="roles">
            <Route index element={<RolesListe/>} />
            <Route path="add" element={</>} />
            <Route path="edit" element={<EditMinute/>} />
          </Route>

        </Route>

      </Routes>

      <Dialogue />

    </div>

  );
}

export default App;
