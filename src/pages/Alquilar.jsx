import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from 'react-toastify'
import { useAuth } from '../components/AuthToken.jsx'
import Filtros from "../components/Filtros"
const Alquilar = () => {

  //FRONTEND
  const [activeImgId, setActiveImgId] = useState(null)
  const toggleImgOpen = (id) => {
    setActiveImgId(prevId => (prevId === id ? null : id))
  }

  //API
  const [savedIds, setSavedIds] = useState(new Set())
  const [properties, setProperties] = useState([])
  const {user, token, setUser, isLoggedIn} = useAuth()

  const query = useQuery()
  const search = query.get('search')?.toLowerCase() || ''
  function useQuery() {
    return new URLSearchParams(useLocation().search)
  }

  const toggleSave = async (propertyId) => {
    const newFavorites = new Set(savedIds)
    if (newFavorites.has(propertyId)) {
      newFavorites.delete(propertyId)
    } else {
      newFavorites.add(propertyId)
    }
    try {
      const response = await fetch(`https://keytodreambuildbackend-production.up.railway.app/api/users/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          favoritos: Array.from(newFavorites)
        })
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message)
      setSavedIds(newFavorites);
      setUser(prev => ({ ...prev, favoritos: Array.from(newFavorites) }))
    } catch (err) {
      console.error('Error al actualizar favoritos:', err)
      toast.error('Error al actualizar favoritos')
    }
  }

  useEffect(() => {
    if (user?.favoritos && user.favoritos.length > 0) {
      setSavedIds(new Set(user.favoritos))
    }
  }, [user])

  useEffect(() => {
    fetch('https://keytodreambuildbackend-production.up.railway.app/api/properties')
      .then(response => response.json())
      .then(data => setProperties(data))
      .catch(error => console.error('Error al cargar las propiedades:', error))
  }, [])

  return (
    <>
      <Filtros />
      <motion.div className="w-full my-3 px-3 flex flex-col gap-5 md:px-10 md:grid md:grid-cols-2 lg:px-20 xl:grid-cols-3"
                        key={search}
                    initial={{clipPath:'circle(0% at 0 0)'  }}
                    animate={{clipPath:'circle(200% at 0 0)'}}
                       exit={{clipPath:'circle(0% at 0 0)'  }}
                 transition={{duration:1}}>
        {properties.filter(property => property.type === 2 && property.city.toLowerCase().includes(search)).length === 0 ? (
          <p className="text-zinc-600">No se encontraron propiedades en la ciudad de <span className="font-semibold">{search}</span></p>
        ) : (
          properties.filter(property => property.type === 2 && property.city.toLowerCase().includes(search)).map((property) => (
            <article key={property.id} className="relative overflow-hidden bg-zinc-100 justify-between h-[20vh] group w-full flex gap-1 text-zinc-800 text-sm rounded-xl shadow-lg 
                sm:h-[30vh] md:h-[20vh] duration-300 xl:shadow-none xl:overflow-visible xl:group xl:hover:shadow-[0_20px_10px_rgba(0,0,0,0.2)] xl:hover:-translate-y-2 xl:hover:scale-105">
              <img src={`https://keytodreambuildbackend-production.up.railway.app${property.principalImage}`} onClick={() => toggleImgOpen(property.id)}
             className={`w-1/2 cursor-pointer object-cover object-center rounded-xl duration-300 xl:group-hover:-translate-y-2
                      ${activeImgId === property.id ? 'w-[90%] sm:w-[95%] md:w-[90%]' : 'w-1/2'}`}/>
              <Link className={`p-2 flex flex-col justify-between overflow-hidden duration-300 ${activeImgId === property.id ? 'w-0 opacity-0' : 'w-1/2 opacity-100'}`} 
                           to={`/article/${property.id}`}>
                <span>USD ${property.price}</span>
                <h2>{property.adress}</h2>
                <h3 className="text-zinc-600">{property.city}</h3>
                <p className="text-xs truncate">{property.description}</p>
                <h4>{property.personalName}</h4>
              </Link>
              {isLoggedIn && (
                <i onClick={() => toggleSave(property.id)} className={`fa-heart transition text-xl absolute right-1.5 top-1.5 cursor-pointer
                        ${savedIds.has(property.id) ? 'text-red-700 fa-solid' : 'fa-regular text-zinc-500'}`}/>
              )}
            </article>
          ))
        )}
      </motion.div>
    </>
  )
}

export default Alquilar