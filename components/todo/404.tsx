import { Empty } from 'antd'
import React from 'react'

import Image from 'next/image'

const PageNotFound = () => {
    return (
        <div className='flex items-center justify-center w-full h-full'>
            <Image
                priority
                width={0}
                height={0}
                className='w-[400px] h-[400px]'
                alt='No Data'
                src="/assets/404.svg"
            />
        </div>
    )
}

export default PageNotFound
