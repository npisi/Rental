import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { BASE_URL } from "../components/constants.js";

const profile = () => {
    const {user, logout} = useAuth();
    const [currentUser , setCurrentUser] = useState([])

    useEffect(() => {
        getUSer()
},[])

    const getUSer =  async () =>{
        const res = await fetch(`${BASE_URL}/user/get-user`)
        const data = await res.json()
        console.log(data)
    }

    return(
        <>
            {user ? <h1>Hello {user.firstName} </h1> : <h1>Error</h1>}
            
        </>
    )
}

export default profile;