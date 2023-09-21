import React, { useCallback, useState } from 'react'
import TodoHeader from './TodoHeader'
import TodoBody from './TodoBody'
import NameModal from './NameModal'
import { TodoContextType, TodoType, useTodoContext } from '@/context/TodoContext'
import PageNotFound from './404'
import TodoModal from './TodoModal'
import { App } from 'antd'

export type ModalOpenType = (type: "create" | "rename", id?: string | null, name?: string) => void
export type TodoModalOpenType = (todo: TodoType | null, isOpen:boolean, isCreate: boolean, isRename: boolean) => void

export type NameModalType = {
    id: string | null
    name?: string | null
    type: "create" | "rename"
    isOpen: boolean
}

export type TodoModalType = {
    todoItem: TodoType
    isOpen: boolean
    isRename: boolean
}

export type TodoBodyFilterType = {
    visibility: string;
    searchQuery: string;
}

const NAME_MODEL_INITIAL_VALUE: NameModalType = {
    id: null,
    isOpen: false,
    type: "create",
}

const TODO_INITIAL_VALUE: TodoType = {
    id: '',
    title: 'Untitled',
    todoContent: []
}

const TODO_MODEL_INITIAL_VALUE: TodoModalType = {
    todoItem: TODO_INITIAL_VALUE,
    isOpen: false,
    isRename: false,
}


const Todo = ( {folderId }: {folderId: string | null}) => {
    const { message } = App.useApp();

    const { isInvalidPage, createTodo } = useTodoContext() as TodoContextType

    const [nameModal, setNameModal] = useState<NameModalType>(NAME_MODEL_INITIAL_VALUE);
    const [todoModal, setTodoModal] = useState<TodoModalType>(TODO_MODEL_INITIAL_VALUE);

    const [filter, setFilter] = useState<TodoBodyFilterType>({
        visibility: "All",
        searchQuery: '',
    });

    const closeModal = (type: "folder" | "todo") => {
        type === "folder" && setNameModal(NAME_MODEL_INITIAL_VALUE)
        type === "todo" && setTodoModal(TODO_MODEL_INITIAL_VALUE)
    }

    const openModal: ModalOpenType = (type, id = null, name = '') => {
        setNameModal({type, isOpen: true, id, name})
    }

    const createNewTodo = useCallback(async () => {
        const res = await createTodo(folderId);
        
        if(!res){
          closeModal("todo");
          message.error("Error creating Todo - Try Again");
          return false;
        }

        setTodoModal(prev => {
            if(!prev.isOpen && !prev.todoItem)
                return prev
            
            return {...prev, todoItem: res as TodoType}
        });
        
    }, [folderId, createTodo, message])

    const openTodoModal: TodoModalOpenType = (todo, isOpen, isCreate, isRename) => {
        setTodoModal({todoItem: todo || TODO_INITIAL_VALUE, isOpen, isRename});
        isCreate && createNewTodo()
    }

    return (
        <>
            {
                !isInvalidPage ?
                <div className='p-2 relative'>
                    <TodoHeader openModal={openModal} openTodoModal={openTodoModal} filter={filter} setFilter={setFilter} />
                    <TodoBody openModal={openModal} folderId={folderId} openTodoModal={openTodoModal} filter={filter}/>

                    {/* name modal */}
                    {nameModal.isOpen && <NameModal closeModal={closeModal} parentFolderId={folderId}  {...nameModal} />}
                    {todoModal.isOpen && <TodoModal {...todoModal} closeModal={closeModal} />}
                </div> :
                <PageNotFound />
            }
        </>
    )
}

export default Todo
