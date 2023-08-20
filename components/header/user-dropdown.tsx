
import { Avatar, Button, Dropdown, MenuProps, Skeleton } from 'antd';
import { signOut, useSession } from 'next-auth/react';
import React from 'react'


const UserDdropdown = () => {
    
    const { data: session, status } = useSession();
    
    const isLoading = status === "loading" ? true : false
    const isLoggedIn = status === "authenticated" ? true : false;
    
    const userDropDownItems: MenuProps["items"] = [
        {
            key: 'username',
            label: (
                <div className=' cursor-pointer'>
                    <p className='text-light'>{session?.user?.email}</p>
                    <p className='text-xs text-light/50'>{session?.user?.name}</p>
                </div>
            ),
            // selectable: false
        },
        {
            key: 'signout',
            label: (
                <Button type="primary" className='w-full' onClick={() => {signOut()}}>Signout</Button>
            )
        }
    ] 

    console.log(session)

  return (
    <div>
        <Skeleton loading={isLoading} active avatar={{size: "default"}} title={false} paragraph={false}>
            {
                isLoggedIn &&
                <Dropdown menu={{selectable: false, items: userDropDownItems}}>
                    <div className='cursor-pointer'>
                        <Avatar size="default" src={session?.user?.image} className='!mr-[8px]' />
                    </div>
                </Dropdown>
            }
        </Skeleton>
    </div>
  )
}

export default UserDdropdown;
