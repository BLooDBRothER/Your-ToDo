import { TodoContextType, useTodoContext } from '@/context/TodoContext'
import { App, Input, InputRef, Modal } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { NameModalType } from '.'

type NameModalPropsType = NameModalType & {
  parentFolderId: string | null
  closeModal: () => void
}

const NameModal = ({ type, isOpen, name, id, parentFolderId, closeModal }: NameModalPropsType) => {

  const { message } = App.useApp();
  const { createFolder, updateFolder } = useTodoContext() as TodoContextType;

  const [folderName, setFolderName] = useState(name || 'Untitled');
  const [error, setError] = useState('')

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
    if (folderName === '') {
      setError('Name Cannot be Empty');
      return;
    }
    const responseStatus = await createFolder(folderName, parentFolderId);
    afterRequest(responseStatus)
  }

  const updateCurrentFolder = async () => {
    if (!id || name === folderName) {
      setError('Same Name as Prevoius');
      return;
    }

    const responseStatus = await updateFolder(id, folderName);
    afterRequest(responseStatus)
  }

  useEffect(() => {
    if (!isOpen) return
    console.log(inputRef.current)
    inputRef.current?.focus({
      cursor: "end"
    })
  }, [isOpen])

  return (
    <Modal title={`${type === "create" ? "New" : "Update"} Folder`} open={isOpen} okText={`${type === "create" ? "Create" : "Rename"}`} onOk={type === "create" ? createNewFolder : updateCurrentFolder} onCancel={closeModal}>
      <Input placeholder='Enter Folder Name' value={folderName} status={`${error ? 'error' : ''}`} onChange={(e) => {
        setError('');
        setFolderName(e.target.value)
      }} onPressEnter={type === "create" ? createNewFolder : updateCurrentFolder} ref={inputRef} />
      <p className='text-sm ml-1'>{error}</p>
    </Modal>
  )
}

export default NameModal
