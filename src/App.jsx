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


function App() {

  return (
    <div>
      <Routes>

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
