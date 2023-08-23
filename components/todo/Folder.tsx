import { DeleteOutlined, EditOutlined, FolderOutlined, MoreOutlined } from '@ant-design/icons'
import { App, Dropdown } from 'antd'
import { MenuItemType } from 'antd/es/menu/hooks/useItems'
import React, { useEffect, useRef, useState } from 'react'
import { ModalOpenType } from '.'
import { useRouter } from 'next/navigation'

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
    const { modal } = App.useApp();
    const router = useRouter();

    const [isDropDownOpen, setDropDownOpen] = useState(false);

    const dropCntRef = useRef<HTMLDivElement>(null);

    const showDeleteConfirm = () => {
        console.log(modal)
        modal.confirm({
            title: 'Are you sure delete this Folder?',
            icon: <DeleteOutlined />,
            content: 'Some descriptions',
            okText: 'Delete',
            okType: 'danger',
            okButtonProps: {
                "type": "primary"
            },
            cancelText: 'No',
            onOk() {
                console.log('OK');
            },
            onCancel() {
                console.log('Cancel');
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
        key === "rename" ? openModal("rename", id) : showDeleteConfirm();
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
        <Dropdown menu={{ items: dropdownMenuItem, onClick: handleDropdownMenuClick }} open={isDropDownOpen} trigger={["contextMenu", "click"]}>
            <div className='bg-primary p-4 flex flex-col items-center gap-4 w-[150px] rounded-lg text-lg hover:bg-primary/80 sm:w-[250px] sm:flex-row' onClick={navigate} ref={dropCntRef} role='button' onContextMenu={triggerDropdown} title={name}>
                <FolderOutlined className='folder-ic' />
                <div className='sm:flex-1 flex items-center'>
                    <div className='flex-1 text-ellipsis overflow-hidden text-lg whitespace-nowrap'>{name}</div>
                    <div className='hover:bg-light/10 rounded-md z-10' onClick={(e) => { e.stopPropagation(); setDropDownOpen(prev => !prev) }} role='button'>
                        <MoreOutlined />
                    </div>
                </div>
            </div>
        </Dropdown>
    )
}

export default Folder
