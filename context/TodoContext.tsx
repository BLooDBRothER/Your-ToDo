"use client";

import axios from "axios";
import { useContext, createContext, ReactNode, useState, useEffect, useCallback } from "react";

export type TodoContextType = {
    folderData: FolderDataType
    isLoading: LoadingType
    createFolder: (name: string, folderId: string | null) => Promise<boolean>
    getFolderData: (folderId: string | null) => void
}

type LoadingType = {
    folder: boolean
}

type FolderType = {
    id:string
    name: string
}

type FolderDataType = {
    folders: FolderType[]
}

const todoContext = createContext<TodoContextType | null>(null);

export const useTodoContext = () => useContext(todoContext);

const TodoContextProvider = ({ children }: { children: ReactNode}) => {

    const [folderData, setFolderData] = useState<FolderDataType>({
        folders: []
    });

    const [isLoading, setIsLoading] = useState({
        folder: true
    })

    const createFolder = async (name: string, folderId: string | null) => {
        try{
            const res = await axios.post("/api/folder", {name, id: folderId});

            setFolderData(prev => {
                const prevCpy = [...prev.folders];
                const newFolder = {
                    id: res.data.folderId as string,
                    name,
                }
                prevCpy.push(newFolder);
    
                return {...prev, folders: prevCpy}
            });
    
            return true
        }
        catch (err: unknown){
            if(axios.isAxiosError(err)){
                return false;
            }
            return false;
        }
    }

    const getFolderData = useCallback(async (folderId: string | null = null) => {
        setIsLoading(prev => ({...prev, folder: true}));
        const uri = folderId ? `/api/folder/${folderId}` : '/api/folder';
        setFolderData(prev => ({...prev, folders: []}))
        try{
            const res = await axios.get(uri);
            console.log(res.data)
            setFolderData(prev => ({...prev, folders: res.data.folders}));
    
            return true
        }
        catch (err: unknown){
            console.log(err)
            if(axios.isAxiosError(err)){
                return false;
            }
            return false;
        }
        finally{
            setIsLoading(prev => ({...prev, folder: false}));
        }
    }, [])

    return (
        <todoContext.Provider value={{folderData, createFolder, getFolderData, isLoading}} >
            {children}
        </todoContext.Provider>
    )
}

export default TodoContextProvider;
