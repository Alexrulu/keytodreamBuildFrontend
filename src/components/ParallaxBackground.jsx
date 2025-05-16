import { useEffect, useRef } from "react"

const ParallaxBackground = () => {
  const ref = useRef()

  useEffect(() => {
    let current = 0
    let target = 0
    const lerp = (a, b, n) => a + (b - a) * n;
    const animate = () => {
      current = lerp(current, target, 0.05)
      if (ref.current) {
        ref.current.style.backgroundPosition = `-${current}px -${current}px`
      }
      requestAnimationFrame(animate)
    }
    const handleScroll = () => {
      target = window.scrollY * 0.2
    }
    window.addEventListener("scroll", handleScroll)
    animate();
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  return <div ref={ref} className="parallax-grid fixed inset-0 -z-10" />
}

export default ParallaxBackground
