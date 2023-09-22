import { BorderOutlined, CheckOutlined, CheckSquareOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, DatePicker, DatePickerProps, Divider, Input, InputRef, Modal, Segmented, Space, Spin } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { TodoModalType } from '.'
import { TodoContextType, TodoType, useTodoContext } from '@/context/TodoContext'
import NoData from '../NoData'
import TodoLoading from './TodoLoading'
import dayjs from 'dayjs'

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

  const inputRef = useRef<InputRef>(null);

  const updateTodoValue = async () => {
    if(!inpValue) return; 
    value !== inpValue && updateTodo(id, "value", inpValue);
    setEdit(false);
  }

  const updateCompleteStatus = () => {
    updateTodo(id, "isCompleted", !isCompleted)
    setIsCompleted(prev => !prev);
  }

  useEffect(() => {
    if (!isEdit) return
    inputRef.current?.focus({
      cursor: "end"
    })
  }, [isEdit])

  if(isDeleted)
    return (<></>)

  return (
    <div className={`bg-primary py-2 px-4 my-2 rounded-lg text-lg flex items-center justify-start hover:bg-primary/80 cursor-pointer border ${isCompleted ? 'border-accent/60' : 'border-transparent'}`} onClick={updateCompleteStatus}>
      {
        !isEdit ?
          <div className='flex-1'>
            {isCompleted ? <CheckSquareOutlined /> : <BorderOutlined />}
            <span className={`ml-2 ${isCompleted ? 'text-white/50' : 'text-white'}`}>{inpValue}</span>
          </div> :
          <Input ref={inputRef} value={inpValue} onChange={(e) => setInpValue(e.target.value)} onClick={(e) => {e.stopPropagation();}} onPressEnter={updateTodoValue} />
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

const TodoModal = ({ todoId, isOpen, isRename, closeModal  }: TodoModalPropsType) => {

  const { data, isLoading, getTodoData, addTodo, updateTodo, updateTodoContent, deleteTodoContent } = useTodoContext() as TodoContextType

  const todo = data.todo.find(each => each.id === todoId) as TodoType;
  
  const [todoTitle, setTitle] = useState(todo.title);
  const [todoValue, setTodoValue] = useState('');
  const [isEdit, setEdit] = useState(isRename);
  const [filter, setFilter] = useState("All");
  
  const todoContent = (filter === "All" ? todo.todoContent : (filter === "Finished" ? todo.todoContent?.filter(todo => todo.isCompleted) : todo.todoContent?.filter(todo => !todo.isCompleted))) || [];
  
  const inputRef = useRef<InputRef>(null);
  const todoCntRef = useRef<HTMLDivElement | null>(null);
  const isScrollRef = useRef(false);

  console.log(isLoading.todoContent)

  const checkLoading = () => {
    return (isLoading.todoCreating || isLoading.todo || isLoading.todoTitle)
  }

  const updateTitle = async () => {
    if(!todo.id || !todoTitle || checkLoading()) return;

    (todoTitle !== todo.title) && await updateTodo(todo.id, "title", todoTitle);

    setEdit(false)
  }

  const addNewTodo = async () => {
    if(!todo.id || !todoValue || checkLoading()) return;
    
    setTodoValue('');
    isScrollRef.current = true;
    
    await addTodo(todo.id, todoValue);
    
  }

  const updateTodoData = async (todoContentId: string, field: "isCompleted" | "value", value: string | boolean) => {
    if(!todo.id || checkLoading()) return;

    await updateTodoContent(todo.id, todoContentId, field, value);
  }

  const deleteTodo = async (todoContentId: string) => {
    if(!todo.id || checkLoading()) return;

    await deleteTodoContent(todo.id, todoContentId);
  }

  const handleDateChange: DatePickerProps["onChange"] = async (date, dateString) => {
    const timeStamp = date ? new Date(dateString) : null;
    await updateTodo(todo.id, "dueDate", timeStamp);
  }

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
    <Modal open={isOpen} bodyStyle={{ overflowY: "auto" }} className='!w-[98vw] sm:!h-[65vh] sm:!w-[75vw] lg:!w-[70vw]'  title={
      <div className='relative'>
        {
          isLoading.todoContent.length > 0 &&
          <div className='!absolute top-[0rem] right-[1rem] text-xs'>
            <Spin spinning={true} size='small' />
            <span className='mx-2'>Syncing</span>
          </div>
        }
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
        <div className=' rounded-lg flex items-center justify-center mt-2'>
          <Space.Compact className='!w-full sm:!w-[75%] bg-primary p-4 rounded-lg'>
            <Input placeholder='Enter Your TODO' value={todoValue} onPressEnter={addNewTodo} onChange={(e) => {setTodoValue(e.target.value)}} />
            <Button type="primary" icon={<PlusOutlined />} onClick={addNewTodo} >Add</Button>
          </Space.Compact>
        </div>
        <Divider className='!my-2' />
        <div className='flex justify-between items-center'>
          <Segmented options={FILTER_OPTIONS} className='!bg-primary' value={filter} onChange={(filterValue) => { setFilter(filterValue as string)}} />
          <DatePicker placeholder='Due Date'  onChange={handleDateChange} {...(todo.duedate && {defaultValue: dayjs(todo.duedate)})} disabledDate={(current) => {
            return current.diff(new Date(), 'days') < 0
          }} />
        </div>
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
            !isLoading.todo && todoContent.map(todo => (
              <TodoItem key={todo.id} id={todo.id} value={todo.value} isChecked={todo.isCompleted} updateTodo={updateTodoData} deleteTodo={deleteTodo} />
            ))
          }
        </div>
      </Spin>
    </Modal>
  )
}

export default TodoModal
