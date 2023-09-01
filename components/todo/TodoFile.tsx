import { dropdownMenuItem } from '@/lib/contextMenuItem'
import { DeleteOutlined, MoreOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { App, Card, Dropdown } from 'antd'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { TodoModalOpenType } from '.'
import { TodoContextType, TodoType, useTodoContext } from '@/context/TodoContext'
import { title } from 'process'

type TodoFilePropstype = {
    todo: TodoType
    openTodoModal: TodoModalOpenType
}

const TodoFile = ({ todo, openTodoModal }: TodoFilePropstype) => {
    const { modal, message } = App.useApp();

    const { deleteTodo } = useTodoContext() as TodoContextType;

    const [isDropDownOpen, setDropDownOpen] = useState(false);

    const dropCntRef = useRef<HTMLDivElement>(null);

    const showMessage = (isSuccess: boolean) => {
        isSuccess ? message.success(`Todo Deleted Successfully`) : message.error("Error - Please Try Again");
    }

    const showDeleteConfirm = () => {
        modal.confirm({
            title: <div>
                <div>Are you sure delete the Todo ?</div>
                <div className='bg-primary p-1 rounded-md w-fit flex items-center gap-2 m-4'><UnorderedListOutlined />{todo.title}</div>
            </div>,
            icon: <DeleteOutlined />,
            okText: 'Delete',
            okType: 'danger',
            okButtonProps: {
                "type": "primary"
            },
            cancelText: 'No',
            onOk: async () => {
                const res = await deleteTodo(todo.id);
                showMessage(res);
            },
        });
    };

    const triggerDropdown = (e: any) => {
        e.preventDefault();
        setDropDownOpen(true);
    }

    const closeDorpDown = (e: MouseEvent) => {
        if (e.target === dropCntRef.current || dropCntRef.current?.contains(e.target as Node)) return;

        setDropDownOpen(false);
    }

    const handleDropdownMenuClick = ({ key }: { key: string }) => {
        console.log(key)
        key === "rename" ? openTodoModal(todo, true, false, true) : showDeleteConfirm();
    }

    useEffect(() => {
        document.addEventListener("click", closeDorpDown);
        document.addEventListener("contextmenu", closeDorpDown);

        return () => {
            document.removeEventListener("click", closeDorpDown);
            document.removeEventListener("contextmenu", closeDorpDown);
        }
    }, []);

  return (
    <Dropdown menu={{ items: dropdownMenuItem, onClick: handleDropdownMenuClick }} open={isDropDownOpen} trigger={["contextMenu"]}>
        <Card
        cover={<Image width={200} height={0} src="/assets/todo.svg" className='!w-full h-auto select-none' alt='todo image' />}
        size='small'
        bodyStyle={{
            width: "100%"
        }}
        ref={dropCntRef}
        onClick={openTodoModal.bind(null, todo, true, false, false)}
        onContextMenu={triggerDropdown}
        hoverable
        className='w-full !bg-primary hover:!bg-primary/80'
        >
            <div className='flex items-center justify-start gap-2 p-2 flex-1'>
                <h1 className='flex-1 text-lg'>{todo.title}</h1>
                <div className='hover:bg-light/10 rounded-md w-[18px] h-[28px] flex items-center justify-center' 
                onClick={(e) => { 
                    e.stopPropagation(); 
                    const mouseEvent = new MouseEvent("contextmenu", {
                        bubbles: true,
                        cancelable: false,
                        view: window,
                        button: 2,
                        buttons: 0,
                        clientX: e.currentTarget.getBoundingClientRect().x,
                        clientY: e.currentTarget.getBoundingClientRect().y +28
                    });
                    e.currentTarget.dispatchEvent(mouseEvent);
                }} role='button'>
                    <MoreOutlined className='file-todo-more-ic' />
                </div>
            </div>
        </Card>
    </Dropdown>
  )
}

export default TodoFile
