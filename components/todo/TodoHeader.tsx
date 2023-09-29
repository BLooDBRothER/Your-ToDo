import { FolderAddOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { Button, Dropdown, Input, MenuProps, Segmented } from 'antd'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import useDebounce from '@/app/hooks/useDebounce'
import { ModalOpenType } from '@/lib/types'

type TodoHeaderPropsType = {
    openModal: ModalOpenType
    createNewTodo: () => void
}

const filterOptions = ["All", "Folder", "Todo"];

const TodoHeader = ({ openModal, createNewTodo }: TodoHeaderPropsType) => {

    const searchParams = useSearchParams();
    const pathName = usePathname();
    const router = useRouter();
    
    const [searchQuery, setSearchQuery] = useState("");
    const query = useDebounce(searchQuery, 500);
    
    const count = useRef(0)

    const newButtonItems: MenuProps["items"] = [
        {
            key: "folder",
            label:  <div className='text-sm flex items-center justify-start gap-2 px-2 py-1'>
                        <span><FolderAddOutlined /></span>
                        <span>Folder</span>
                    </div>
        },
        {
            key: "todo",
            label:  <div className='text-sm flex items-center justify-start gap-2 px-2 py-1'>
                        <span><UnorderedListOutlined /></span>
                        <span>Todo</span>
                    </div>
        }
    ]

    const createQueryString = useCallback(
        (name: string, value: string) => {
          const params = new URLSearchParams(Array.from(searchParams.entries()));
        
          if((name === "visibility" && value !== "All") || (name === "search" && value))
            params.set(name, value)
          else
            params.delete(name)
     
          return params.toString()
        },
        [searchParams]
      )

    const handleDropdownMenuClick = ({ key }: { key: string }) => {
        key === "folder" ? openModal("create") : createNewTodo();
    }

    const updateFilter = (field: string, value: string) => {
        router.push(`${pathName}?${createQueryString(field, value)}`);
    }

    useEffect(() => {
        if(count.current === 0){
            count.current++;
            return;
        }

        updateFilter("search", query)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query])

    useEffect(() => {
        setSearchQuery(searchParams.get("search") ?? "")
    }, [searchParams])

    return (
        <div className='p-2 bg-primary rounded-md flex flex-col items-center justify-between gap-2 relative sm:sticky top-0 left-0 z-10 sm:flex-row'>
            <Dropdown menu={{items: newButtonItems, inlineIndent: 50, onClick: handleDropdownMenuClick}}>
                <Button type="primary" icon={<PlusOutlined />} >New</Button>
            </Dropdown>
            <Input placeholder="input search text" onChange={(e) => {setSearchQuery(e.target.value)}} value={searchQuery} className='w-full sm:!w-[400px]' />
            <Segmented options={filterOptions} value={searchParams.get("visibility") || "All"} onChange={(filterValue) => {updateFilter("visibility", filterValue as string)}} />
        </div>
    )
}

export default TodoHeader
