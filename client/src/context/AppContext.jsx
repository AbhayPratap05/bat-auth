import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext()
export const AppContextProvider = (props)=>{

    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);

    const getAuthState = async () => {
        try {
          const { data } = await axios.post(backendUrl + '/api/auth/is-auth');
          if (data.success) {
            setIsLoggedin(true);
            getUserData();
          } else {
            setIsLoggedin(false);
            setUserData(null);
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          setIsLoggedin(false);
          setUserData(null);
        }
      };

    const getUserData = async ()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/user/data')
            data.success ? setUserData(data.userData) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        getAuthState();
    }, []);

    const value = {
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
