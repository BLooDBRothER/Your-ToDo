import { DeleteOutlined, EditOutlined, FolderOutlined, MoreOutlined } from '@ant-design/icons'
import { App, Dropdown, Tooltip } from 'antd'
import { MenuItemType } from 'antd/es/menu/hooks/useItems'
import React, { useEffect, useRef, useState } from 'react'
import { ModalOpenType } from '.'
import { useRouter } from 'next/navigation'
import { TodoContextType, useTodoContext } from '@/context/TodoContext'

type FolderPropType = {
    id: string
    name: string
    openModal: ModalOpenType
}

const dropdownMenuItem: MenuItemType[] = [
    {
        key: "rename",
        label: "Rename",
        icon: <EditOutlined />
    },
    {
        key: "delete",
        label: "Delete",
        danger: true,
        icon: <DeleteOutlined />
    }
]


const Folder = ({ id, name, openModal }: FolderPropType) => {
    const { modal, message } = App.useApp();
    const router = useRouter();

    const { deleteFolder } = useTodoContext() as TodoContextType

    const [isDropDownOpen, setDropDownOpen] = useState(false);

    const dropCntRef = useRef<HTMLDivElement>(null);

    const showMessage = (isSuccess: boolean) => {
        isSuccess ? message.success(`Folder Deleted Successfully`) : message.error("Error - Please Try Again");
    }

    const showDeleteConfirm = () => {
        modal.confirm({
            title: <div>
                <div>Are you sure delete the Folder ?</div>
                <div className='bg-primary p-1 rounded-md w-fit flex items-center gap-2 m-4'><FolderOutlined />{name}</div>
            </div>,
            icon: <DeleteOutlined />,
            okText: 'Delete',
            okType: 'danger',
            okButtonProps: {
                "type": "primary"
            },
            cancelText: 'No',
            onOk: async () => {
                const res = await deleteFolder(id);
                showMessage(res);
            },
        });
    };

    const navigate = () => {
        router.push(`/folder/${id}`)
    }

    const triggerDropdown = (e: any) => {
        e.preventDefault();
        console.log('hi');
        setDropDownOpen(true);
    }

    const closeDorpDown = (e: MouseEvent) => {
        if (e.target === dropCntRef.current || dropCntRef.current?.contains(e.target as Node)) return;

        setDropDownOpen(false);
    }

    const handleDropdownMenuClick = ({ key }: { key: string }) => {
        key === "rename" ? openModal("rename", id, name) : showDeleteConfirm();
    }

    useEffect(() => {
        document.addEventListener("click", closeDorpDown);
        document.addEventListener("contextmenu", closeDorpDown);

        return () => {
            document.removeEventListener("click", closeDorpDown);
            document.removeEventListener("contextmenu", closeDorpDown);
        }
    }, [])

    return (
        <Dropdown menu={{ items: dropdownMenuItem, onClick: handleDropdownMenuClick }} open={isDropDownOpen} trigger={["click"]}>
            <div className='bg-primary p-4 flex flex-col items-center gap-4 w-[150px] rounded-lg text-lg hover:bg-primary/80 sm:w-[250px] sm:flex-row' onClick={navigate} ref={dropCntRef} role='button' onContextMenu={triggerDropdown}>
                <FolderOutlined className='folder-ic' />
                <div className='sm:flex-1 flex items-center'>
                    <Tooltip title={name} placement='bottom' mouseEnterDelay={0.5}>
                        <div className='flex-1 text-ellipsis overflow-hidden text-lg whitespace-nowrap'>{name}</div>
                    </Tooltip>
                    <div className='hover:bg-light/10 rounded-md z-10' onClick={(e) => { e.stopPropagation(); setDropDownOpen(prev => !prev) }} role='button'>
                        <MoreOutlined />
                    </div>
                </div>
            </div>
        </Dropdown>
    )
}

export default Folder
