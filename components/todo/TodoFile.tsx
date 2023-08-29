import { dropdownMenuItem } from '@/lib/contextMenuItem'
import { MoreOutlined } from '@ant-design/icons'
import { Card, Dropdown } from 'antd'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

const TodoFile = () => {

    const [isDropDownOpen, setDropDownOpen] = useState(false);

    const dropCntRef = useRef<HTMLDivElement>(null);

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
        // key === "rename" ? openModal("rename", id, name) : showDeleteConfirm();
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
        <Card
        cover={<Image width={200} height={0} src="/assets/todo.svg" className='!w-full h-auto' alt='todo image' />}
        size='small'
        bodyStyle={{
            width: "100%"
        }}
        ref={dropCntRef}
        onContextMenu={triggerDropdown}
        hoverable
        className='w-full !bg-primary'
        >
            <div className='flex items-center justify-start gap-2 p-2 flex-1'>
                <h1 className='flex-1 text-lg'>Todo Title</h1>
                <div className='hover:bg-light/10 rounded-md w-[18px] h-[28px] flex items-center justify-center' onClick={(e) => { e.stopPropagation(); setDropDownOpen(prev => !prev) }} role='button'>
                    <MoreOutlined className='file-todo-more-ic' />
                </div>
            </div>
        </Card>
    </Dropdown>
  )
}

export default TodoFile
