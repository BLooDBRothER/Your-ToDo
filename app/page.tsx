'use client';

import React from 'react';
import { Button, Divider } from 'antd';
import Image from 'next/image';
import { GoogleOutlined } from '@ant-design/icons';
import { signIn, useSession } from 'next-auth/react';
import Todo from '@/components/todo/';

const Home = () => {

  const { status } = useSession();
  
  const isAuthorized = status === "authenticated" ? true : false;

  return (
    <div className="h-full">
      {
        isAuthorized ?
        <Todo folderId={null} />:
        <div className='flex items-center justify-center h-full'>
          <div className='flex flex-col items-center justify-center w-9/12 md:w-[400px] mx-auto bg-primary p-4 gap-4 h-[400px] rounded-md border border-light'>
            <div className='flex-1 flex items-center justify-center'>
              <Image
                src="/logo/logo-no-background-no-badge-white.svg"
                width={250}
                height={200}
                alt='logo'
              />
            </div>
            <Divider className=" text-light">Login to View Your ToDo</Divider>
            <div className='mb-4'>
              <Button type='primary' icon={<GoogleOutlined />} onClick={() => { signIn("google") }} >SignIn With Google</Button>
            </div>
          </div>
        </div>
      }
    </div>
  )
};

export default Home;
