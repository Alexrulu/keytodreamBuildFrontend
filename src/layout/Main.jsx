import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import Carousel from '../components/Carousel.jsx'

const futureProperties = [
  {adress:'Solis al 1900'      ,img:'/future-propertie3.jpg' ,city:'San Fernando, Buenos Aires',price:180000},
  {adress:'Acqua del Rio 100'  ,img:'/future-propertie2.jpg' ,city:'San Miguel, Buenos Aires'  ,price:12000 },
  {adress:'Paseo Victorica 201',img:'/future-propertie1.webp',city:'Palermo, Buenos Aires'     ,price:150000},
]

const Main = () => {

  //FRONTEND
  const [currentIndexFuture, setCurrentIndexFuture] = useState(0)
  const currentFuture = futureProperties[currentIndexFuture] || {}
  const [currentIndex, setCurrentIndex] = useState(0)

  //API
  const [properties, setProperties] = useState([])
  const currentProperty = properties.slice(0,4)[currentIndex] || {}
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/properties`)
      .then(response => response.json())
      .then(data => setProperties(data))
      .catch(error => console.error('Error al cargar las propiedades:', error))
  }, [])

  return (
    <>
    <div className='overflow-hidden'>

      {/* mobile carousels */}
      <motion.div className='w-4/5 mx-auto mb-20 lg:hidden'
                    initial={{x:100,opacity:0 }}
                whileInView={{x:0  ,opacity:1 }}
                   viewport={{amount:0.5      }}
                 transition={{duration: 1     }}>
        <div>
          <p className='text-3xl font-bold leading-tight'>Nuestras recomendaciones</p>
          <p className="text-base text-zinc-700 mt-4 text-center sm:text-left">Lo mejor del mercado, elegido para ti.</p>
        </div>
        <div className='flex justify-center mt-6'>
          <Carousel imgs={properties.slice(0,4).map(property => `${import.meta.env.VITE_API_URL}${property.principalImage}`)} onSlideChange={setCurrentIndex}/>
        </div>
        <motion.div key={ currentIndex }
                initial={{opacity:0   }}
                animate={{opacity:1   }}
             transition={{duration:1}}>
          <p className='text-xl mt-4 font-semibold'>{currentProperty.adress}</p>
          <p className='text-lg text-gray-600 text-center italic sm:text-left'>{currentProperty.city}</p>
          <p className='text-xl mt-1 text-end font-semibold sm:text-left'>Desde USD ${currentProperty.price}</p>
        </motion.div>
        <Link to={`/article/${currentProperty.id}`} className='flex ml-auto w-35 bg-black text-white py-2 px-4 rounded-xl shadow-xl mt-4 sm:ml-0'>Ver propiedad</Link>
      </motion.div>

      <motion.div className='w-4/5 mx-auto lg:hidden'
                    initial={{x:100,opacity:0 }}
                whileInView={{x:0  ,opacity:1 }}
                   viewport={{amount:0.5      }}
                 transition={{duration: 1     }}>
        <div>
          <p className='text-3xl font-bold leading-tight text-centr'>Futuras propiedades</p>
          <p className="text-base text-zinc-700 mt-4 text-center sm:text-left">Propiedades en desarrollo, listas para ti muy pronto.</p>
        </div>
        <div className='flex justify-center mt-6'>
          <Carousel imgs={futureProperties.map(property => property.img)} onSlideChange={setCurrentIndexFuture} />
        </div>
        <motion.div key={currentIndexFuture}
                initial={{opacity:0 }}
                animate={{opacity:1 }}
             transition={{duration:1}}>
          <p className='text-xl mt-4 font-semibold'>{currentFuture.adress}</p>
          <p className='text-lg text-gray-600 italic text-center sm:text-left'>{currentFuture.city}</p>
          <p className='text-xl mt-1 font-semibold text-end sm:text-left'>Desde USD ${currentFuture.price}</p>
        </motion.div>
        <button className='flex ml-auto bg-black text-white py-2 px-4 rounded-xl shadow-xl mt-4 sm:ml-0'>Ver proyecto</button>
      </motion.div>

      {/* desktop carousels */}
      <motion.div className='hidden lg:flex h-[100vh] p-20 justify-between'>
        <motion.div className='flex flex-col justify-center gap-6 font-bold h-[60vh] w-[35vw]'
                      initial={{x:-100,opacity:0}}
                  whileInView={{x:0   ,opacity:1}}
                     viewport={{amount:0.5}}
                 transition={{duration:3, type:"spring"}}>
          <p className='leading-tight lg:text-4xl xl:text-5xl'>Nuestras recomendaciones</p>
          <p className="text-lg text-zinc-700">Lo mejor del mercado, elegido para ti.</p>
          <AnimatePresence mode='wait'>
            <motion.div className='flex flex-col gap-6'
                              key={ currentIndex }
                          initial={{opacity:0   }}
                          animate={{opacity:1   }}
                             exit={{opacity:0   }}
                       transition={{duration:0.5}}>
              <p className='text-2xl'>{currentProperty.adress}</p>
              <p className='text-xl italic'>{currentProperty.city}</p>
              <p className='text-2xl'>USD ${currentProperty.price}</p>
            </motion.div>
          </AnimatePresence>
          <Link to={`/article/${currentProperty.id}`} className='bg-black text-white py-1 px-2 w-1/2 text-center shadow-xl rounded-xl'>Ver propiedad</Link>
        </motion.div>
        {properties.length > 0 &&(
          <Carousel imgs={properties.slice(0,4).map(property => `${import.meta.env.VITE_API_URL}${property.principalImage}`)} 
                idPrefix={"recomended"} className='w-[50vw] h-[60vh]' onSlideChange={setCurrentIndex}/>
        )}
      </motion.div>

      <motion.div className='hidden lg:flex h-[85vh] p-20 justify-between'>
        <motion.div className='flex flex-col justify-center gap-6 font-bold h-[60vh] w-[35vw]'
                      initial={{x:-100,opacity:0}}
                  whileInView={{x:0   ,opacity:1}}
                     viewport={{amount:0.5}}
                   transition={{duration:3, type:"spring"}}>
          <p className='leading-tight lg:text-4xl xl:text-5xl'>Futuras<br/>propiedades</p>
          <p className="text-lg w-2/3 xl:w-full text-zinc-700">Propiedades en desarrollo, listas para ti muy pronto.</p>
          <AnimatePresence mode='wait'>
            <motion.div className='flex flex-col gap-6'
                              key={currentIndexFuture}
                          initial={{opacity:0   }}
                          animate={{opacity:1   }}
                             exit={{opacity:0   }}
                       transition={{duration:0.5}}>
              <p className='text-2xl'>{currentFuture.adress}</p>
              <p className='text-xl italic'>{currentFuture.city}</p>
              <p className='text-2xl'>Desde USD ${currentFuture.price}</p>
            </motion.div>
          </AnimatePresence>
          <button className='bg-black text-white py-1 px-2 rounded-xl w-1/2 shadow-xl cursor-pointer'>Ver detalles</button>
        </motion.div>
        <Carousel imgs={futureProperties.map(property => property.img)} idPrefix={"future"} 
             className='w-[50vw] h-[60vh]' onSlideChange={setCurrentIndexFuture}/>
      </motion.div>

    </div>
    </>
  )
}

export default Main