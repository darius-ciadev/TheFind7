import { useEffect, useState } from 'react'

export default function useWindowSize() {
    const [size, setSize] = useState({ width: 0, height: 0 })

    useEffect(() => {
        const handleResize = () => {
        setSize({
            width: window.innerWidth,
            height: window.innerHeight
        })
        }

        // Set initial size
        handleResize()

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return size
}
