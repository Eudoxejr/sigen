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
import Roles from "./pages/dashboard/old/roles";
import AddRoles from "./pages/dashboard/old/addRoles";
import Folder from "./pages/dashboard/dossiers/folder";
import SubFolder from "./pages/dashboard/old/subFolder";
import Files from "./pages/dashboard/old/files";
import Profile from "./pages/dashboard/profile";
import Home from "./pages/dashboard/home";



function App() {

  return (
    <div>
      <Routes>

        <Route path="/auth/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth/*" element={<Auth />}>

          <Route path="login" element={<SignIn />} />
          <Route path="forgot-password" element={<ForgotPsw/>} />
          <Route path="reset-password" element={<ResetPsw/>} />

        </Route>

        {/* <Route path="unauthorized" element={<Unauthorized />} /> */}

        <Route path="/dashboard/" element={<Navigate to="/dashboard/accueil" replace />} />
        {/* <Route path="/" element={<Navigate to="/dashboard/accueil" replace />} /> */}
        <Route path="/" element={<Navigate to="/dashboard/dossiers" replace />} />

        <Route path="/dashboard/*"
          element={
            <RequireAuth >
              <Dashboard/>
            </RequireAuth>
          }
        >

          {/* <Route index path="accueil" element={<Home/>} /> */}
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
          </Route>

          <Route path="clients">
            <Route index element={<ClientsListe/>} />
          </Route>

          <Route path="minutes">
            <Route index element={<MinuteListe/>} />
            <Route path="add" element={<MinuteCreate/>} />
          </Route>

        </Route>

      </Routes>

      <Dialogue />

    </div>
  );
}

export default App;
