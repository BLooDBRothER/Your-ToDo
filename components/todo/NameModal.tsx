import { Button, Input, Modal } from 'antd'
import React from 'react'

type NameModalPropsType = {
  isOpen: boolean
  type: "create" | "rename"
  closeModal: () => void
}

const NameModal = ({ type, isOpen, closeModal }: NameModalPropsType) => {
  return (
    <Modal title={`${type === "create" ? "New" : "Update"} Folder`} open={isOpen} okText={`${type === "create" ? "Create" : "Rename"}`} onCancel={closeModal}>
      <Input placeholder='Enter Folder Name' />
    </Modal>
  )
}

export default NameModal
