import { FolderAddOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { Button, Dropdown, Input, MenuProps, Segmented } from 'antd'
import React from 'react'
import { ModalOpenType, TodoModalOpenType} from '.'

type TodoHeaderPropsType = {
    openModal: ModalOpenType
    openTodoModal: TodoModalOpenType
}

const { Search } = Input;

const filterOptions = ["All", "Folder", "Todo"];

const TodoHeader = ({ openModal, openTodoModal }: TodoHeaderPropsType) => {

    const newButtonItems: MenuProps["items"] = [
        {
            key: "folder",
            label:  <div className='text-sm flex items-center justify-start gap-2 px-2 py-1'>
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

    const handleDropdownMenuClick = ({ key }: { key: string }) => {
        key === "folder" ? openModal("create") : openTodoModal(null, true, true, false);
    }

    const onSearch = (text: string) => {
        console.log(text)
    }

    return (
        <div className='p-2 bg-primary rounded-md flex flex-col items-center justify-between gap-2 relative sm:sticky top-0 left-0 z-10 sm:flex-row'>
            <Dropdown menu={{items: newButtonItems, inlineIndent: 50, onClick: handleDropdownMenuClick}}>
                <Button type="primary" icon={<PlusOutlined />} >New</Button>
            </Dropdown>
            <Search placeholder="input search text" onSearch={onSearch} enterButton className='w-full sm:!w-[400px]' />
            <Segmented options={filterOptions} />
        </div>
    )
}

export default TodoHeader
