"use client";

import axios from "axios";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

export type UserContextType = {
    userData: UserDataType
    isUserDataLoading: UserDataLoadingType
    updateUserMetaData: (field: "emailRemainder" | "relativeTime", value: boolean) => Promise<boolean>
}

type UserDataType = {
    emailRemainder: boolean
    relativeTime: boolean
}

type UserDataLoadingType = UserDataType


const userContext = createContext<UserContextType | null>(null);

export const useUserContext = () => useContext(userContext);

const UserContextProvider = ({ children }: { children: ReactNode }) => {
    const [userData, setUserData] = useState<UserDataType>({
        emailRemainder: true,
        relativeTime: true
    });

    const [isUserDataLoading, setUserDataLoading] = useState<UserDataLoadingType>({
        emailRemainder: true,
        relativeTime: true
    });

    const getUserMetaData = async () => {
        try{
            setUserDataLoading({
                emailRemainder: true,
                relativeTime: true
            });
            const res = await axios.get("/api/user");
            setUserData(res.data);
        }
        catch{}
        finally{
            setUserDataLoading({
                emailRemainder: false,
                relativeTime: false
            });
        }
    }

    const updateUserMetaData: UserContextType["updateUserMetaData"] = async (field, value) => {
        try {
            console.log(field, value)
            setUserDataLoading(prev => ({...prev, [field]: true}));

            const res = await axios.patch("/api/user", {field, value});
            setUserData(prev => ({...prev, [field]: value}));
            return true
        }
        catch{
            return false
        }
        finally{
            setUserDataLoading(prev => ({...prev, [field]: false}));
        }
    }

    useEffect(() => {
        getUserMetaData();
    }, [])

    return (
        <userContext.Provider value={{ userData, isUserDataLoading, updateUserMetaData }} >
            {children}
        </userContext.Provider>
    )
}

export default UserContextProvider;
