import { BorderOutlined, CheckOutlined, CheckSquareOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Divider, Input, InputRef, Modal, Segmented, Skeleton, Space, Spin } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { TodoModalType } from '.'
import { TodoContextType, TodoType, useTodoContext } from '@/context/TodoContext'
import NoData from '../NoData'
import TodoLoading from './TodoLoading'

type TodoModalPropsType = TodoModalType & {
  isRename: boolean
  closeModal: (type: "folder" | "todo") => void
}

type TodoItemTypeProps = {
  id: string
  value: string
  isChecked: boolean
  updateTodo: (todoContentId: string, field: "isCompleted" | "value", value: string | boolean) => void
  deleteTodo: (todoContentId: string) => void
}

const TodoItem = ({ id, value, isChecked, updateTodo, deleteTodo }: TodoItemTypeProps) => {
  const [isEdit, setEdit] = useState(false);
  const [isCompleted, setIsCompleted] = useState(isChecked);
  const [inpValue, setInpValue] = useState(value);
  const [isDeleted, setDeleted] = useState(false);

  const updateTodoValue = async () => {
    if(!inpValue) return; 
    value !== inpValue && updateTodo(id, "value", inpValue);
    setEdit(false);
  }

  const updateCompleteStatus = () => {
    updateTodo(id, "isCompleted", !isCompleted)
    setIsCompleted(prev => !prev);
  }

  if(isDeleted)
    return (<></>)

  return (
    <div className={`bg-primary p-4 my-2 rounded-lg text-xl flex items-center justify-start hover:bg-primary/80 cursor-pointer border ${isCompleted ? 'border-accent/60' : 'border-transparent'}`} onClick={updateCompleteStatus}>
      {
        !isEdit ?
          <div className='flex-1'>
            {isCompleted ? <CheckSquareOutlined /> : <BorderOutlined />}
            <span className={`ml-2 ${isCompleted ? 'text-white/50' : 'text-white'}`}>{inpValue}</span>
          </div> :
          <Input value={inpValue} onChange={(e) => setInpValue(e.target.value)} onClick={(e) => {e.stopPropagation();}} onPressEnter={updateTodoValue} />
      }
      <div className='flex items-center justify-start gap-2 ml-2'>
        {
          isEdit ?
            <Button icon={<CheckOutlined />} onClick={(e) => { e.stopPropagation(); updateTodoValue() }} /> :
            <Button icon={<EditOutlined />} onClick={(e) => { e.stopPropagation(); setEdit(true) }} />
        }
        <Button type='primary' danger icon={<DeleteOutlined />} onClick={(e) => { 
          e.stopPropagation();
          deleteTodo(id);
          setDeleted(true)
         }} />
      </div>
    </div>
  )
}

const FILTER_OPTIONS = ["All", "Finished", "Pending"]

