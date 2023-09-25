"use client";

import Image from 'next/image'
import React from 'react'
import UserDdropdown from './user-dropdown'

const Header = () => {
  return (
        <header className='px-5 pt-4 flex items-center justify-between'>
            <div>
                <Image
                    src="/logo/logo-only-text.png"
                    priority
                    width={200}
                    height={0}
                    className='w-[200px] h-auto'
                    alt='logo'
                />
            </div>
            <UserDdropdown />
        </header>
  )
}

export default Header
