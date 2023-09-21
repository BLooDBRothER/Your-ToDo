import { useEffect, useState } from 'react'

const useDebounce = (query: string, delay: number) => {
    const [value, setValue] = useState("");


    useEffect(() => {

        const timerId = setTimeout(() => {
            setValue(query);
        }, delay)

        return () => {
            clearTimeout(timerId)
        }
        
    }, [query, delay])
  
    return value
}

export default useDebounce
