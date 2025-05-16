import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { toast } from 'react-toastify'
import { useAuth } from '../components/AuthToken.jsx'

const Article = () => {
  //FRONTEND
  const [property, setProperty] = useState(null)
  const [images, setImages] = useState([])
  const [update, setUpdate] = useState(false)
  const [tempProperty, setTempProperty] = useState(property)
  const [imagesOpen, setImagesOpen] = useState(false)

  //API
  const { id } = useParams()
  const {user,token,setUser,isLoggedIn} = useAuth();
  const [savedIds, setSavedIds] = useState(new Set())

  useEffect(() => {
    if (user?.favoritos && user.favoritos.length > 0) {
      setSavedIds(new Set(user.favoritos));
    }
  }, [user]);

  useEffect(() => {
    fetch(`https://keytodreambuildbackend-production.up.railway.app/api/properties/${id}`)
      .then(response => response.json())
      .then(data => { setProperty(data)
        const allImages = [data.principalImage, ...(data.secondaryImages || [])]
        setImages(allImages) 
      })
      .catch(error => console.error('Error al cargar la propiedad:', error))
  }, [id])
  if (!property) {
    return 
  }

  const handleUpdate = async (updatedProperty) => {
    try {  
      const response = await fetch(`https://keytodreambuildbackend-production.up.railway.app/api/properties/edit/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: updatedProperty.type,
          model: updatedProperty.model,
          adress: updatedProperty.adress,
          city: updatedProperty.city,
          m2tot: updatedProperty.m2tot,
          ambiente: updatedProperty.ambiente,
          bathroom: updatedProperty.bathroom,
          cars: updatedProperty.cars,
          bedroom: updatedProperty.bedroom,
          price: updatedProperty.price,
          description: updatedProperty.description,
          personalName: updatedProperty.personalName
        })
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message)
      toast.success('Propiedad actualizada correctamente')
      setProperty(updatedProperty)
    } catch (err) {
      console.error('Error al actualizar la propiedad:', err)
      toast.error('Error al actualizar la propiedad')
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://keytodreambuildbackend-production.up.railway.app/api/properties/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message)
      toast.info('Propiedad eliminada correctamente')
      window.location.href = '/'
    } catch (err) {
      console.error('Error al eliminar la propiedad:', err)
      toast.error('Error al eliminar la propiedad')
    }
  }

   const toggleSave = async (propertyId) => {
    const newFavorites = new Set(savedIds);
    if (newFavorites.has(propertyId)) {
      newFavorites.delete(propertyId);
    } else {
      newFavorites.add(propertyId);
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
      setSavedIds(newFavorites)
      setUser(prev => ({ ...prev, favoritos: Array.from(newFavorites) }))
    } catch (err) {
      console.error('Error al actualizar favoritos:', err)
      toast.error('Error al actualizar favoritos')
    }
  }

  return (
    <>
      <div className={`flex flex-col px-3 py-5 gap-5 md:px-10 lg:px-20 ${imagesOpen ? 'duration-300 opacity-0' : 'transition-opacity duration-700'}`}>

        <div className='relative h-[60vh] md:h-[40vh] lg:h-[50vh] gap-2 2xl:gap-3 flex flex-col md:flex-row'>
          <div  className="h-1/2 sm:h-2/3 md:h-full lg:flex carousel w-full mx-auto rounded-xl">
            {images.slice(0, 4).map((img, index) => {
              return (
                <div key={index} id={`property-slide${index}`} className="carousel-item relative w-full">
                  <img onClick={() => setImagesOpen(true)} src={`https://keytodreambuildbackend-production.up.railway.app${img}`} className="w-full object-cover h-full cursor-pointer hover:brightness-90 transition" />
                </div>
              )
            })}
          </div>
          <div className='grid grid-cols-2 grid-rows-2 h-1/2 sm:h-1/3 gap-2 2xl:gap-3 md:grid md:h-full sm:flex w-full overflow-hidden'>
            {images.slice(0, 4).map((img, index) => (
              <div key={index} className="relative w-full h-full">
                <img src={`https://keytodreambuildbackend-production.up.railway.app${img}`}
                  onClick={() => {
                    document.getElementById(`property-slide${index}`)?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'nearest',
                      inline: 'center',
                    })
                  }}
                  className='w-full h-full object-cover cursor-pointer hover:brightness-90 transition rounded-xl'
                />
              </div>
            ))}
          </div>
          {user && (user.id === property.ownerId || user.userType === 10) && (
            <button onClick={() => {setTempProperty(property); setUpdate(!update)}} className='absolute z-10 top-2 right-2 bg-blue-900 fa-solid fa-pen text-white h-10 w-10 rounded-xl shadow-xl cursor-pointer ml-auto text-xl' />
          )}
          <AnimatePresence mode="wait">
          {update && (
            <motion.div className='absolute top-2 right-2 z-20 flex flex-col gap-2' initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
              <button onClick={() => {setTempProperty(property); setUpdate(false)}} className='text-xl fa-solid fa-xmark rounded-xl bg-blue-900 text-white h-10 w-10 shadow-xl cursor-pointer'/>
              <button onClick={() => handleDelete()}     className='text-xl fa-solid fa-trash rounded-xl bg-red-900 text-white h-10 w-10 shadow-xl cursor-pointer'/>
              <button onClick={() => {handleUpdate(tempProperty); setUpdate(false)}} className='text-xl fa-solid fa-check rounded-xl bg-black text-white h-10 w-10 shadow-xl cursor-pointer'/>
            </motion.div>
          )}
          </AnimatePresence>
        </div>

        <div className='flex flex-col gap-5 py-2 md:grid md:grid-cols-2 md:grid-rows-[auto_auto] lg:grid-rows-[auto_auto_auto] md:gap-x-10'>
          <AnimatePresence mode="wait">
          {update ? (
            <motion.div className='flex flex-col gap-2 mt-3' key="update" initial={{opacity:0}} animate={{opacity:1}}>
              <input value={tempProperty.price} onChange={(e) => setTempProperty({...tempProperty, price: e.target.value})} type="number" placeholder='Precio' className='py-1 px-2 rounded-xl bg-zinc-100 outline-none text-2xl font-semibold'/>
              <input value={tempProperty.adress} onChange={(e) => setTempProperty({...tempProperty, adress: e.target.value})} type="text" placeholder='Direccion' 
                    className='bg-zinc-100 outline-none font-bold text-3xl leading-tight py-1 px-2 rounded-xl'/>
              <input value={tempProperty.city} onChange={(e) => setTempProperty({...tempProperty, city: e.target.value})} type="text" placeholder='Ciudad' className='bg-zinc-100 outline-none italic text-xl py-1 px-2 rounded-xl'/>
              <textarea value={tempProperty.description} onChange={(e) => setTempProperty({...tempProperty, description: e.target.value})} placeholder='Descripción' className='bg-zinc-100 outline-none font-inter text-md break-words py-1 px-2 rounded-xl'/>
              <div className='mt-5 flex flex-wrap gap-3 font-inter'>
                <input value={tempProperty.m2tot} onChange={(e) => setTempProperty({...tempProperty, m2tot: e.target.value})} type="number" placeholder='Metros cuadrados' className='bg-zinc-100 outline-none py-1 px-2 rounded-xl'/>
                <input value={tempProperty.ambiente} onChange={(e) => setTempProperty({...tempProperty, ambiente: e.target.value})} type="number" placeholder='Ambientes' className='bg-zinc-100 outline-none py-1 px-2 rounded-xl'/>
                <input value={tempProperty.bathroom} onChange={(e) => setTempProperty({...tempProperty, bathroom: e.target.value})} type='number' placeholder='Baños' className='bg-zinc-100 outline-none py-1 px-2 rounded-xl'/>
                <input value={tempProperty.bedroom} onChange={(e) => setTempProperty({...tempProperty, bedroom: e.target.value})} type='number' placeholder='Dormitorios' className='bg-zinc-100 outline-none py-1 px-2 rounded-xl'/>
                <input value={tempProperty.cars} onChange={(e) => setTempProperty({...tempProperty, cars: e.target.value})} type='number' placeholder='Espacio para vehiculos' className='bg-zinc-100 outline-none py-1 px-2 rounded-xl'/>
              </div>
              <input value={tempProperty.personalName} onChange={(e) => setTempProperty({...tempProperty, personalName: e.target.value})} 
                      type="text" placeholder='Nombre del particular/inmobiliaria a cargo' className='bg-zinc-100 outline-none py-1 px-2 rounded-xl'/>
            </motion.div>
          ) : (
            <>
              <div className='flex items-center justify-between w-full md:col-span-2'>
                <p className='text-2xl font-semibold'>USD ${property.price}</p>
                <span className='flex items-center gap-3'>
                  {isLoggedIn && (
                    <i onClick={() => toggleSave(property.id)} className={`fa-heart transition text-2xl cursor-pointer
                     ${savedIds.has(property.id) ? 'text-red-700 fa-solid' : 'fa-regular text-zinc-500'}`}/>
                  )}
                  <p className='text-md text-white bg-black py-0.5 px-2 rounded-xl font-inter'>{property.type == 1 ? "Venta" : "Alquiler"}</p>
                </span>
              </div>
              <div className='flex flex-col gap-2 border-b border-zinc-300 pb-5 md:col-span-2 lg:pb-0 lg:border-none lg:col-span-1'>
                <p className='font-bold text-3xl leading-tight'>{property.adress}</p>
                <p className='text-xl italic'>{property.city}</p>
                <p className='text-md break-words font-inter'>{property.description}</p>
              </div>
              <div className='flex flex-wrap items-start gap-3 h-fit border-b border-zinc-300 pb-5 md:pb-0 md:border-none lg:col-start-1'>
                <span className='rounded-xl flex gap-2 items-center py-1 px-2 bg-zinc-100'><i className='fa-regular fa-square'/><p>Metros cuadrados {property.m2tot}</p></span>
                <span className='rounded-xl flex gap-2 items-center py-1 px-2 bg-zinc-100'><i className='fa-solid fa-door-open'/><p>Ambientes {property.ambiente}</p></span>
                <span className='rounded-xl flex gap-2 items-center py-1 px-2 bg-zinc-100'><i className='fa-solid fa-bath'/><p>Baños {property.bathroom}</p></span>
                <span className='rounded-xl flex gap-2 items-center py-1 px-2 bg-zinc-100'><i className='fa-solid fa-bed'/><p>Dormitorios {property.bedroom}</p></span>
                <span className='rounded-xl flex gap-2 items-center py-1 px-2 bg-zinc-100'><i className='fa-solid fa-car'/><p>Espacio para vehiculos {property.cars}</p></span>
                {property.kitchen === 1 && (
                  <span className='rounded-xl flex gap-2 items-center py-1 px-2 bg-zinc-100'><i className='fa-solid fa-utensils'/><p>Cocina</p></span>
                )}
                {property.pool === 1 && (
                  <span className='rounded-xl flex gap-2 items-center py-1 px-2 bg-zinc-100'><i className='fa-solid fa-swimming-pool'/><p>Piscina</p></span>
                )}
                {property.balcony === 1 && (
                  <span className='rounded-xl flex gap-2 items-center py-1 px-2 bg-zinc-100'><i className='fa-solid fa-umbrella-beach'/><p>Balcón</p></span>
                )}
                {property.grill === 1 && (
                  <span className='rounded-xl flex gap-2 items-center py-1 px-2 bg-zinc-100'><i className='fa-solid fa-fire'/><p>Parrilla</p></span>
                )}
                {property.laundry === 1 && (
                  <span className='rounded-xl flex gap-2 items-center py-1 px-2 bg-zinc-100'><i className='fa-solid fa-tshirt'/><p>Lavadero</p></span>
                )}
                {property.vigilance === 1 && (
                  <span className='rounded-xl flex gap-2 items-center py-1 px-2 bg-zinc-100'><i className='fa-solid fa-eye'/><p>Vigilancia</p></span>
                )}
              </div>
              <div className='flex flex-col gap-2 h-fit lg:row-span-2 lg:col-start-2 lg:row-start-2 md:bg-white md:p-3 md:border-1 md:border-zinc-300 md:shadow-xl md:rounded-xl lg:mx-[3vw] xl:mx-[5vw] 2xl:mx-[7vw]'>
                <p className='text-xl lg:pb-2 lg:border-b lg:border-zinc-300 lg:text-center'>Contactar al anunciante</p>
                <p className='font-bold text-xl'>{property.personalName}</p>
                <div className='flex gap-2 items-center'><i className='fa-solid fa-envelope'/><p className='font-inter'>{property.email}</p></div>
                <div className='flex gap-2 items-center'><i className='fa-solid fa-phone'/><p className='font-inter'>{property.phonePersonal}</p></div>
                <div className='flex flex-col gap-2'>
                  <p>¿Quieres dejarle un mensaje?</p>
                  <div className='flex flex-col mt-2 border-1 border-zinc-300 rounded-xl'>
                    <textarea maxLength={100} placeholder='Hasta 100 caracteres' 
                      className='p-2 h-10 w-full outline-none bg-zinc-100 text-sm rounded-t-xl resize-none' />
                    <div className='flex text-sm'>
                      <span className='flex gap-2 items-center rounded-bl-xl justify-center w-1/2 cursor-pointer bg-zinc-200 p-2'><i className='fa-solid fa-envelope'/><p>Email</p></span>
                      <span className='flex gap-2 items-center rounded-br-xl justify-center w-1/2 cursor-pointer bg-white p-2'><i className='fa-brands fa-whatsapp'/><p>WhatsApp</p></span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          </AnimatePresence>
        </div>

      </div>

      {/* CAROUSEL OPEN */}
      <AnimatePresence>
      {imagesOpen && (
        <>
          <motion.div className='fixed h-screen backdrop-opacity-0 px-3 md:px-10 lg:px-20 xl:px-40 2xl:px-60 top-0 pt-[25vh] sm:pt-[15vh] md:pt-[10vh] z-20'
                        onClick={() => setImagesOpen(false)}
                        initial={{clipPath:"circle(0 at 50% 50%)"}}
                        animate={{clipPath:"circle(100% at 50% 50%)", transition:{duration:1}}}
                           exit={{clipPath:"circle(0 at 50% 50%)", transition:{duration:0.25}}}>
            <div className='h-[50vh] sm:h-[70vh] md:h-[80vh] gap-2 2xl:gap-3 flex flex-col'
                   onClick={(e) => e.stopPropagation()}>
              <div className="h-3/4 carousel w-full mx-auto rounded-xl">
                {images.slice(0, 4).map((img, index) => {
                  return (
                    <div key={index} id={`carousel2-slide${index}`} className="carousel-item relative w-full">
                      <img src={`https://keytodreambuildbackend-production.up.railway.app${img}`} className="w-full object-cover h-full" />
                    </div>
                  )
                })}
              </div>
              <div className='flex h-1/4 w-full overflow-hidden gap-2 2xl:gap-3'>
                {images.slice(0, 4).map((img, index) => (
                  <div key={index} className="relative w-full h-full">
                    <img src={`https://keytodreambuildbackend-production.up.railway.app${img}`} onClick={() => {document.getElementById(`carousel2-slide${index}`)?.scrollIntoView({
                      behavior: 'smooth', block: 'nearest', inline: 'center',})}} className='w-full h-full object-cover cursor-pointer hover:brightness-90 transition rounded-xl'/>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
      </AnimatePresence>
    </>
  )
}

export default Article