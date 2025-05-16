import { Link, useNavigate } from "react-router-dom"
import { motion } from 'motion/react'
import { useState } from 'react'

import ModelHouse from "../components/ModelHouse"

const Hero = () => {

  //API
  const [searchAddress, setSearchAddress] = useState('')
  const navigate = useNavigate()

    const handleSearch = (e) => {
    e.preventDefault()
    const trimmed = searchAddress.trim().toLowerCase()
    if (trimmed !== '') {
      navigate(`/comprar?search=${trimmed}`)
    } else {
      navigate('/comprar')
    }
  }

  return(
    <>
      {/* MOBILE HERO */}
      <div className="relative h-[95vh] mb-[5vh] xl:hidden">
        <motion.div className="absolute z-10 h-[75%] top-[-15vh] w-full md:h-[80%]"
                      initial={{opacity:0}}
                      animate={{opacity:1}}
                   transition={{delay:1, duration: 1 }}>
          <ModelHouse />
        </motion.div>
    
        <div className="flex flex-col justify-center w-full absolute bottom-[10vh] h-1/2 gap-10 md:bottom-[5vh]">
          <div className="w-full flex flex-col gap-5 items-center justify-center p-5">
            <h1 className="text-[3em] text-center leading-tight font-bold">Encuentra tu hogar ideal</h1>
            <h2 className="text-center text-[1.5em] text-zinc-700">Más de 10,000 propiedades a tu alcance.</h2>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 translate-y-[-2vh]">
            <div className="flex items-center justify-between w-60 gap-3">
              <Link to="/alquilar" className="text-center bg-black text-white py-1 w-full px-2 rounded-xl">Alquilar</Link>
              <Link to="/comprar" className="text-center py-1 px-2 bg-zinc-100 w-full rounded-xl">Comprar</Link>
            </div>
            <form onSubmit={handleSearch} className="flex items-center justify-between w-60 bg-white mx-auto shadow-inner border border-zinc-200 py-1 rounded-xl">
              <input type="search" placeholder="Explorar..." value={searchAddress} onChange={(e) => setSearchAddress(e.target.value)} className="outline-none w-50 pl-3" />
              <button type="submit" className="fa-solid fa-magnifying-glass text-zinc-500 w-10 text-center h-full py-1"/>
            </form>
          </div>
        </div>
      </div>

      {/* DESKTOP HERO */}
      <div className="hidden xl:flex h-[96vh] w-full mb-[10vh] overflow-hidden">
        <div className="z-10 flex flex-col justify-center h-full gap-6 w-2/5 pl-20">
          <h1 className="text-6xl font-bold leading-tight">Encuentra<br />tu hogar ideal</h1>
          <h2 className="text-lg text-zinc-700">Más de 10,000 propiedades a tu alcance.</h2>
          <div className="flex gap-3">
            <Link to="/alquilar" className="bg-black text-white px-4 py-2  shadow-xl hover:bg-zinc-800 duration-300 rounded-xl">Alquilar</Link>
            <Link to="/comprar" className="px-4 py-2 hover:bg-zinc-200 duration-300 rounded-xl">Comprar</Link>
          </div>
          <form onSubmit={handleSearch} className="flex items-center bg-white border border-zinc-200 w-[30vw] rounded-xl px-4 py-2 shadow-inner duration-300">
            <input type="text" placeholder="Explorar..." className="outline-none w-full text-sm" value={searchAddress} onChange={(e) => setSearchAddress(e.target.value)}/>
            <button type="submit" className="fa-solid fa-magnifying-glass text-zinc-500 ml-2" />
          </form>
        </div>

        <motion.div className="w-3/5 h-full translate-y-[-10px]"
                     initial={{opacity:0}}
                     animate={{opacity:1}}
                  transition={{delay:1, duration:1 }}>
          <ModelHouse />
        </motion.div>
      </div>
    </>
  )
}
export default Hero