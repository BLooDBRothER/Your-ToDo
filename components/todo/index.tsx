import React, { useState } from 'react'
import TodoHeader from './TodoHeader'
import TodoBody from './TodoBody'
import NameModal from './NameModal'

export type ModalOpenType = (type: "create" | "rename", id?: string | null) => void

type NameModalType = {
    isOpen: boolean
    type: "create" | "rename"
    id?: string | null
}

const NAME_MODEL_INITIAL_VALUE: NameModalType = {
    isOpen: false,
    type: "create",
}


const Todo = () => {

    const [nameModal, setNameModal] = useState<NameModalType>(NAME_MODEL_INITIAL_VALUE);

    const closeModal = () => {
        setNameModal(NAME_MODEL_INITIAL_VALUE)
    }

    const openModal = (type: "create" | "rename", id: string | null = null) => {
        console.log('kille')
        setNameModal({type, isOpen: true, id})
    }

    return (
        <div className='p-2'>
            <TodoHeader openModal={openModal} />
            <TodoBody openModal={openModal}/>

            {/* name modal */}
            <NameModal isOpen={nameModal.isOpen} type={nameModal.type} closeModal={closeModal} />
        </div>
    )
}

export default Todo
