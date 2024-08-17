import { createContext, useState } from "react";

export const UserContexts= createContext({});

export const UserContextProvider = ({children})=>{
    const [userInfo,setUserInfo] = useState(null);
    return <UserContexts.Provider value={{userInfo,setUserInfo}}>
            {children}
    </UserContexts.Provider>
}