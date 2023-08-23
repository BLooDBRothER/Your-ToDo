"use client";

import axios from "axios";
import { useContext, createContext, ReactNode, useState, useEffect, useCallback } from "react";

export type TodoContextType = {
    folderData: FolderDataType
    isLoading: LoadingType
    parentFolders: FolderType[]
    getFolderData: (folderId: string | null) => void
    createFolder: (name: string, folderId: string | null) => Promise<boolean>
    updateFolder: (name: string, folderId: string) => Promise<boolean>
    deleteFolder: (folderId: string) => Promise<boolean>
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

    const [parentFolders, setParentFolder] = useState<FolderType[]>([])

    const [isLoading, setIsLoading] = useState({
        folder: true
    })

    const createFolder = async (name: string, folderId: string | null) => {
        try{
            const res = await axios.post("/api/folder", {name, folderId});

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

    const getAncestorsOfFolder = async (folderId: string) => {
        const res = await axios.get(`/api/folder/${folderId}/get-parent`);
        setParentFolder(res.data.folders)
    }

    const getFolderData = useCallback(async (folderId: string | null = null) => {
        setIsLoading(prev => ({...prev, folder: true}));

        const uri = folderId ? `/api/folder/${folderId}` : '/api/folder';
        
        setFolderData(prev => ({...prev, folders: []}));
        
        !folderId && setParentFolder([]);        
        folderId && getAncestorsOfFolder(folderId);

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

    const updateFolder = async (folderId: string, name: string) => {
        try {
            await axios.patch(`/api/folder/${folderId}`, {
                name
            });
            setFolderData(prev => {
                const folderCpy = [...prev.folders];

                folderCpy.map(folder => {
                    if(folder.id === folderId){
                        folder.name = name;
                        return folder
                    }
                    return folder;
                })

                return {...prev, folders: folderCpy};
            });
            return true;
        }
        catch(err: unknown) {
            return false
        }
    }

    const deleteFolder = async (folderId: string) => {
        try {
            await axios.delete(`/api/folder/${folderId}`);

            setFolderData(prev => {
                const folderCpy = [...prev.folders];

                const newFolders = folderCpy.filter(folder => folder.id !== folderId)

                return {...prev, folders: newFolders};
            });

            return true;
        }
        catch(err: unknown) {
            return false
        }
    }

    return (
        <todoContext.Provider value={{folderData, isLoading, parentFolders, createFolder, getFolderData, updateFolder, deleteFolder}} >
            {children}
        </todoContext.Provider>
    )
}

export default TodoContextProvider;
