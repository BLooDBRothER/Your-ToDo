import { TodoContextType, useTodoContext } from '@/context/TodoContext'
import { App, Input, InputRef, Modal } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { NameModalType } from '.'

type NameModalPropsType = NameModalType & {
  parentFolderId: string | null
  closeModal: (type: "folder" | "todo") => void
}

const NameModal = ({ type, isOpen, name, id, parentFolderId, closeModal }: NameModalPropsType) => {

  const { message } = App.useApp();
  const { createFolder, updateFolder, isLoading } = useTodoContext() as TodoContextType;

  const [folderName, setFolderName] = useState(name || 'Untitled');
  const [error, setError] = useState('')

  const inputRef = useRef<InputRef>(null)
  const showMessage = (isSuccess: boolean) => {
    isSuccess ? message.success(`Folder ${type === "create" ? "Created" : "Updated"} Successfully`) : message.error("Error - Please Try Again")
  }

  const afterRequest = (responseStatus: boolean) => {
    showMessage(responseStatus);
    setFolderName('');
    closeModal("folder");
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
    inputRef.current?.focus({
      cursor: "end"
    })
  }, [isOpen])

  return (
    <Modal title={`${type === "create" ? "New" : "Update"} Folder`} open={isOpen} confirmLoading={isLoading.folderEdit} okText={`${type === "create" ? "Create" : "Rename"}`} onOk={type === "create" ? createNewFolder : updateCurrentFolder} onCancel={closeModal.bind(null, "folder")}>
      <Input placeholder='Enter Folder Name' maxLength={150} showCount value={folderName} status={`${error ? 'error' : ''}`} onChange={(e) => {
        setError('');
        setFolderName(e.target.value)
      }} onPressEnter={type === "create" ? createNewFolder : updateCurrentFolder} ref={inputRef} />
      <p className='text-sm ml-1'>{error}</p>
    </Modal>
  )
}

export default NameModal
