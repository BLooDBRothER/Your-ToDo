import { GithubFilled } from '@ant-design/icons'
import React from 'react'

const Footer = () => {
  return (
    <div className='px-2 text-xs'>
        <a className='flex items-center justify-center gap-2 hover:text-white/50' href='https://github.com/BLooDBRothER/Your-ToDo/' target='_blank'>
            <GithubFilled />
            <span>View Source Code</span>
        </a>
    </div>
  )
}

export default Footer
