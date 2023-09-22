import { dropdownMenuItem } from '@/lib/contextMenuItem'
import { ClockCircleFilled, DeleteOutlined, MoreOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { App, Card, Divider, Dropdown } from 'antd'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { TodoModalOpenType } from '.'
import { TodoContextType, TodoType, useTodoContext } from '@/context/TodoContext'
import { OpenMoveModalType } from './TodoBody'
import moment from 'moment'
import { UserContextType, useUserContext } from '@/context/UserContext'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type TodoFilePropstype = {
    todo: TodoType
    openTodoModal: TodoModalOpenType
    openMoveModal: OpenMoveModalType

}

const TodoFile = ({ todo, openTodoModal, openMoveModal }: TodoFilePropstype) => {
    const { modal, message } = App.useApp();
    const router = useRouter();
    const pathName = usePathname()
    const searchParams = useSearchParams();

    const { deleteTodo } = useTodoContext() as TodoContextType;
    const { userData } = useUserContext() as UserContextType;
    

    const [isDropDownOpen, setDropDownOpen] = useState(false);

    const dropCntRef = useRef<HTMLDivElement>(null);

    const dueDateDiff = todo.duedate ? moment(todo.duedate).diff(moment(new Date()), 'days') : 10;
    const dueDate = userData.relativeTime ? moment(todo.duedate).endOf('day').fromNow() : moment(todo.duedate).format('ll')

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
        if(key === "rename")
            openTodo('', true);
        else if(key === "move")
            openMoveModal(todo.id, todo.title, "Todo")
        else if (key === "delete")
            showDeleteConfirm();
    }

    const openTodo = (_: any, renameTodo = false) => {
        setDropDownOpen(false); 
        const visibility = searchParams.get("visibility");
        router.push(`${pathName}?todo_id=${todo.id}${renameTodo ? `&rename_todo=true` : ''}${visibility ? `&visibility=${visibility}` : ''}`);
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
        onClick={openTodo}
        onContextMenu={triggerDropdown}
        hoverable
        className='w-full !bg-primary hover:!bg-primary/80 todo-card'
        >
            <div className='flex items-center justify-start gap-2 px-2 flex-1'>
                <h1 className='flex-1 text-lg'>{todo.title}</h1>
            </div>
            <Divider className='!my-2' />
            <div className='flex items-center justify-start gap-2 px-2'>
                <div className={`flex gap-2 items-center flex-1 ${dueDateDiff <= 3 ? '!text-red-500' : (dueDateDiff <=7 ? 'text-orange-300' : '')}`}>
                    <ClockCircleFilled />
                    <div>
                        {/* <div>{moment(todo.duedate).format('ll')}  {moment(todo.duedate).diff(moment(new Date()), 'days')}</div> */}
                        <div>{todo.duedate ? dueDate : "No Due"}</div>
                    </div>
                </div>
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
