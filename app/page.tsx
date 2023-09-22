'use client';

import React, { useEffect } from 'react';
import { Button, Divider, notification } from 'antd';
import Image from 'next/image';
import { GoogleOutlined } from '@ant-design/icons';
import { signIn, useSession } from 'next-auth/react';
import Todo from '@/components/todo/';
// import { checkStatus } from '@/lib/checkStatus';
// import { sleep } from '@/lib/utils';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';

const Home = () => {

  const { status } = useSession();
  // const router = useRouter();
  // const [api, contextHolder] = notification.useNotification();
  
  const isAuthorized = status === "authenticated" ? true : false;

  // const checkStatusRes = async (isRetry = false) => {
  //   console.log("inside");
  //   const res = await axios.post('/api/status');
  //   const { status } = res.data;
  //   console.log(status, isRetry)
  //   if(!isRetry && !status)
  //     api.info({
  //       message: "App Status",
  //       description: "Please Wait... Starting the App",
  //       placement: "bottomRight",
  //       duration: null
  //     })    

  //   if(!status){
  //     await sleep(1000);
  //     checkStatusRes(true);
  //     return;
  //   }

  //   if(status && isRetry)
  //     router.refresh();
  //     // location.reload();
  // }

  // useEffect(() => {
  //   checkStatusRes();
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  return (
    <div className="h-full">
      {/* {contextHolder} */}
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
