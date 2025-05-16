import { useState, useRef } from 'react'
import { motion } from 'motion/react'

const Carousel = ({imgs, idPrefix, className = "", onSlideChange}) => {

  //FRONTEND
  const [currentIndex, setCurrentIndex] = useState(0)
  const mobileRef = useRef(null)
  const total = imgs.length

  const handleSlide = (newIndex) => {
    setCurrentIndex(newIndex)
    onSlideChange?.(newIndex)
  }

  const handleScroll = () => {
    if (!mobileRef.current) return;
    const scrollLeft = mobileRef.current.scrollLeft
    const width = mobileRef.current.offsetWidth
    const index = Math.round(scrollLeft / width)
    if (index !== currentIndex) {
      handleSlide(index)
    }
  }
  
  return(
    <>
    {/* for mobile */}
      <div ref={mobileRef} onScroll={handleScroll} className='carousel h-[30vh] sm:h-[40vh] md:h-[50vh] overflow-x-scroll scroll-snap-x mandatory flex rounded-xl lg:hidden'>
          {imgs.map((img, index) => (
            <div key={index} className='carousel-item w-full'>
              <img src={img} className='w-full object-cover h-full'/>
            </div>
          ))}
      </div>

      {/* for desktop */}
      <motion.div className={`relative hidden lg:flex carousel shadow-xl rounded-xl overflow-hidden ${className}`}
        initial={{ opacity: 0, x: -200 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ amount: 0.5 }}
        transition={{ duration: 3, type: "spring" }}>
        <div className="flex transition-transform duration-700 ease-in-out w-full" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {imgs.map((img, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <img src={img} className="w-full h-full object-cover" alt={`Slide ${index}`} />
            </div>
          ))}
        </div>
      
        <div className="absolute w-full bottom-4 flex justify-between items-center px-4 pointer-events-none">
          <button className="pointer-events-auto cursor-pointer text-white px-4 py-2 bg-black/30 backdrop-blur-sm shadow-md rounded-xl 
                             duration-100 hover:bg-black/50 active:translate-y-1"
                    onClick={() => {const prev = (currentIndex - 1 + total) % total; setCurrentIndex(prev); onSlideChange?.(prev);}}>❮</button>
          <button className="pointer-events-auto cursor-pointer text-white px-4 py-2 bg-black/30 backdrop-blur-sm shadow-md rounded-xl 
                             duration-100 hover:bg-black/50 active:translate-y-1"
                    onClick={() => {const next = (currentIndex + 1) % total; setCurrentIndex(next); onSlideChange?.(next);}}>❯</button>
        </div>
      </motion.div>
    </>
  )
}

export default Carousel