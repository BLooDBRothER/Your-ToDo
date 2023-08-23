import { TodoContextType, useTodoContext } from '@/context/TodoContext'
import { App, Input, InputRef, Modal } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { NameModalType } from '.'

type NameModalPropsType = NameModalType & {
  parentFolderId: string | null
  closeModal: () => void
}

const NameModal = ({ type, isOpen, name, id, parentFolderId, closeModal}: NameModalPropsType) => {

  const { message } = App.useApp();
  const { createFolder, updateFolder } = useTodoContext() as TodoContextType;

  const [folderName, setFolderName] = useState(name || '');

  const inputRef = useRef<InputRef>(null)
  const showMessage = (isSuccess: boolean) => {
    isSuccess ? message.success(`Folder ${type === "create" ? "Created" : "Updated"} Successfully`) : message.error("Error - Please Try Again")
  }
  
  const afterRequest = (responseStatus: boolean) => {
    showMessage(responseStatus);
    setFolderName('');
    closeModal();
  }

  const createNewFolder = async () => {
    const responseStatus = await createFolder(folderName, parentFolderId);
    afterRequest(responseStatus)
  }

  const updateCurrentFolder = async () => {
    if(!id || name === folderName) return;

    const responseStatus = await updateFolder(id, folderName);
    afterRequest(responseStatus)
  }

  console.log(parentFolderId)

  useEffect(() => {
    if(!isOpen) return
    console.log(inputRef.current)
    inputRef.current?.focus({
      cursor: "end"
    })
  }, [isOpen])

  return (
    <Modal title={`${type === "create" ? "New" : "Update"} Folder`} open={isOpen} okText={`${type === "create" ? "Create" : "Rename"}`} onOk={type === "create" ?createNewFolder : updateCurrentFolder} onCancel={closeModal}>
      <Input placeholder='Enter Folder Name' value={folderName} onChange={(e) => {setFolderName(e.target.value)}} ref={inputRef} />
    </Modal>
  )
}

export default NameModal
