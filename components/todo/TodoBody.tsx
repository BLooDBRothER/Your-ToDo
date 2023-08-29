import { FolderFilled, HomeOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { Breadcrumb, Divider } from 'antd'
import React, { useEffect, useState } from 'react'
import Folder from './Folder'
import { ModalOpenType } from '.'
import { TodoContextType, useTodoContext } from '@/context/TodoContext'
import TodoLoading from './TodoLoading'
import NoData from '../NoData'
import Link from 'next/link'
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb'
import TodoFile from './TodoFile'

type TodoBodyPropsType = {
    folderId: string | null
    openModal: ModalOpenType
}

const TodoBody = ({ folderId, openModal }: TodoBodyPropsType) => {
    const { folderData, isLoading, parentFolders, getFolderData } = useTodoContext() as TodoContextType;

    const [breadcrumbItem, setBreadcrumbItem] = useState<BreadcrumbItemType[]>([
        {
          title: <Link href="/" className='!flex items-center gap-1'>
                    <HomeOutlined />
                    <span>Home</span>
                 </Link>
        },
    ])

    useEffect(() => {
        const breadCrumb: BreadcrumbItemType[] = [
            {
              title: <Link href="/" className='!flex items-center gap-1'>
                        <HomeOutlined />
                        <span>Home</span>
                     </Link>
            },
        ]

        parentFolders.forEach(folder => {
            const tempItem = {
                title: <Link href={`/folder/${folder.id}`} className='!flex items-center gap-1'>
                            <span>{folder.name}</span>
                        </Link>
            }
            breadCrumb.push(tempItem)
        })
        setBreadcrumbItem(breadCrumb)

    }, [parentFolders])

    useEffect(() => {
        getFolderData(folderId);
    }, [getFolderData, folderId])

    return (
        <div>
            <div className='text-light mx-2 my-4'>
                <Breadcrumb separator=">" items={breadcrumbItem}  />
            </div>

            <div className='my-4 mx-2 text-2xl flex items-center justify-start gap-4'>
                <FolderFilled className='text-light/50' />
                <h1>Folders</h1>
            </div>

            <div className='p-2 folder-todo-cnt sm:flex sm:items-center sm:justify-start gap-4 flex-wrap'>
                {isLoading.folder ? 
                    <TodoLoading type='folder' />:
                    <>
                        {folderData.folders.map(folder => (
                            <Folder key={folder.id} id={folder.id} name={folder.name} openModal={openModal} />
                        ))}
                    </>
                }
                {folderData.folders.length === 0 && !isLoading.folder && <NoData />}
            </div>

            <Divider />

            <div className='my-4 mx-2 text-2xl flex items-center justify-start gap-4'>
                <UnorderedListOutlined className='text-light/50' />
                <h1>Todo</h1>
            </div>

            {/* <div className='p-2 flex items-stretch justify-evenly sm:justify-start gap-4 flex-wrap'> */}
            <div className='p-2 folder-todo-cnt'>
                {/* <TodoLoading type='todo' /> */}
                <TodoFile />
            </div>
        </div>
    )
}

export default TodoBody
