
import { Avatar, Button, Dropdown, MenuProps, Popover, Skeleton } from 'antd';
import { signOut, useSession } from 'next-auth/react';
import React from 'react'

const UserDdropdown = () => {
    
    const { data: session, status } = useSession();
    
    const isLoading = status === "loading" ? true : false
    const isLoggedIn = status === "authenticated" ? true : false;
    
    const userDropDownItems = (
        <div className='flex flex-col items-center justify-start gap-2'>
            <div>
                <p className='text-light'>{session?.user?.email}</p>
                <p className='text-xs text-light/50'>{session?.user?.name}</p>
            </div>
            <Button type="primary" className='w-full' onClick={() => {signOut()}}>Signout</Button>
        </div>
    )

  return (
    <div className='user-dropdown-cnt'>
        <Skeleton loading={isLoading} active avatar={{size: "default"}} title={false} paragraph={false}>
            {
                isLoggedIn &&
                <Popover className='user-dropdown' content={userDropDownItems}>
                    <div className='cursor-pointer'>
                        <Avatar size="default" src={session?.user?.image} className='!mr-[8px]' />
                    </div>
                </Popover>
            }
        </Skeleton>
    </div>
  )
}

export default UserDdropdown;
