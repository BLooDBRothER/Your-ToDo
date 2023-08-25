import { Skeleton } from 'antd'
import React from 'react'

const loadingCompCount = Array(6).fill(0);

const TodoLoading = ({ type }: { type: "folder" | "todo"}) => {
  return (
    <>
        {
          type === "folder" ?
          loadingCompCount.map((_, idx) => (
              <div key={idx} className='bg-primary p-4 flex flex-row items-center gap-4 w-full rounded-lg text-lg sm:w-[250px]'>
                      <Skeleton.Avatar size="small" style={{"marginTop": "1.5px"}} active/>
                      <Skeleton paragraph={false} active />
                  </div>
          )) :
          loadingCompCount.map((_, idx) => (
            <div key={idx} className='bg-primary flex flex-col items-center gap-4 rounded-lg text-lg w-full h-[318px]'>
                    <Skeleton.Image active className='!w-full !h-[220px]' />
                    <Skeleton paragraph={false} active className='!w-9/12 my-auto' />
                </div>
        ))
        }
    </>
  )
}

export default TodoLoading
