import { Skeleton } from 'antd'
import React, { Fragment } from 'react'

const loadingCompCount = Array(6).fill(0);

const TodoLoading = ({ type }: { type: "folder" | "todo" | "todoContent" }) => {
  return (
    <>
      {
        loadingCompCount.map((_, idx) => (
          <Fragment key={idx}>
            {
              type === "folder" &&
              <div className='bg-primary p-4 flex flex-row items-center gap-4 w-full rounded-lg text-lg sm:w-[250px]'>
                <Skeleton.Avatar size="small" style={{ "marginTop": "1.5px" }} active />
                <Skeleton paragraph={false} active />
              </div>
            }
            {
              type === "todo" &&
              <div className='bg-primary flex flex-col items-center gap-4 rounded-lg text-lg w-full h-[318px]'>
                <Skeleton.Image active className='!w-full !h-[220px]' />
                <Skeleton paragraph={false} active className='!w-9/12 my-auto' />
              </div>
            }
            {
              type === "todoContent" &&
              <div className='bg-primary p-4 my-2 rounded-lg text-xl flex items-center justify-start'>
                <Skeleton paragraph={false} active />
                <div className='flex items-center justify-start ml-4'>
                  <Skeleton paragraph={false} title={false} avatar={{ shape: "square", size: "small" }} active />
                  <Skeleton paragraph={false} title={false} avatar={{ shape: "square", size: "small" }} active />
                </div>
              </div>
            }
          </Fragment>))
      }
    </>
  )
}

export default TodoLoading
