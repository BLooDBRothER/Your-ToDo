import Image from 'next/image'
import React from 'react'


const Header = () => {
  return (
        <header className='px-4 pt-4'>
            <div>
                <Image
                    src="/logo/logo-only-text.png"
                    width={200}
                    height={40}
                    alt='logo'
                />
            </div>
        </header>
  )
}

export default Header
