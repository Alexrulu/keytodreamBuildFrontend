import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../components/AuthToken.jsx'

const Header = () => {

  //FRONTEND
  const [barsOpen,    setBarsOpen   ] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [scrolled,    setScrolled   ] = useState(false)
  const [spOpen,      setSpOpen     ] = useState(false) // Saved Properties
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll);
  }, [])
  const navigate = useNavigate()
  const handleLoginClick = () => {
    sessionStorage.setItem('previousPage', window.location.pathname)
    navigate('/login')
  }

  //API
  const {isLoggedIn, logout, user, token, setUser, id} = useAuth()
  const [savedProperties, setSavedProperties] = useState([])
  const [update, setUpdate] = useState(false)
  const [tempUser, setTempUser] = useState(user)
  const [userProperties, setUserProperties] = useState([])

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch('https://keytodreambuildbackend-production.up.railway.app/api/properties')
        const allProperties = await res.json()
        const favorites = user?.favoritos?.length
          ? allProperties.filter((prop) => user.favoritos.includes(prop.id))
          : []
        setSavedProperties(favorites)
      } catch (error) {
        console.error("Error al traer propiedades favoritas", error)
      }
    }
    fetchFavorites()
  }, [user?.favoritos?.length])

  useEffect(() => {
  const fetchUserProperties = async () => {
    if (!user || !token) return
      try {
        const res = await fetch(`https://keytodreambuildbackend-production.up.railway.app/api/properties/owner/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message)
        setUserProperties(data)
      } catch (err) {
        console.error('Error al obtener propiedades del usuario:', err)
      }
    }
  fetchUserProperties()
  }, [user, token])

  const handleUpdate = async (updatedUser) => {
    try {  
      const response = await fetch(`https://keytodreambuildbackend-production.up.railway.app/api/users/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: updatedUser.name,
          phone: updatedUser.phone,
          dni: updatedUser.dni
        })
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message)
      toast.success('Usuario actualizado correctamente')
      setUser(updatedUser)
    } catch (err) {
      console.error('Error al actualizar el usuario:', err)
      toast.error('Error al actualizar el usuario')
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://keytodreambuildbackend-production.up.railway.app/api/users/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message)
      toast.info('Usuario eliminado correctamente')
      window.location.href = '/'
    } catch (err) {
      console.error('Error al eliminar el usuario:', err)
      toast.error('Error al eliminar el usuario')
    }
  }

  return (
    <>
    <div className='h-12'/>

    {/* MOBILE HEADER */}
    <header className={`fixed top-0 w-full flex justify-between items-center p-3 z-100 duration-300 md:px-10 lg:hidden
                     ${scrolled ? 'bg-white' : 'bg-transparent'}
                     ${scrolled && !barsOpen ? 'border-b border-zinc-200' : 'border-transparent'}`}>
      <Link to="/" className='text-lg font-bold'>KEY TO DREAM</Link>
      <button onClick={() => setBarsOpen(!barsOpen)} className='fa-solid fa-bars'/>
    </header>

    {/* MOBILE MENU */}
    <AnimatePresence initial={false}>
      {barsOpen && (
        <motion.div className='origin-top-right fixed flex flex-col top-0 p-5 pt-14 left-0 w-full z-20 bg-white shadow-xl border-b border-zinc-300 md:px-10'
                      initial={{scaleY:0,scaleX:0, clipPath:'circle(0%   at 100% 0%)'}}
                      animate={{scaleY:1,scaleX:1, clipPath:'circle(150% at 100% 0%)'}}
                         exit={{scaleY:0,scaleX:0, clipPath:'circle(0%   at 100% 0%)'}}
                   transition={{duration:0.5}}>

          {isLoggedIn ? (
            <>
              <button className='border-zinc-200 border-1 py-1 bg-zinc-100 rounded-xl text-center' onClick={logout}>Cerrar Sesion</button>

              {user.userType === 10 ? (
                <>
                  <Link to="/admin" className='mt-3 border-zinc-900 border-1 py-1 bg-black rounded-xl text-white text-center mb-2'>Admin</Link>
                </>
              ) : (
                <>
                  <Link to="/post" className='mt-3 border-zinc-900 border-1 py-1 bg-black rounded-xl text-white text-center mb-2'>Publicar</Link>
                </>
              )}

              {/* contacto */}
              <p onClick={() => {if (accountOpen) setAccountOpen(false); if (spOpen) setSpOpen(false); setContactOpen(!contactOpen)}} className='mt-3'>Contacto</p>
              <AnimatePresence>
                {contactOpen && (
                  <motion.div className='flex flex-col gap-3 overflow-hidden'
                      initial={{height:0     }}
                      animate={{height:'auto'}}
                         exit={{height:0     }}>
                    <span className='mt-3 pt-[1px] bg-zinc-200'/>
                    <div className='flex gap-2'>
                      <div className='flex flex-col gap-2'>
                        <p>Telefono</p>
                        <p>Correo</p>
                      </div>
                      <div className='flex flex-col gap-2'>
                        <p className='italic bg-zinc-100 rounded-xl px-2'>keytodream@realestate.com</p>
                        <p className='italic bg-zinc-100 rounded-xl px-2 w-1/2'>11 2345 6789</p>
                      </div>
                    </div>
                    <p>Atendemos de lunes a viernes de 9:00 a 18:00</p>
                  </motion.div>
                )}
              </AnimatePresence>
              <span className='mt-3 pt-[1px] bg-zinc-200'/>

              {/* mi cuenta */}
              <p onClick={() => {if (contactOpen) setContactOpen(false); if (spOpen) setSpOpen(false); setAccountOpen(!accountOpen)}} className='mt-3'>Mi cuenta</p>
              <AnimatePresence>
                {accountOpen && user && (
                  <motion.div className='flex flex-col relative gap-3 overflow-hidden'
                      initial={{height:0     }}
                      animate={{height:'auto'}}
                         exit={{height:0     }}>
                    <div className='absolute top-1 right-1'>
                      <button onClick={() => {setTempUser(user); setUpdate(true)}} className='absolute z-10 top-5 right-1 bg-blue-900 fa-solid fa-pen text-white h-8 w-8 rounded-xl shadow-xl cursor-pointer ml-auto'/>
                      <AnimatePresence mode="wait">
                      {update && (
                        <motion.div className='top-5 right-1 absolute z-20 flex flex-col gap-2' initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                          <button onClick={() => {setTempUser(user); setUpdate(false)}} className='fa-solid fa-xmark rounded-xl bg-blue-900 text-white h-8 w-8 shadow-xl cursor-pointer'/>
                          <button onClick={() => handleDelete()} className='fa-solid fa-trash rounded-xl bg-red-900 text-white h-8 w-8 shadow-xl cursor-pointer'/>
                          <button onClick={() => {handleUpdate(tempUser); setUpdate(false)}} className='fa-solid fa-check rounded-xl bg-black text-white h-8 w-8 shadow-xl cursor-pointer'/>
                        </motion.div>
                      )}
                      </AnimatePresence>
                    </div>
                    <span className='mt-3 pt-[1px] bg-zinc-200'></span>
                  
                      {update ? (
                        <div className="flex w-full overflow-hidden gap-1.5">
                          <div className='flex flex-col w-1/5 gap-2'>
                            <p>Nombre</p>
                            <p>Correo</p>
                            <p>DNI</p>
                            <p>Telefono</p>
                          </div>
                          <div className='flex flex-col w-4/6 gap-2'>
                            <input className='italic outline-none px-2' onChange={(e) => setTempUser({...tempUser, name: e.target.value })} value={tempUser.name} placeholder='Nombre'/>
                            <p className='italic px-2 bg-zinc-100 rounded-xl mr-auto'>{user.email}</p>
                            <input className='italic outline-none px-2' onChange={(e) => setTempUser({...tempUser, dni: e.target.value })} value={tempUser.dni} type='number' placeholder='DNI'/>
                            <input className='italic outline-none px-2' onChange={(e) => setTempUser({...tempUser, phone: e.target.value})} value={tempUser.phone} type='number' placeholder='Telefono'/>
                          </div>
                        </div>
                      ) : (
                        <div className='flex justify-between w-full gap-1.5'>
                          <div className='flex flex-col gap-2 w-1/5'>
                            <p>Nombre</p>
                            <p>Correo</p>
                            <p>DNI</p>
                            <p>Telefono</p>
                          </div>
                          <div className='flex flex-col gap-2 w-4/6 mr-auto'>
                            <p className='italic px-2'>{user.name}</p>
                            <p className='italic px-2 bg-zinc-100 rounded-xl mr-auto'>{user.email}</p>
                            <p className='italic px-2'>{user.dni}</p>
                            <p className='italic px-2'>{user.phone}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col gap-2 w-full border-t  pt-3 border-zinc-200 overflow-hidden">
                        <p>Mis publicaciones</p>
                        <div className={`flex flex-col gap-1 w-full ${userProperties.length === 0 ? 'h-7 overflow-y-none' : 'h-auto max-h-33 overflow-y-auto'}`}>
                          {userProperties.length === 0 && <p className='italic'>No tienes publicaciones</p>}
                          {userProperties.map((property) => (
                            <Link key={property.id} className="flex gap-1 justify-between items-center w-full hover:bg-zinc-100 duration-200 rounded-xl py-1 px-1.5"
                                   to={`/article/${property.id}`}>
                              <div className="w-8/10">
                                <p className="font-semibold text-sm truncate">{property.adress}</p>
                                <p className="text-xs italic truncate">{property.city}</p>
                                <p className="text-sm truncate">${property.price}</p>
                              </div>
                              <img className="w-2/10 h-full rounded-xl object-cover" src={`https://keytodreambuildbackend-production.up.railway.app${property.principalImage}`} />
                            </Link>
                          ))}
                        </div>
                      </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <span className='mt-3 pt-[1px] bg-zinc-200'></span>
              
              {/* propiedades guardadas */}
              <p onClick={() => {if (contactOpen) setContactOpen(false); if (accountOpen) setAccountOpen(false); setSpOpen(!spOpen)}} className='mt-3'>Propiedades guardadas</p>
              <AnimatePresence>
                {spOpen && (
                  <motion.div className='flex flex-col gap-3 overflow-hidden'
                      initial={{height:0     }}
                      animate={{height:'auto'}}
                         exit={{height:0     }}>
                    <span className='mt-3 pt-[1px] bg-zinc-200'/>
                    <div className={`flex flex-col gap-2 ${savedProperties.length === 0 ? 'h-5' : 'h-auto max-h-[300px] overflow-y-auto'}`}>
                      {savedProperties.length > 0 ? (savedProperties.map((property) => (
                          <Link key={property.id} className='flex gap-1 justify-between items-center w-full hover:bg-zinc-100 rounded-xl py-1 px-1.5'
                                 to={`/article/${property.id}`}>
                            <div className='w-8/10'>
                              <p className='font-semibold text-sm truncate'>{property.adress}</p>
                              <p className='text-xs italic truncate'>{property.city}</p>
                              <p className='text-sm truncate'>${property.price}</p>
                            </div>
                            <img className='w-2/10 h-14 rounded-xl object-cover' src={`https://keytodreambuildbackend-production.up.railway.app${property.principalImage}`}/>
                          </Link>
                        ))
                      ) : (
                        <p className='text-center text-sm text-gray-500 italic'>No tienes propiedades guardadas.</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <>
              <button onClick={handleLoginClick} className='border-zinc-200 border-1 py-1 bg-zinc-100 rounded-xl text-center'>Iniciar Sesion</button>
              <Link to="/register" className='mt-3 border-zinc-900 border-1 py-1 bg-black rounded-xl text-white text-center mb-2'>Registrarse</Link>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>

    {/* DESKTOP HEADER */}
    <header className={`hidden lg:fixed top-0 w-full lg:flex px-20 py-1 items-center z-100 duration-300
                     ${scrolled ? 'bg-white border-b border-zinc-200' : 'border-transparent bg-transparent'}`}>
      <div className='w-1/3'>
        <Link to="/" className='py-1  hover:text-zinc-500 duration-300 font-bold'>KEY TO DREAM</Link>
      </div>

      <div className='flex w-1/3 py-1 relative z-20 justify-center whitespace-nowrap'>
         {isLoggedIn && (
          <>
            <p onClick={() => {if (accountOpen) setAccountOpen(false); if (spOpen) setSpOpen(false); setContactOpen(!contactOpen)}} 
             className='cursor-pointer py-1 px-2 rounded-xl hover:bg-zinc-100 duration-300'>Contacto</p>
            <p onClick={() => {if (contactOpen) setContactOpen(false); if (accountOpen) setAccountOpen(false); setSpOpen(!spOpen)}} 
             className='cursor-pointer py-1 px-2 rounded-xl hover:bg-zinc-100 duration-300'>Propiedades guardadas</p>
            <p onClick={() => {if (contactOpen) setContactOpen(false); if (spOpen) setSpOpen(false); setAccountOpen(!accountOpen)}} 
             className='cursor-pointer py-1 px-2 rounded-xl hover:bg-zinc-100 duration-300'>Mi cuenta</p>
          </>
         )}

        {/* contacto */}
        <AnimatePresence>
          {contactOpen && (
            <motion.div className='origin-top-left absolute top-13 flex-col border border-zinc-200 bg-white w-[380px] p-3 rounded-xl overflow-hidden shadow-xl'
                          initial={{scaleY:0,scaleX:0, clipPath:'circle(0%   at 0% 0%)'}}
                          animate={{scaleY:1,scaleX:1, clipPath:'circle(150% at 0% 0%)'}}
                             exit={{scaleY:0,scaleX:0, clipPath:'circle(0%   at 0% 0%)'}}
                       transition={{duration:0.5}}>
              <div className='flex gap-2'>
                <div className='flex flex-col gap-2'>
                  <p>Telefono</p>
                  <p>Correo</p>
                </div>
                <div className='flex flex-col gap-2'>
                  <p className='italic bg-zinc-100 rounded-xl px-2'>keytodream@realestate.com</p>
                  <p className='italic bg-zinc-100 rounded-xl px-2 w-1/2'>11 2345 6789</p>
                </div>
              </div>
              <p className='mt-2'>Atendemos de lunes a viernes de 9:00 a 18:00</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* propiedades guardadas */}
        <AnimatePresence>
          {spOpen && (
            <motion.div className='origin-top absolute top-13 flex flex-col gap-3 border bg-white border-zinc-200 shadow-xl p-2 overflow-hidden rounded-xl w-[380px]'
                          initial={{scaleY:0,scaleX:0, clipPath:'circle(0%   at 50% 0%)'}}
                          animate={{scaleY:1,scaleX:1, clipPath:'circle(150% at 50% 0%)'}}
                             exit={{scaleY:0,scaleX:0, clipPath:'circle(0%   at 50% 0%)'}}
                       transition={{duration:0.5}}>
              <div className='max-h-[400px] overflow-y-auto flex flex-col gap-2'>
                {savedProperties.length > 0 ? (
                  savedProperties.map((property) => (
                    <Link key={property.id} className='flex gap-1 justify-between items-center w-full hover:bg-zinc-100 rounded-xl py-1 px-1.5'
                           to={`/article/${property.id}`}>
                      <div className='w-8/10'>
                        <p className='font-semibold text-sm truncate'>{property.adress}</p>
                        <p className='text-xs italic truncate'>{property.city}</p>
                        <p className='text-sm truncate'>${property.price}</p>
                      </div>
                      <img className='w-2/10 h-14 rounded-xl object-cover' src={`https://keytodreambuildbackend-production.up.railway.app${property.principalImage}`}/>
                    </Link>
                  ))
                ) : (
                  <p className='text-center text-sm text-gray-500 italic'>No tienes propiedades guardadas.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* mi cuenta */}
        <AnimatePresence>
          {accountOpen && user && (
            <motion.div className='origin-top-right absolute top-13 flex gap-3 border bg-white border-zinc-200 shadow-xl p-3 overflow-hidden rounded-xl w-[380px]'
                          initial={{scaleY:0,scaleX:0, clipPath:'circle(0%   at 100% 0%)'}}
                          animate={{scaleY:1,scaleX:1, clipPath:'circle(150% at 100% 0%)'}}
                             exit={{scaleY:0,scaleX:0, clipPath:'circle(0%   at 100% 0%)'}}
                       transition={{duration:0.5}}>

            <div className='absolute top-1 right-1'>
              <button onClick={() => {setTempUser(user); setUpdate(true)}} className='absolute z-10 top-1 right-1 bg-blue-900 fa-solid fa-pen text-white h-8 w-8 rounded-xl shadow-xl cursor-pointer ml-auto'/>
              <AnimatePresence mode="wait">
              {update && (
                <motion.div className='top-1 right-1 absolute z-20 flex flex-col gap-2' initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                  <button onClick={() => {setTempUser(user); setUpdate(false)}} className='fa-solid fa-xmark rounded-xl bg-blue-900 text-white h-8 w-8 shadow-xl cursor-pointer'/>
                  <button onClick={() => handleDelete()} className='fa-solid fa-trash rounded-xl bg-red-900 text-white h-8 w-8 shadow-xl cursor-pointer'/>
                  <button onClick={() => {handleUpdate(tempUser); setUpdate(false)}} className='fa-solid fa-check rounded-xl bg-black text-white h-8 w-8 shadow-xl cursor-pointer'/>
                </motion.div>
              )}
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              {update ? (
                <div className="flex w-full overflow-hidden gap-1.5 h-30">
                  <div className='flex flex-col w-1/5 gap-2'>
                    <p>Nombre</p>
                    <p>Correo</p>
                    <p>DNI</p>
                    <p>Telefono</p>
                  </div>
                  <div className='flex flex-col w-4/6 gap-2'>
                    <input className='italic outline-none px-2' onChange={(e) => setTempUser({...tempUser, name: e.target.value })} value={tempUser.name} placeholder='Nombre'/>
                    <p className='italic px-2 bg-zinc-100 rounded-xl mr-auto'>{user.email}</p>
                    <input className='italic outline-none px-2' onChange={(e) => setTempUser({...tempUser, dni: e.target.value  })} value={tempUser.dni} type='number' placeholder='DNI'/>
                    <input className='italic outline-none px-2' onChange={(e) => setTempUser({...tempUser, phone: e.target.value})} value={tempUser.phone} type='number' placeholder='Telefono'/>
                  </div>
                </div>
              ) : (
                <motion.div key="view" className="flex flex-col gap-2 w-full overflow-hidden"
                        initial={{height:'120px'}}
                        animate={{height:'auto' }}
                           exit={{height:'120px'}}
                     transition={{duration: 0.5 }}>
            
                  <div className='flex justify-between w-full gap-1.5'>
                    <div className='flex flex-col gap-2 w-1/5'>
                      <p>Nombre</p>
                      <p>Correo</p>
                      <p>DNI</p>
                      <p>Telefono</p>
                    </div>
                    <div className='flex flex-col gap-2 w-4/6 mr-auto'>
                      <p className='italic px-2'>{user.name}</p>
                      <p className='italic px-2 bg-zinc-100 rounded-xl mr-auto'>{user.email}</p>
                      <p className='italic px-2'>{user.dni}</p>
                      <p className='italic px-2'>{user.phone}</p>
                    </div>
                  </div>
                  <span className='h-[1px] bg-zinc-200 w-full mt-1.5' />
                  <motion.div key="publicaciones" className="flex flex-col gap-2 w-full overflow-hidden"
                          initial={{ height:0     }}
                          animate={{ height:'auto'}}
                             exit={{ height:0     }}
                       transition={{ duration:0.5 }}>
                    <p>Mis publicaciones</p>
                    <div className={`flex flex-col gap-1 w-full overflow-y-auto ${userProperties.length === 0 ? 'h-7' : 'h-auto max-h-33'}`}>
                      {userProperties.length === 0 && <p className='italic'>No tienes publicaciones</p>}
                      {userProperties.map((property) => (
                        <Link key={property.id}
                          className="flex gap-1 justify-between items-center w-full hover:bg-zinc-100 duration-200 rounded-xl py-1 px-1.5"
                          to={`/article/${property.id}`}>
                          <div className="w-8/10">
                            <p className="font-semibold text-sm truncate">{property.adress}</p>
                            <p className="text-xs italic truncate">{property.city}</p>
                            <p className="text-sm truncate">${property.price}</p>
                          </div>
                          <img className="w-2/10 h-full rounded-xl object-cover" src={`https://keytodreambuildbackend-production.up.railway.app${property.principalImage}`} />
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                  
                </motion.div>
              )}
            </AnimatePresence>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isLoggedIn ? (
        <>
          <div className='flex gap-3 ml-auto w-1/3 justify-end relative z-10'>
            <button className=' py-1 px-2 text-center hover:bg-zinc-100 duration-300 cursor-pointer rounded-xl' onClick={logout}>Cerrar Sesión</button>
            {user.userType === 10 ? (
              <>
                <Link to="/admin" className='bg-black text-white py-1 px-2 text-center hover:bg-black/80 duration-300 shadow-xl rounded-xl'>Admin</Link>
              </>
            ) : (
              <>
                <Link to="/post" className='bg-black text-white py-1 px-2 text-center hover:bg-black/80 duration-300 shadow-xl rounded-xl'>Publicar</Link>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div className='flex gap-3 ml-auto w-1/3 justify-end'>
            <button onClick={handleLoginClick} className=' py-1 px-2 text-center  hover:bg-zinc-100 duration-300 rounded-xl cursor-pointer'>Iniciar Sesion</button>
            <Link to="/register" className='bg-black text-white py-1 px-2 text-center  hover:bg-black/80 duration-300 shadow-xl rounded-xl'>Registrarse</Link>
          </div>
        </>
      )}
    </header>
    </>
  )
}

export default Header