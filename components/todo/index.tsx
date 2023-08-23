import React, { useState } from 'react'
import TodoHeader from './TodoHeader'
import TodoBody from './TodoBody'
import NameModal from './NameModal'

export type ModalOpenType = (type: "create" | "rename", id?: string | null, name?: string) => void

export type NameModalType = {
    id: string | null
    name?: string | null
    type: "create" | "rename"
    isOpen: boolean
}

const NAME_MODEL_INITIAL_VALUE: NameModalType = {
    id: null,
    isOpen: false,
    type: "create",
}


const Todo = ( {folderId }: {folderId: string | null}) => {

    const [nameModal, setNameModal] = useState<NameModalType>(NAME_MODEL_INITIAL_VALUE);

    const closeModal = () => {
        setNameModal(NAME_MODEL_INITIAL_VALUE)
    }

    const openModal = (type: "create" | "rename", id: string | null = null, name: string = '') => {
        console.log('kille')
        setNameModal({type, isOpen: true, id, name})
    }

    return (
        <div className='p-2'>
            <TodoHeader openModal={openModal} />
            <TodoBody openModal={openModal} folderId={folderId}/>

            {/* name modal */}
            {nameModal.isOpen && <NameModal isOpen={nameModal.isOpen} type={nameModal.type} closeModal={closeModal} id={nameModal.id} name={nameModal.name} parentFolderId={folderId} />}
        </div>
    )
}

export default Todo
