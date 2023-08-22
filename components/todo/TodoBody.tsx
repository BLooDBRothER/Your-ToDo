import { FolderFilled, HomeOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { Breadcrumb, Divider } from 'antd'
import React from 'react'
import Folder from './Folder'
import { ModalOpenType } from '.'

type TodoBodyPropsType = {
    openModal: ModalOpenType
}

const TodoBody = ({ openModal }: TodoBodyPropsType) => {

    const breadcrumbItem = [
        {
          title: <div className='flex items-center gap-1'>
                    <HomeOutlined />
                    <span>Home</span>
                 </div>,
          href: "/"
        },
      ]

    return (
        <div>
            <div className='text-light mx-2 my-4'>
                <Breadcrumb separator=">" items={breadcrumbItem}  />
            </div>

            <div className='my-4 mx-2 text-2xl flex items-center justify-start gap-4'>
                <FolderFilled className='text-light/50' />
                <h1>Folders</h1>
            </div>

            <div className='p-2 flex items-center justify-evenly sm:justify-start gap-4 flex-wrap'>
                <Folder id="test" name='Folder 1' openModal={openModal} />
                <Folder id="test" name='Folder 2' openModal={openModal} />
                <Folder id="test" name='Folder 3' openModal={openModal} />
                <Folder id="test" name='Folder 4' openModal={openModal} />
                <Folder id="test" name='Folder 5' openModal={openModal} />
                <Folder id="test" name='Folder 6' openModal={openModal} />
                <Folder id="test" name='Folder 7' openModal={openModal} />
            </div>

            <Divider />

            <div className='my-4 mx-2 text-2xl flex items-center justify-start gap-4'>
                <UnorderedListOutlined className='text-light/50' />
                <h1>Todo</h1>
            </div>
        </div>
    )
}

export default TodoBody
