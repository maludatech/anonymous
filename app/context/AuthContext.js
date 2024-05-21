"use client"

import { createContext, useReducer, useEffect } from "react";
import Cookies from "js-cookie"

export const AuthContext = createContext();

export const authReducer = (state, action) =>{
    switch (action.type) {
        case "LOGIN":
            Cookies.set('isLoggedIn', 'true');
            localStorage.setItem("user", JSON.stringify(action.payload)); // Save user data to localStorage
            return { user: action.payload };
        case "LOGOUT":
            Cookies.remove('isLoggedIn');
            localStorage.removeItem("user"); // Remove user data from localStorage
            return { user: null };
        default:
            return state;
    }
}

export const AuthContextProvider = ({children}) => {
    const[state, dispatch] = useReducer(authReducer,{
        user: null,
    })

    useEffect(()=> {
        const user = JSON.parse(localStorage.getItem("user"))
        
        if(user){
            dispatch({type: "LOGIN", payload: user})
        }
    }, [])
    
    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}