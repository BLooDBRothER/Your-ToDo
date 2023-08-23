"use client";

import { useEffect } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import Todo from '@/components/todo/';



type FolderPropsType = {
  params: {id: string}
}

export default function Folder({ params }: FolderPropsType) {
  const { status } = useSession();
  const router = useRouter();

  console.log(params.id)
  
  const isAuthorized = status === "authenticated" ? true : false;

  useEffect(() => {
    if(isAuthorized) return;

    router.push("/")
  }, []);

  return (
    <div className="h-full">
      {
        isAuthorized && <Todo folderId={params.id} />
      }
    </div>
  )
}
