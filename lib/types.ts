export type ModalOpenType = (type: "create" | "rename", id?: string | null, name?: string) => void
export type TodoModalOpenType = (todoId: string, isRename: boolean) => void
export type OpenMoveModalType = (id: string, name: string, type: "Folder" | "Todo") => void

export type NameModalType = {
    id: string | null
    name?: string | null
    type: "create" | "rename"
    isOpen: boolean
}

export type TodoModalType = {
    todoId: string
    isOpen: boolean
    isRename: boolean
}

export type TodoBodyFilterType = {
    visibility: string;
    searchQuery: string;
}


// TodoContextType

export type TodoContextType = {
    data: TodoDataType
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
    addMultipleTodo: (todoId: string, data: {value: string, isCompleted: boolean}[]) => Promise<boolean>
    updateTodo: (todoId: string, field: 'title' | 'dueDate', value: string | Date | null) => Promise<boolean>
    updateTodoContent: (todoId: string, todoContentId: string, field: "isCompleted" | "value", value: string | boolean) => Promise<boolean>
    deleteTodoContent: (todoId: string, todoContentId: string) => Promise<boolean>
    moveData: (sourceID: string, destinationId: string | null, folderToFolder: boolean) => Promise<boolean>
}

export type LoadingType = {
    folder: boolean
    todo: boolean
    folderEdit: boolean
    todoCreating: boolean
    todoTitle: boolean
    todoContent: number[]
}

export type FolderType = {
    id:string
    name: string
}

export type TodoContentType = {
    id: string
    value: string
    isCompleted: boolean
    notSynced?: boolean
}

export type TodoType = {
    id: string
    title: string
    duedate?: Date
    todoContent: TodoContentType[]
}

export type TodoDataType = {
    folders: FolderType[]
    todo: TodoType[]
}

// UserContextType

export type UserContextType = {
    userData: UserDataType
    isUserDataLoading: UserDataLoadingType
    updateUserMetaData: (field: "emailRemainder" | "relativeTime", value: boolean) => Promise<boolean>
}

export type UserDataType = {
    emailRemainder: boolean
    relativeTime: boolean
}

export type UserDataLoadingType = UserDataType
