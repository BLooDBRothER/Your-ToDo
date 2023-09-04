import { FolderType, TodoContextType, useTodoContext } from '@/context/TodoContext';
import { ArrowRightOutlined, CloseOutlined, FolderFilled } from '@ant-design/icons'
import { Divider, Modal, Spin, Tree } from 'antd'
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

const MoveModal = ({ type = "Folder", source, isOpen, closeModal }: MoveModalPropsType) => {

    const { getOnlyFolder } = useTodoContext() as TodoContextType

    const [treeData, setTreeData] = useState<DataNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [destination, setDestination] = useState('');

    const destinationKey = useRef('');

    const onLoadData = async ({ key, children }: any) => {
        if (children)
            return true
        const id = key.split(':')[0]
        const folderData = await getOnlyFolder(id);
        setTreeData(prev => {
            return updateTreeData(prev, key, folderData, source.id)
        })
    }

    const onSelect = (selectedKeys: React.Key[], e:any) => {
        const keyData = selectedKeys[0].toString().split(':');
        destinationKey.current = keyData[0];
        console.log(destinationKey.current)
        setDestination(keyData[1]);
    }

    const getHomeFolder = async () => {
        const folderData = await getOnlyFolder(null);
        setLoading(false);
        setTreeData(formatFolderToTreeData(folderData, source.id));
    }

    useEffect(() => {
        getHomeFolder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Modal open={isOpen} title={
            <>
                <div className='flex items-center justify-start gap-2'>
                    <FolderFilled className='text-xl' />
                    <span>Move {type}</span>
                </div>
                <Divider className='!my-4' />
            </>
        }
            onCancel={closeModal}
        >
            <div className='mb-2 flex items-center justify-start gap-2'>
                <div className='bg-primary rounded-md w-fit px-2 py-1'>
                    <FolderFilled className='mr-1' />
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
                    <Tree.DirectoryTree loadData={onLoadData} treeData={treeData} showIcon={false} onSelect={onSelect} />
                </div>
            </Spin>
        </Modal>
    )
}

export default MoveModal
