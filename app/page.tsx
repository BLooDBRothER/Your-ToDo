'use client';

import React, { useEffect } from 'react';
import { Button, Divider } from 'antd';
import Image from 'next/image';
import { GoogleOutlined } from '@ant-design/icons';

const Home = () => {
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/test")
      const data= await res.json();
      console.log(data)
    }
    fetchData()
  }, [])
  
  return (
  <div className="h-full">
    <div className='flex items-center justify-center h-full'>
      <div className='flex flex-col items-center justify-center w-3/12 mx-auto bg-primary p-4 gap-4 h-[400px] rounded-md border border-light'>
        <div className='flex-1 flex items-center justify-center'>
          <Image
            src="/logo/logo-no-background-no-badge-white.svg"
            width={250}
            height={200}
            alt='logo'
          />
        </div>
        <Divider className=" text-light">Please Login to Add/View Your ToDo</Divider>
        <div>
          <Button type='primary' icon={<GoogleOutlined />}>SignIn With Google</Button>
        </div>
      </div>
    </div>
  </div>
  )
};

export default Home;
