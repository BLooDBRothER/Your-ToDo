import { FolderAddOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { Button, Dropdown, Input, MenuProps, Segmented } from 'antd'
import React from 'react'
import { ModalOpenType } from '.'

type TodoHeaderPropsType = {
    openModal: ModalOpenType
}

const { Search } = Input;

const filterOptions = ["All", "Folder", "Todo"];

const TodoHeader = ({ openModal }: TodoHeaderPropsType) => {

    const newButtonItems: MenuProps["items"] = [
        {
            key: "folder",
            label:  <div className='text-sm flex items-center justify-start gap-2 px-2 py-1' onClick={openModal.bind(null, "create", null, '')}>
                        <span><FolderAddOutlined /></span>
                        <span>Folder</span>
                    </div>
        },
        {
            key: "todo",
            label:  <div className='text-sm flex items-center justify-start gap-2 px-2 py-1'>
                        <span><UnorderedListOutlined /></span>
                        <span>Todo</span>
                    </div>
        }
    ]

    const onSearch = (text: string) => {
        console.log(text)
    }

    return (
        <div className='p-2 bg-primary rounded-md flex items-center justify-between gap-2'>
            <Dropdown menu={{items: newButtonItems, inlineIndent: 50}}>
                <Button type="primary" icon={<PlusOutlined />} >New</Button>
            </Dropdown>
            <Search placeholder="input search text" onSearch={onSearch} enterButton className='!w-[400px]' />
            <Segmented options={filterOptions} />
        </div>
    )
}

export default TodoHeader
