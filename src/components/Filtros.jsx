import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'

const Filtros = () => {

  //FRONTEND
  const [isOpen, setIsOpen] = useState(false)

  //API
  const [searchAddress, setSearchAddress] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname.startsWith('/comprar') ? 'comprar' : 'alquilar'
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchAddress.trim() !== '') {
      navigate(`/${currentPath}?search=${searchAddress}`)
    } else {
      navigate(`/${currentPath}`)
    }
  }

  return(
    <>
      <div className="px-3 w-full mt-2 flex flex-col gap-3 md:px-10 lg:px-20 xl:py-1">

        <div className='flex flex-col gap-3 md:grid-cols-2 md:grid-rows-1 md:grid xl:grid-cols-3 xl:gap-5'>
          <form onSubmit={handleSearch} className="w-full px-3 py-1 bg-zinc-100 rounded-xl flex items-center justify-between md:col-span-1 md:order-2 xl:col-span-2 ">
            <input type="search" placeholder="Buscar por ciudad" className="outline-none w-full" value={searchAddress} onChange={(e) => setSearchAddress(e.target.value)}/>
            <button type='submit' className="fa-solid fa-magnifying-glass cursor-pointer text-zinc-500"/>
          </form>
  
          <div className="flex items-center justify-between lg:gap-3 md:col-start-1 md:col-span-1">
            <span onClick={() => setIsOpen(!isOpen)} className='cursor-pointer bg-zinc-100 py-1 px-2 rounded-xl duration-100 active:translate-y-1'>Filtros<i className="fa-solid fa-angle-down ml-2"/></span>
            <Link to="/map" className="bg-zinc-100 py-1 px-2 hover:bg-zinc-200 rounded-xl duration-300">Ver mapa</Link>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div className='absolute z-10 w-full top-36 left-0 px-5 pb-5 flex flex-col gap-3 text-zinc-700 origin-top-left bg-white border-b border-zinc-300
                      shadow-xl sm:w-2/3 md:w-1/2 sm:left-3 md:left-10 md:px-10 lg:left-20 lg:w-1/3 sm:border-zinc-100 sm:border md:top-25 rounded-xl xl:top-27'
                          initial={{scaleY:0,scaleX:0, clipPath:'circle(0%   at 0% 0%)'}}
                          animate={{scaleY:1,scaleX:1, clipPath:'circle(150% at 0% 0%)'}}
                             exit={{scaleY:0,scaleX:0, clipPath:'circle(0%   at 0% 0%)'}}
                       transition={{duration:0.5}}>

              <div className='flex gap-2 justify-around mt-2 border border-zinc-200 rounded-xl py-1'>
                <NavLink to="/alquilar" className={({isActive}) => isActive ? 'bg-black text-white px-2 py-1 rounded-xl' : 'px-2 py-1 hover:bg-zinc-200 duration-300 rounded-xl'}>Alquilar</NavLink>
                <NavLink to="/comprar" className={({isActive}) => isActive ? 'bg-black text-white px-2 py-1 rounded-xl' : 'px-2 py-1 hover:bg-zinc-200 duration-300 rounded-xl'}>Comprar</NavLink>
              </div>
  
              <p>Baños</p>
              <span className='flex w-full justify-between px-5'>
                {[1,2,3,4,5,6].map((item) => (
                  <p className='hover:bg-zinc-200 cursor-pointer duration-200 px-3 py-1 rounded-xl'>{item}</p>
                ))}
              </span>
  
              <p>Dormitorios</p>
              <span className='flex w-full justify-between px-5'>
                {[1,2,3,4,5,6].map((item) => (
                  <p className='hover:bg-zinc-200 cursor-pointer duration-200 px-3 py-1 rounded-xl'>{item}</p>
                ))}
              </span>
  
              <p>Metros cuadrados</p>
              <span className='flex w-full px-5 border-b-1 border-zinc-100'>
                <input type='text' placeholder='Desde' className='w-1/2 outline-none'/>
                <input type='text' placeholder='Hasta' className='w-1/2 outline-none'/>
              </span>
  
              <p>Fecha de publicacion</p>
              <span className='flex w-full px-5 text-zinc-400'>
                <p className='w-1/2 outline-none hover:bg-zinc-200 duration-200 px-2 py-1 text-center rounded-xl cursor-pointer'>Reciente</p>
                <p className='w-1/2 outline-none hover:bg-zinc-200 duration-200 px-2 py-1 text-center rounded-xl cursor-pointer'>Antiguo</p>
              </span>
              
              <p>Precio</p>
              <span className='flex w-full px-5 text-zinc-400'>
                <p className='w-1/2 outline-none hover:bg-zinc-200 duration-200 px-2 py-1 text-center rounded-xl cursor-pointer'>Economico</p>
                <p className='w-1/2 outline-none hover:bg-zinc-200 duration-200 px-2 py-1 text-center rounded-xl cursor-pointer'>Costoso</p>
              </span>
  
            </motion.div>
          )}
        </AnimatePresence>
        
      </div>
    </>
  )
}

export default Filtros