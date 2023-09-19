"use client";

import axios from "axios";
import { useContext, createContext, ReactNode, useState, useCallback } from "react";

export type TodoContextType = {
    data: DataType
    isLoading: LoadingType
    parentFolders: FolderType[]
    isInvalidPage: boolean
    getFolderData: (folderId: string | null) => void
    getOnlyFolder: (folderId?: string | null) => Promise<FolderType[]>
    createFolder: (name: string, folderId: string | null) => Promise<boolean>
    updateFolder: (name: string, folderId: string) => Promise<boolean>
    deleteFolder: (folderId: string) => Promise<boolean>
    createTodo: (folderId: string | null) => Promise<TodoType | boolean>
    getTodoData: (todoId: string) => Promise<boolean>
    deleteTodo: (todoId: string) => Promise<boolean>
    addTodo: (todoId: string, value: string) => Promise<boolean>
    updateTodo: (todoId: string, title?: string | null, date?: Date | null) => Promise<boolean>
    updateTodoContent: (todoId: string, todoContentId: string, field: "isCompleted" | "value", value: string | boolean) => Promise<boolean>
    deleteTodoContent: (todoId: string, todoContentId: string) => Promise<boolean>
    moveData: (sourceID: string, destinationId: string | null, folderToFolder: boolean) => Promise<boolean>
}

type LoadingType = {
    folder: boolean
    todo: boolean
    folderEdit: boolean
    todoCreating: boolean
    todoTitle: boolean
    todoContent: boolean
}

export type FolderType = {
    id:string
    name: string
}

type TodoContentType = {
    id: string
    value: string
    isCompleted: boolean
}

export type TodoType = {
    id: string
    title: string
    duedate?: Date
    todoContent: TodoContentType[]
}

type DataType = {
    folders: FolderType[]
    todo: TodoType[]
}

const todoContext = createContext<TodoContextType | null>(null);

export const useTodoContext = () => useContext(todoContext);

