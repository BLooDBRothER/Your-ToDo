import { Empty } from 'antd'
import React from 'react'

import Image from 'next/image'

const NoData = ({ description }: { description: string}) => {
    return (
        <div className='flex items-center justify-center w-full'>
            <Empty
                image={
                    <Image
                        priority
                        width={0}
                        height={0}
                        className='w-full h-auto'
                        alt='No Data'
                        src="/assets/no_data.svg"
                    />
                }
                description={
                    <span className='bg-primary px-2 py-1 rounded-md'>
                        {description}
                    </span>
                }
            />
        </div>
    )
}

export default NoData
