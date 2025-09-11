import React from "react";
import { useAuth } from "../context/AuthContext.jsx";

const profile = () => {
    const {user, logout} = useAuth();
    return(
        <>
            {user ? <h1>Hello {user.firstName} </h1> : <h1>Error</h1>}
            
        </>
    )
}

export default profile;