import { Skeleton } from 'antd'
import React from 'react'

const loadingCompCount = Array(6).fill(0);

const TodoLoading = () => {
  return (
    <>
        {
            loadingCompCount.map((_, idx) => (
                <div key={idx} className='bg-primary p-4 flex flex-col items-center gap-4 w-[150px] rounded-lg text-lg hover:bg-primary/80 sm:w-[250px] sm:flex-row'>
                        <Skeleton.Avatar size="small" style={{"marginTop": "1.5px"}} />
                        <Skeleton paragraph={false} />
                    </div>
            ))
        }
    </>
  )
}

export default TodoLoading
