import { TodoContextType, useTodoContext } from '@/context/TodoContext'
import { Button, Input, Modal } from 'antd'
import React, { useState } from 'react'
import { NameModalType } from '.'

type NameModalPropsType = NameModalType & {
  closeModal: () => void
}

const NameModal = ({ type, isOpen, closeModal, name, id }: NameModalPropsType) => {

  const [folderName, setFolderName] = useState(name || '');

  const { createFolder } = useTodoContext() as TodoContextType;

  const createNewFolder = async () =>{
    const res = await createFolder(folderName, id)
  }

  return (
    <Modal title={`${type === "create" ? "New" : "Update"} Folder`} open={isOpen} okText={`${type === "create" ? "Create" : "Rename"}`} onCancel={closeModal}>
      <Input placeholder='Enter Folder Name' value={folderName} onChange={(e) => {setFolderName(e.target.value)}} />
    </Modal>
  )
}

export default NameModal
