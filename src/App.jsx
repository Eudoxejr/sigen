import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import Dialogue from "./components/common/dialogue";
import RequireAuth from "./layouts/requireAuth";
import { SignIn } from "./pages/auth";
import {
  CategoriesListe,
  CategoriesCreate,
  CollaborateursListe,
  ClientsListe
} from "./pages/dashboard";
import Roles from "./pages/dashboard/old/roles";
import AddRoles from "./pages/dashboard/old/addRoles";
import Folder from "./pages/dashboard/old/folder";
import SubFolder from "./pages/dashboard/old/subFolder";
import Files from "./pages/dashboard/old/files";


function App() {

  return (
    <div>
      <Routes>

        <Route path="/dashboard/old/roles" element= {<Roles/>} />

        <Route path="/dashboard/old/add-role" element= {<AddRoles/>} />

        <Route path="/dashboard/old/folder" element= {<Folder/>} />

        <Route path="/dashboard/old/subFolder" element= {<SubFolder/>} />

        <Route path="/dashboard/old/files" element= {<Files/>} />

        <Route path="/dashboard/old" element= {<AddRoles/>} />

        <Route path="/auth/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth/*" element={<Auth />}>

          <Route path="login" element={<SignIn />} />
          {/* <Route path="ForgotPassword" element={<ForgetMdp />} />
          <Route path="/reset_password/:id" element={<ResetMdp/>} /> */}

        </Route>

        {/* <Route path="unauthorized" element={<Unauthorized />} /> */}

        <Route path="/dashboard/" element={<Navigate to="/dashboard/accueil" replace />} />
        <Route path="/" element={<Navigate to="/dashboard/accueil" replace />} />

        <Route path="/dashboard/*"
          element={
            <RequireAuth >
              <Dashboard/>
            </RequireAuth>
          }
        >

          <Route index path="home" element={null} />
          <Route path="profile" element={null} />

          <Route path="categories">
            <Route index element={<CategoriesListe/>} />
            <Route path="add" element={<CategoriesCreate/>} />
          </Route>

          <Route path="collaborateurs">
            <Route index element={<CollaborateursListe/>} />
            <Route path="add" element={<CategoriesCreate/>} />
          </Route>

          <Route path="clients">
            <Route index element={<ClientsListe/>} />
            <Route path="add" element={<CategoriesCreate/>} />
          </Route>

        </Route>

      </Routes>

      <Dialogue />

    </div>
  );
}

export default App;
