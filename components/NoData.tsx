import { Empty } from 'antd'
import React from 'react'

import Image from 'next/image'

const NoData = () => {
    return (
        <div className='flex items-center justify-center w-full'>
            <Empty
                image={
                    <Image
                        src="/assets/no_data.svg"
                        width={200}
                        height={200}
                        alt='No Data'
                    />
                }
                description={
                    <span className='bg-primary px-2 py-1 rounded-md'>
                        No Folders
                    </span>
                }
            />
        </div>
    )
}

export default NoData
