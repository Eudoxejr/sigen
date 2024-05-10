import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "@/store/user.store"

const RequireAuth = ({ allowedRoles, children }) => {

    const {user} = useUserStore()
    const location = useLocation();

    console.log(user);

    return (
        // allowedRoles?.includes(user.role)
        user? 
            null
            // children
        : user?.idUser
        ? <Navigate to="/unauthorized" state={{ from: location }} />
        : <Navigate to="/auth/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;