import React, { useCallback, useEffect, useState } from 'react'
import TodoHeader from './TodoHeader'
import TodoBody from './TodoBody'
import NameModal from './NameModal'
import { useTodoContext } from '@/context/TodoContext'
import PageNotFound from './404'
import TodoModal from './TodoModal'
import { App } from 'antd'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { ModalOpenType, NameModalType, TodoContextType, TodoModalOpenType, TodoModalType, TodoType } from '@/lib/types'

const NAME_MODEL_INITIAL_VALUE: NameModalType = {
    id: null,
    isOpen: false,
    type: "create",
}

const TODO_MODEL_INITIAL_VALUE: TodoModalType = {
    todoId: '',
    isOpen: false,
    isRename: false,
}


const Todo = ( {folderId }: {folderId: string | null}) => {
    const { message } = App.useApp();

    const pathName = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const visibility = searchParams.get("visibility");


    const { data, isInvalidPage, createTodo, isLoading } = useTodoContext() as TodoContextType

    const [nameModal, setNameModal] = useState<NameModalType>(NAME_MODEL_INITIAL_VALUE);
    const [todoModal, setTodoModal] = useState<TodoModalType>(TODO_MODEL_INITIAL_VALUE);

    const closeModal = (type: "folder" | "todo") => {
        if(type === "folder")
         setNameModal(NAME_MODEL_INITIAL_VALUE)
        if(type === "todo"){
            router.push(`${pathName}${visibility ? `?visibility=${visibility}` : ''}`);
            setTodoModal(TODO_MODEL_INITIAL_VALUE)
        }
    }

    const openModal: ModalOpenType = (type, id = null, name = '') => {
        setNameModal({type, isOpen: true, id, name})
    }

    const createNewTodo = useCallback(async () => {

        message.open({
            type: 'loading',
            content: 'Creating Todo...',
            duration: 0,
        });

        const res = await createTodo(folderId);
        
        if(!res){
          message.error("Error creating Todo - Try Again");
          return false;
        }

        const todo = res as TodoType

        message.destroy();
        router.push(`${pathName}?todo_id=${todo.id}${visibility ? `&visibility=${visibility}` : ''}`);
        
    }, [folderId, createTodo, message, router, pathName, visibility]);

    const openTodoModal: TodoModalOpenType = (todoId, isRename) => {
        setTodoModal({todoId, isOpen: true, isRename});
    }

    useEffect(() => {
        if(isLoading.folder) return;
        const todoId = searchParams.get("todo_id");

        if(!todoId){
            todoModal.isOpen && closeModal("todo");
            return;            
        }

        const isRename = searchParams.get("rename_todo") === "true" ? true : false;

        if(!data.todo.find(todo => todo.id === todoId)){
            message.error("Invalid Todo ID")
            return;
        }
        
        openTodoModal(todoId, isRename);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, isLoading.folder])

    return (
        <>
            {
                !isInvalidPage ?
                <div className='p-2 relative h-full'>
                    <TodoHeader openModal={openModal} createNewTodo={createNewTodo} />
                    <TodoBody openModal={openModal} folderId={folderId} openTodoModal={openTodoModal}/>

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
