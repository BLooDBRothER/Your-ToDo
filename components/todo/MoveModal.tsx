import { useTodoContext } from '@/context/TodoContext';
import { FolderType, TodoContextType } from '@/lib/types';
import { ArrowRightOutlined, CloseOutlined, FolderFilled, HomeFilled, UnorderedListOutlined } from '@ant-design/icons'
import { App, Divider, Modal, Spin, Tree } from 'antd'
import { DataNode } from 'antd/es/tree'
import React, { useEffect, useRef, useState } from 'react';

type MoveModalPropsType = {
    type?: "Folder" | "Todo"
    source: {
        name: string,
        id: string
    },
    isOpen: boolean
    closeModal: () => void
}

const INIT_TREE_DATA: DataNode[] = [
    {
        title: <div className='flex items-center gap-2'>
                    <HomeFilled />
                    <span>Home</span>
                </div>,
        key: 'null' ,
        isLeaf: false,
    }
]

const formatFolderToTreeData = (folders: FolderType[], sourceKey: string): DataNode[] => {
    if(folders.length === 0){
        const array = new Uint32Array(1);
        return [{
                    title: <div className='flex items-center gap-2'>
                                <CloseOutlined />
                                <span>No Folder</span>
                            </div>,
                    key: self.crypto.getRandomValues(array)[0] ,
                    isLeaf: true,
                    selectable: false
                }]
    }
    return folders.map(folder => (
        {
            title:  <div className='flex items-center gap-2'>
                <FolderFilled />
                <span>{folder.name}</span>
            </div>,
            key: `${folder.id}:${folder.name}`,
            isLeaf: false,
            selectable: sourceKey === folder.id ? false : true
        }
    ))
}

const updateTreeData = (list: DataNode[], key: React.Key, children: FolderType[], sourceKey: string): DataNode[] => {
    return list.map(node => {
        return {
            ...node,
            children: node.key === key ? formatFolderToTreeData(children, sourceKey) : (node.children && updateTreeData(node.children, key, children, sourceKey))
        }
    })
}

const MoveModal = ({ type, source, isOpen, closeModal }: MoveModalPropsType) => {
    const { message } = App.useApp();
    const { getOnlyFolder, moveData } = useTodoContext() as TodoContextType

    const [treeData, setTreeData] = useState<DataNode[]>(INIT_TREE_DATA);
    const [loading, setLoading] = useState(true);
    const [destination, setDestination] = useState('');

    const destinationKey = useRef<null | string>('');

    const showMessage = (isSuccess: boolean) => {
        isSuccess ? message.success(`Moved Successfully`) : message.error("Error - Please Try Again")
    }

    const move = async () => {
        const res = await moveData(source.id, destinationKey.current, type === "Folder" ? true : false);
        showMessage(res);
        closeModal();
    }

    const onLoadData = async ({ key, children }: any) => {
        if (children || key === "null")
            return true
        const id = key.split(':')[0]
        const folderData = await getOnlyFolder(id);
        setTreeData(prev => {
            return updateTreeData(prev, key, folderData, source.id)
        })
    }

    const onSelect = (selectedKeys: React.Key[]) => {

        const keyData = selectedKeys[0] === "null" ? [null, 'home'] : selectedKeys[0].toString().split(':');
        destinationKey.current = keyData[0];
        setDestination(keyData[1] as string);
    }

    const getHomeFolder = async () => {
        const folderData = await getOnlyFolder(null);
        setLoading(false);
        setTreeData(prev => {
            return updateTreeData(prev, 'null', folderData, source.id)
        })
    }

    useEffect(() => {
        getHomeFolder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Modal open={isOpen} title={
            <>
                <div className='flex items-center justify-start gap-2'>
                    {
                        type === "Folder" ?
                        <FolderFilled className='text-xl' /> :
                        <UnorderedListOutlined className='text-xl' />
                    }
                    <span>Move {type}</span>
                </div>
                <Divider className='!my-4' />
            </>
        }
            okText="Move"
            onOk={move}
            onCancel={closeModal}
        >
            <div className='mb-2 flex items-center justify-start gap-2'>
                <div className='bg-primary rounded-md w-fit px-2 py-1'>
                    {
                        type === "Folder" ?
                        <FolderFilled className='mr-1' /> :
                        <UnorderedListOutlined className='mr-1' />
                    }
                    <span>{source.name}</span>
                </div>
                <ArrowRightOutlined />
                <div className='bg-primary rounded-md w-fit px-2 py-1'>
                    <FolderFilled className='mr-1' />
                    <span>{destination}</span>
                </div>
            </div>
            <Spin spinning={loading} tip="Fetching Folder">
                <div className='text-xl p-2 bg-primary rounded-md min-h-[50px]'>
                    <Tree.DirectoryTree loadData={onLoadData} treeData={treeData} showIcon={false} onSelect={onSelect} defaultExpandedKeys={["null"]} />
                </div>
            </Spin>
        </Modal>
    )
}

export default MoveModal
