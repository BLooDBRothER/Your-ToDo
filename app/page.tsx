'use client';

import React, { useEffect, useState } from 'react';
import { Button, Divider, Spin } from 'antd';
import Image from 'next/image';
import { GoogleOutlined } from '@ant-design/icons';
import { signIn, useSession } from 'next-auth/react';
import Todo from '@/components/todo/';
import axios from 'axios';

const Home = () => {

  const { status } = useSession();

  const [isDBStarting, setDBStarting] = useState(false);
  
  const isAuthorized = status === "authenticated" ? true : false;

  const hold = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const checkStatusRes = async (isRetry = false) => {

    isRetry && setDBStarting(true);


    const res = await axios.post('/api/status');
    const { status } = res.data;

    if(!status){
      await hold(1000);
      checkStatusRes(true);
    }
    else if(status){
      setDBStarting(false);
    }

  }

  useEffect(() => {
    checkStatusRes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="h-full">
      {
        isDBStarting &&
        <div className='h-full flex flex-col items-center justify-center gap-2'>
          <Spin spinning size='large' />
          <div className=' bg-primary p-2 rounded-md text-lg flex flex-col items-center justify-center gap-1'>
            <div>Your-Todo is Waking Up!!!</div>
            <div>DB is Starting... Please Wait</div>
          </div>
        </div>
      }
      {
        !isDBStarting &&
        <>
          {
            isAuthorized ?
            <Todo folderId={null} />:
            <div className='flex items-center justify-center h-[calc(100vh-100px)]'>
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
        </>
      }
    </div>
  )
};

export default Home;
