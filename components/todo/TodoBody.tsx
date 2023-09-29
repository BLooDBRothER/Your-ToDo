import { FolderFilled, HomeOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { Breadcrumb, Divider } from 'antd'
import React, { useEffect, useState } from 'react'
import Folder from './Folder'
import { useTodoContext } from '@/context/TodoContext'
import TodoLoading from './TodoLoading'
import NoData from '../NoData'
import Link from 'next/link'
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb'
import TodoFile from './TodoFile'
import MoveModal from './MoveModal'
import { useSearchParams } from 'next/navigation'
import { ModalOpenType, OpenMoveModalType, TodoContextType, TodoDataType, TodoModalOpenType } from '@/lib/types'


type TodoBodyPropsType = {
    folderId: string | null
    openModal: ModalOpenType
    openTodoModal: TodoModalOpenType
}

const TodoBody = ({ folderId, openModal, openTodoModal }: TodoBodyPropsType) => {
    const { data, isLoading, parentFolders, getFolderData } = useTodoContext() as TodoContextType;

    const searchParams = useSearchParams();

    const visibility = searchParams.get("visibility") ?? "All"
    const searchQuery = searchParams.get("search")
    const filteredDate: TodoDataType = searchQuery ? {folders: data.folders.filter(folder => (new RegExp(searchQuery, 'gi').test(folder.name))), todo: data.todo.filter(todo => (new RegExp(searchQuery, 'gi').test(todo.title)))} : data;

    const [moveModalData, setMoveModalData] = useState({
        source: {
            id: '',
            name: ''
        },
        isOpen: false,
        type: ''
    })
    const [breadcrumbItem, setBreadcrumbItem] = useState<BreadcrumbItemType[]>([
        {
          title: <Link href="/" className='!flex items-center gap-1'>
                    <HomeOutlined />
                    <span>Home</span>
                 </Link>
        },
    ])

    const closeMoveModal = () => {
        setMoveModalData(prev => ({...prev, isOpen: false}));
    }

    const openMoveModal: OpenMoveModalType = (id, name, type) => {
        console.log(type)
        setMoveModalData({
            source: {
                id,
                name
            },
            isOpen: true,
            type
        })
    }

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
                <Breadcrumb separator=">" items={breadcrumbItem} />
            </div>

            {
                (visibility === "All" || visibility === "Folder") &&
                <>    
                    <div className='my-4 mx-2 text-lg flex items-center justify-start gap-4'>
                        <FolderFilled className='text-light/50' />
                        <h1>Folders</h1>
                    </div>

                    <div className='p-2 folder-todo-cnt sm:flex sm:items-center sm:justify-start gap-4 flex-wrap'>
                        {isLoading.folder ? 
                            <TodoLoading type='folder' />:
                            <>
                                {filteredDate.folders.map(folder => (
                                    <Folder key={folder.id} id={folder.id} name={folder.name} openModal={openModal} openMoveModal={openMoveModal} />
                                ))}
                            </>
                        }
                        {filteredDate.folders.length === 0 && !isLoading.folder && <NoData description='No Folders' />}
                    </div>
                </>
            }

            {visibility === "All" && <Divider />}

            {
                (visibility === "All" || visibility === "Todo") &&
                <>    
                    <div className='my-4 mx-2 text-lg flex items-center justify-start gap-4'>
                        <UnorderedListOutlined className='text-light/50' />
                        <h1>Todo</h1>
                    </div>

                    {/* <div className='p-2 flex items-stretch justify-evenly sm:justify-start gap-4 flex-wrap'> */}
                    <div>
                        <div className='p-2 folder-todo-cnt'>
                            {isLoading.folder ?
                                <TodoLoading type='todo' /> :
                                <>
                                    {filteredDate.todo.map(todo => (
                                        <TodoFile key={todo.id} todo={todo} openTodoModal={openTodoModal} openMoveModal={openMoveModal} />
                                    ))}
                                </>
                            }
                        </div>
                        
                        {filteredDate.todo.length === 0 && !isLoading.folder && <NoData description='No Todo' />}
                    </div>
                </>

            }

            {moveModalData.isOpen && <MoveModal type={moveModalData.type as "Folder" | "Todo"} source={moveModalData.source} isOpen={moveModalData.isOpen} closeModal={closeMoveModal} />}
        </div>
    )
}

export default TodoBody
