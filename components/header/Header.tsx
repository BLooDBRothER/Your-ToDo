"use client";

import Image from 'next/image'
import React from 'react'
import UserDdropdown from './user-dropdown'

const Header = () => {
  return (
        <header className='px-4 pt-4 flex items-center justify-between'>
            <div>
                <Image
                    src="/logo/logo-only-text.png"
                    width={200}
                    height={40}
                    alt='logo'
                />
            </div>
            <UserDdropdown />
        </header>
  )
}

export default Header
