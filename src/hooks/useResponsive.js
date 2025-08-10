import { useState, useEffect } from 'react'

const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  })

  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth
      const height = window.innerHeight

      setWindowSize({
        width,
        height,
      })

      // Define breakpoints (matching Tailwind CSS)
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
      setIsDesktop(width >= 1024)
    }

    // Add event listener
    window.addEventListener('resize', handleResize)

    // Call handler right away so state gets updated with initial window size
    handleResize()

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
    width: windowSize.width,
    height: windowSize.height,
  }
}

export default useResponsive