const TodoContextProvider = ({ children }: { children: ReactNode}) => {

    const [data, setData] = useState<TodoContextType["data"]>({
        folders: [],
        todo: []
    });
    const [parentFolders, setParentFolder] = useState<TodoContextType["parentFolders"]>([]);
    const [isInvalidPage, setInvalidPage] = useState<TodoContextType["isInvalidPage"]>(false);
    const [isLoading, setIsLoading] = useState<TodoContextType["isLoading"]>({
        folder: true,
        todo: false,
        folderEdit: false,
        todoCreating: false,
        todoTitle: false,
        todoContent: false
    })

    // ---------------------------- Folder Methods ---------------------------------
    const createFolder: TodoContextType["createFolder"] = async (name, folderId) => {
        setIsLoading(prev => ({...prev, folderEdit: true}))
        try{
            const res = await axios.post("/api/folder", {name, folderId});

            setData(prev => {
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
        finally{
            setIsLoading(prev => ({...prev, folderEdit: false}))
        }
    }

    const getAncestorsOfFolder = async (folderId: string) => {
        try{
            const res = await axios.get(`/api/folder/${folderId}/get-parent`);
            
            if(res.data.folders.length === 0){
                setInvalidPage(true);
                return;
            }
    
            setParentFolder(res.data.folders)
        }
        catch{}
    }

    const getFolderData = useCallback(async (folderId: string | null = null) => {
        // reset before request
        setInvalidPage(false);
        setIsLoading(prev => ({...prev, folder: true}));

        const uri = folderId ? `/api/folder/${folderId}` : '/api/folder';
        
        setData(prev => ({...prev, folders: []}));
        
        !folderId && setParentFolder([]);        
        folderId && getAncestorsOfFolder(folderId);

        try{
            const res = await axios.get(uri);
            console.log(res.data)
            setData({folders: res.data.folders, todo: res.data.todo});
    
            return true
        }
        catch (err: unknown){
            console.log(err)
            if(axios.isAxiosError(err)){
                if(err.response?.status === 404)
                    setInvalidPage(true)
                return false;
            }
            return false;
        }
        finally{
            setIsLoading(prev => ({...prev, folder: false}));
        }
    }, [])

    const getOnlyFolder: TodoContextType["getOnlyFolder"] = async (folderId = null) => {;

        const uri = folderId ? `/api/folder/${folderId}/?onlyFolder=true` : '/api/folder/?onlyFolder=true';

        try{
            const res = await axios.get(uri);    
            return res.data.folders
        }
        catch (err: unknown){
            console.log(err)
            if(axios.isAxiosError(err)){
                if(err.response?.status === 404)
                    setInvalidPage(true)
                return [];
            }
            return [];
        }
        finally{
            setIsLoading(prev => ({...prev, folder: false}));
        }
    }

    const updateFolder: TodoContextType["updateFolder"] = async (folderId, name) => {
        setIsLoading(prev => ({...prev, folderEdit: true}))
        try {
            await axios.patch(`/api/folder/${folderId}`, {
                name
            });
            setData(prev => {
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
        finally{
            setIsLoading(prev => ({...prev, folderEdit: false}))
        }
    }

    const deleteFolder: TodoContextType["deleteFolder"] = async (folderId) => {
        try {
            await axios.delete(`/api/folder/${folderId}`);

            setData(prev => {
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

    // ---------------------------- Todo Methods ---------------------------------
    const createTodo: TodoContextType["createTodo"] = async (folderId) => {
        const title = "Untitled";
        try{
            setIsLoading(prev => ({...prev, todoCreating: true}));
            const res = await axios.post("/api/todo", {title, folderId});
            
            const newTodo: TodoType = {
                id: res.data.todoId as string,
                title,
                todoContent: []
            }

            setData(prev => {
                const prevCpy = [...prev.todo];
                prevCpy.push(newTodo);
                console.log(prevCpy)
    
                return {...prev, todo: prevCpy}
            });
    
            return newTodo
        }
        catch (err: unknown){
            if(axios.isAxiosError(err)){
                return false;
            }
            return false;
        }
        finally{
            setIsLoading(prev => ({...prev, todoCreating: false}));
        }
    }

    const getTodoData: TodoContextType["getTodoData"] = async (todoId) => {
        try{
            setIsLoading(prev => ({...prev, todo: true}));
            const res = await axios.get(`/api/todo/${todoId}`);

            setData(prev => {
                const prevCpy = [...prev.todo];
                
                const updatedTodo = prevCpy.map(todo => {
                    if(todo.id === todoId){
                        todo.todoContent = res.data.todoContent;
                    }
                    return todo;
                })
    
                return {...prev, todo: updatedTodo}
            });
    
            return true;
        }
        catch (err: unknown){
            if(axios.isAxiosError(err)){
                return false;
            }
            return false;
        }
        finally{
            setIsLoading(prev => ({...prev, todo: false}));
        }
    }

    const addTodo: TodoContextType["addTodo"] = async (todoId, value) => {
        try{
            setIsLoading(prev => ({...prev, todoContent: true}));
            const res = await axios.post(`/api/todo/${todoId}`, {value});
            setData(prev => {
                const prevCpy = [...prev.todo];
                
                const updatedTodo = prevCpy.map(todo => {
                    if(todo.id === todoId){
                        todo.todoContent.push(
                            {
                                id: res.data.todoContentId,
                                value,
                                isCompleted: false
                            }
                        )
                    }
                    return todo;
                })
    
                return {...prev, todo: updatedTodo}
            });
            return true;
        }
        catch (err: unknown){
            return false;
        }
        finally{
            setIsLoading(prev => ({...prev, todoContent: false}));
        }
    }

    const deleteTodo: TodoContextType["deleteTodo"] = async (todoId) => {
        try{
            await axios.delete(`/api/todo/${todoId}`);

            setData(prev => {
                const updatedData = prev.todo.filter(each => each.id !== todoId);
                return {...prev, todo: updatedData}
            })
            return true
        }
        catch {
            return false
        }
    }

    const updateTodo: TodoContextType["updateTodo"] = async (todoId, title = null, dueDate = null) => {
        try{
            setIsLoading(prev => ({...prev, todoTitle: true}));
            await axios.patch(`/api/todo/${todoId}`, {title, dueDate});
            title && setData(prev => {
                const prevCpy = [...prev.todo];
                
                const updatedTodo = prevCpy.map(todo => {
                    if(todo.id === todoId){
                        todo.title = title;
                    }
                    return todo;
                })
    
                return {...prev, todo: updatedTodo}
            });
            return true;
        }
        catch (err: unknown){
            return false;
        }
        finally{
            setIsLoading(prev => ({...prev, todoTitle: false}));
        }
    }

    const updateTodoContent: TodoContextType["updateTodoContent"] = async (todoId, todoContentId, field, value) => {
        try{
            await axios.patch(`/api/todo/${todoId}/${todoContentId}`, {field, value})
            setData(prev => {
                const updatedTodo = prev.todo.map(todo => {
                    if(todo.id === todoId){
                        todo.todoContent = todo.todoContent.map(todoContent => {
                            if(todoContent.id === todoContentId){
                                return {...todoContent, [field]: value}
                            }
                            return todoContent;
                        })
                    }
                    return todo;
                })
                    
                return {...prev, todo: updatedTodo}
            });
            return true
        }
        catch (err: unknown){
            return false;
        }
    }

    const deleteTodoContent: TodoContextType["deleteTodoContent"] = async (todoId, todoContentId) => {
        try {
            await axios.delete(`/api/todo/${todoId}/${todoContentId}`);
            setData(prev => {
                const updatedTodo = prev.todo.map(todo => {
                    if(todo.id === todoId)
                        todo.todoContent = todo.todoContent.filter(todoContent => todoContent.id !== todoContentId)
                    return todo
                })
                    
                return {...prev, todo: updatedTodo}
            });
            return true
        }
        catch {
            return false;
        }
    }

    const moveData: TodoContextType["moveData"] = async (sourceId, destinationId, folderToFolder) => {
        try {
            await axios.patch(`/api/folder/move`, {sourceId, destinationId, folderToFolder});
            setData(prev => {
                const type = folderToFolder ? "folders" : "todo"

                let currData: FolderType[] | TodoType[], updatedTodo: FolderType[] | TodoType[]
                
                if(folderToFolder){
                    currData = prev[type] as FolderType[];
                    updatedTodo = currData.filter(data => data.id !== sourceId) as FolderType[]
                }
                else{
                    currData = prev[type] as TodoType[];
                    updatedTodo = currData.filter(data => data.id !== sourceId) as TodoType[]
                }
                    
                return {...prev, [type]: updatedTodo}
            });
            return true
        }
        catch {
            return false;
        }
    }

    return (
        <todoContext.Provider value={{data, parentFolders, isLoading, isInvalidPage, createFolder, getFolderData, getOnlyFolder, updateFolder, deleteFolder, createTodo, getTodoData, deleteTodo, addTodo, updateTodo, updateTodoContent, deleteTodoContent, moveData}} >
            {children}
        </todoContext.Provider>
    )
}

export default TodoContextProvider;
