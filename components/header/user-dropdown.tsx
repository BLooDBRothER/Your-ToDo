
import { useUserContext } from '@/context/UserContext';
import { UserContextType } from '@/lib/types';
import { ClockCircleFilled, DownOutlined, LogoutOutlined, MailFilled } from '@ant-design/icons';
import { Avatar, Dropdown, MenuProps, Skeleton, Switch } from 'antd';
import { signOut, useSession } from 'next-auth/react';
import React, { useState } from 'react'


const UserDdropdown = () => {

    const { data: session, status } = useSession();
    const { userData, isUserDataLoading, updateUserMetaData } = useUserContext() as UserContextType;

    const [dropdownOpen, setDropDownOpen] = useState(false);

    const isLoading = status === "loading" ? true : false
    const isLoggedIn = status === "authenticated" ? true : false;

    const items: MenuProps['items'] = [
        {
            label: (
                <div>
                    <p className='text-light'>{session?.user?.email}</p>
                    <p className='text-xs text-light/50'>{session?.user?.name}</p>
                </div>
            ),
            key: '0',
        },
        {
            type: 'divider',
        },
        {
            label: <div className='flex items-center justify-between gap-2' >
                <div>Remainder Email</div>
                <Switch loading={isUserDataLoading.emailRemainder} size="small" checked={userData.emailRemainder} />
            </div>,
            icon: <MailFilled />,
            key: 'emailRemainder',
        },
        {
            label: <div className='flex items-center justify-between gap-2'>
                <div>Due Date Relative Time</div>
                <Switch loading={isUserDataLoading.relativeTime} size="small" checked={userData.relativeTime} />
            </div>,
            icon: <ClockCircleFilled />,
            key: 'relativeTime',
        },
        {
            type: 'divider',
        },
        {
            label: (
                <div>Sign Out</div>
            ),
            icon: <LogoutOutlined />,
            danger: true,
            key: 'logout',
        },

    ];

    const handleMenuClick: MenuProps["onClick"] = ({ key , domEvent: e }) => {
        if(key === "emailRemainder" && !isUserDataLoading.emailRemainder)
            updateUserMetaData("emailRemainder", !userData.emailRemainder)
        else if (key === "relativeTime" && !isUserDataLoading.relativeTime)
            updateUserMetaData("relativeTime", !userData.relativeTime)
        else if (key === "logout")
            signOut()
    }

    return (
        <div className='user-dropdown-cnt'>
            <Skeleton loading={isLoading} active avatar={{ size: "default" }} title={false} paragraph={false}>
                {
                    isLoggedIn &&
                    <Dropdown className='user-dropdown' menu={{ items, onClick: handleMenuClick }} placement='bottomRight' arrow={{ pointAtCenter: true }} open={dropdownOpen} trigger={["click"]} onOpenChange={(e) => {setDropDownOpen(e)}}>
                        <div className='cursor-pointer bg-secondary px-2 py-1 rounded-md flex items-center justify-between gap-2 text-xs'>
                            <Avatar size="small" src={session?.user?.image} />
                            <DownOutlined />
                        </div>
                    </Dropdown>
                }
            </Skeleton>
        </div>
    )
}

export default UserDdropdown;
