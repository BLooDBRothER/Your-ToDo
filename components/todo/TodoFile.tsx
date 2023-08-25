import { MoreOutlined } from '@ant-design/icons'
import { Card } from 'antd'
import Image from 'next/image'
import React from 'react'

const TodoFile = () => {
  return (
    <Card
      cover={<Image width={200} height={0} src="/assets/todo.svg" className='!w-full h-auto' alt='todo image' />}
      size='small'
      bodyStyle={{
        width: "100%"
      }}
      hoverable
      className='w-full !bg-primary'
    >
        <div className='flex items-center justify-start gap-2 p-2 flex-1'>
            <h1 className='flex-1 text-lg'>Todo Title</h1>
            <div className='hover:bg-light/10 rounded-md' role='button'>
                <MoreOutlined className='file-todo-more-ic' />
            </div>
        </div>
    </Card>
  )
}

export default TodoFile
