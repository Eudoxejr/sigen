import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    
    const user = JSON.parse(localStorage.getItem('user'))
    // console.log(user);
    const [auth, setAuth] = useState(user || {});

    const value = { auth, setAuth }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;