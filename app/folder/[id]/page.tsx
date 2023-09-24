"use client";

import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import Todo from '@/components/todo/';
import axios from "axios";
import { Spin } from "antd";

type FolderPropsType = {
  params: {id: string}
}

export default function Folder({ params }: FolderPropsType) {
  const { status } = useSession();
  const router = useRouter();

  const [isDBStarting, setDBStarting] = useState(false);
  
  const isAuthorized = status === "authenticated" ? true : false;

  const hold = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const checkStatusRes = async (isRetry = false) => {

    isRetry && setDBStarting(true)

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
    isAuthorized && checkStatusRes();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if(isAuthorized) return;

    router.push("/")
  }, [isAuthorized, router]);

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
        isAuthorized && !isDBStarting && <Todo folderId={params.id} />
      }
    </div>
  )
}
