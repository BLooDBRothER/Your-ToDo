import { BorderOutlined, CheckOutlined, CheckSquareOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Divider, Input, Modal, Skeleton, Space } from 'antd'
import React, { useState } from 'react'

type TodoItemTypeProps = {
  value: string
  isChecked: boolean
}

const TodoItem = ({ value, isChecked }: TodoItemTypeProps) => {
  const [isEdit, setEdit] = useState(false);
  return (
    <div className='bg-primary p-4 my-2 rounded-lg text-xl flex items-center justify-start hover:bg-primary/80 cursor-pointer'>

      {
        !isEdit ?
          <div className='flex-1'>
            {isChecked ? <CheckSquareOutlined /> : <BorderOutlined />}
            <span className={`ml-2 ${isChecked ? 'text-white/50' : 'text-white'}`}>{value}</span>
          </div> :
          <Input value={value} />
      }
      <div className='flex items-center justify-start gap-2 ml-2'>
        {
          isEdit ?
            <Button icon={<CheckOutlined />} onClick={() => { setEdit(false) }} /> :
            <Button icon={<EditOutlined />} onClick={() => { setEdit(true) }} />
        }
        <Button type='primary' danger icon={<DeleteOutlined />} onClick={() => { }} />
      </div>
    </div>
  )
}

const TodoSkeletonLoading = () => (
  <div className='bg-primary p-4 my-2 rounded-lg text-xl flex items-center justify-start'>
    <Skeleton paragraph={false} active />
    <div className='flex items-center justify-start ml-4'>
      <Skeleton paragraph={false} title={false} avatar={{ shape: "square", size: "small" }} active />
      <Skeleton paragraph={false} title={false} avatar={{ shape: "square", size: "small" }} active />
    </div>
  </div>
)

const TodoModal = () => {

  const [title, setTitle] = useState('');
  const [isEdit, setEdit] = useState(false);

  return (
    <Modal open closeIcon={false} bodyStyle={{ overflowY: "auto" }} className='!h-[65vh] !w-[70vw]' title={
      <>
        <div className='text-xl mb-4'>
          <div className='w-[200px] sm:w-[400px] flex items-center justify-start gap-4'>
            {
              isEdit ?
                <>
                  <Input placeholder='TODO Title' value={title} onChange={(e) => { setTitle(e.target.value) }} /> 
                  <Button icon={<CheckOutlined />} onClick={() => { setEdit(false) }} />
                </>:
                <>
                  <h1>Todo Title</h1>
                  <Button icon={<EditOutlined />} onClick={() => { setEdit(true) }} />
                </>
            }
          </div>
        </div>
        <div className=' p-2 bg-primary rounded-lg flex items-center justify-center'>
          <Space.Compact style={{ width: '70%' }}>
            <Input placeholder='Enter Your TODO' />
            <Button type="primary" icon={<PlusOutlined />}>Add</Button>
          </Space.Compact>
        </div>
        <Divider />
      </>
    }
      okText="Save"
    >
      <div className='bg-secondary h-[65vh] p-4 rounded-lg'>
        <TodoSkeletonLoading />
        <TodoItem value='todo 1' isChecked />
        <TodoItem value='todo 2' isChecked={false} />
      </div>
    </Modal>
  )
}

export default TodoModal