const TodoModal = ({ todoItem, isOpen, isRename, closeModal  }: TodoModalPropsType) => {

  const { data, isLoading, getTodoData, addTodo, updateTodoHeader, updateTodoContent, deleteTodoContent } = useTodoContext() as TodoContextType

  const todo: TodoType = data.todo.find(each => each.id === todoItem.id) || todoItem; 

  
  const [todoTitle, setTitle] = useState(todo.title);
  const [todoValue, setTodoValue] = useState('');
  const [isEdit, setEdit] = useState(isRename);
  const [filter, setFilter] = useState("All");
  
  const todoContent = (filter === "All" ? todo.todoContent : (filter === "Finished" ? todo.todoContent?.filter(todo => todo.isCompleted) : todo.todoContent?.filter(todo => !todo.isCompleted))) || [];
  
  const inputRef = useRef<InputRef>(null);
  const todoCntRef = useRef<HTMLDivElement | null>(null);
  const isScrollRef = useRef(false);

  const checkLoading = () => {
    return (isLoading.todoCreating || isLoading.todo || isLoading.todoTitle || isLoading.todoContent)
  }

  const updateTitle = async () => {
    if(!todo.id || !todoTitle || checkLoading()) return;

    (todoTitle !== todo.title) && await updateTodoHeader(todo.id, todoTitle);

    setEdit(false)
  }

  const addNewTodo = async () => {
    if(!todo.id || !todoValue || checkLoading()) return;
    
    await addTodo(todo.id, todoValue);
    
    isScrollRef.current = true;
    setTodoValue('');
  }

  const updateTodoData = async (todoContentId: string, field: "isCompleted" | "value", value: string | boolean) => {
    if(!todo.id || checkLoading()) return;

    await updateTodoContent(todo.id, todoContentId, field, value);
  }

  const deleteTodo = async (todoContentId: string) => {
    if(!todo.id || checkLoading()) return;

    await deleteTodoContent(todo.id, todoContentId);
  }

  console.log(todo)

  // useEffect(() => {
  //   todo.id && setTodo(data.todo.find(each => each.id === todo.id) as TodoType)
  // }, [data.todo, todo.id])

  useEffect(() => {
    if (!isEdit) return
    inputRef.current?.focus({
      cursor: "end"
    })
  }, [isEdit])

  useEffect(() => {
    isScrollRef.current && todoCntRef.current?.scrollTo({
      top: todoCntRef.current.scrollHeight,
      behavior: "smooth"
    })
    isScrollRef.current = false;
  }, [todoContent.length])

  useEffect(() => {
    todo.id && getTodoData(todo.id);
    todoCntRef.current = document.querySelector(".ant-modal-body");
    console.log(todoCntRef.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Modal open={isOpen} bodyStyle={{ overflowY: "auto" }} className='!h-[65vh] !w-[70vw]'  title={
      <div className='relative'>
        <Spin spinning={isLoading.todoContent} className='!absolute bottom-[.5rem] right-[0rem]' />
        <div className='text-xl  relative'>
          <div className='w-[200px] sm:w-[400px] flex items-center justify-start gap-4'>
            {
              isEdit ?
                <>
                  <Input ref={inputRef} placeholder='TODO Title' value={todoTitle} onPressEnter={updateTitle} onChange={(e) => { setTitle(e.target.value) }} /> 
                  <Button icon={<CheckOutlined />} loading={isLoading.todoTitle} onClick={updateTitle} />
                </>:
                <>
                  <h1>{todoTitle}</h1>
                  <Button icon={<EditOutlined />} onClick={() => { setEdit(true) }} />
                </>
            }
          </div>
        </div>
        <div className=' rounded-lg flex items-center justify-center'>
          <Space.Compact style={{ width: '70%' }} className=' bg-primary p-4 rounded-lg'>
            <Input placeholder='Enter Your TODO' value={todoValue} onPressEnter={addNewTodo} onChange={(e) => {setTodoValue(e.target.value)}} />
            <Button type="primary" icon={<PlusOutlined />} onClick={addNewTodo} >Add</Button>
          </Space.Compact>
        </div>
        <Divider className='!my-2' />
        <Segmented options={FILTER_OPTIONS} className='!bg-primary' value={filter} onChange={(filterValue) => { setFilter(filterValue as string)}} />
      </div>
    }
      footer={false}
      onCancel={closeModal.bind(null, "todo")}
    >
      <Spin spinning={isLoading.todoCreating} tip="Creating Todo">
        <div className='bg-secondary h-[65vh] p-4 rounded-lg'>
          {isLoading.todo && <TodoLoading type='todoContent' />}
          {
            !isLoading.todoCreating && !isLoading.todo && todoContent.length === 0 && <NoData description='No Todo Added' />
          }
          {
            todoContent.map(todo => (
              <TodoItem key={todo.id} id={todo.id} value={todo.value} isChecked={todo.isCompleted} updateTodo={updateTodoData} deleteTodo={deleteTodo} />
            ))
          }
        </div>
      </Spin>
    </Modal>
  )
}

export default TodoModal
