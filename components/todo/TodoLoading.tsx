import { Divider, Skeleton } from 'antd'
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
              <div className='bg-primary flex flex-col gap-2 rounded-lg text-lg w-[180px] h-[290px]'>
                <Skeleton.Image active className='!w-full !h-[180px]' />
                <Skeleton paragraph={false} active className='!w-11/12 px-4 my-auto' />
                <Divider className='!my-0' />
                <Skeleton paragraph={false} active className='!w-6/12 my-auto pb-2 px-4 self-start' />
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
