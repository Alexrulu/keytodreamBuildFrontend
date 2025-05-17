import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../components/AuthToken.jsx'

const Admin = () => {

  //FRONTEND
  const [usuarios, setUsuarios] = useState(true)
  const [propiedades, setPropiedades] = useState(false)

  //API
  const {token} = useAuth()
  const [users, setUsers] = useState([])
  const [properties, setProperties] = useState([])
  const [searchEmail, setSearchEmail] = useState('')
  const [searchAddress, setSearchAddress] = useState('')

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchEmail.toLowerCase())
  )
  const filteredProperties = properties.filter(property =>
  property.adress.toLowerCase().includes(searchAddress.toLowerCase())
  )

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/users`)
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error al cargar los usuarios:', error))
  }, [])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/properties`)
      .then(response => response.json())
      .then(data => setProperties(data))
      .catch(error => console.error('Error al cargar las propiedades:', error))
  }, [])

  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message)
      toast.info('Usuario eliminado correctamente')
      setUsers(prev => prev.filter(property => property.id !== id));
    } catch (err) {
      console.error('Error al eliminar el usuario:', err)
      toast.error('Error al eliminar el usuario')
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/properties/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message)
      toast.info('Propiedad eliminada correctamente')
      setProperties(prev => prev.filter(property => property.id !== id))
    } catch (err) {
      console.error('Error al eliminar la propiedad:', err)
      toast.error('Error al eliminar la propiedad')
    }
  }

  return (
    <div className='px-3 py-1 flex flex-col gap-2 md:px-10 lg:px-20'>
      <div className='flex w-full gap-5'>
        <button className='w-1/2' onClick={() => {setUsuarios(true); setPropiedades(false)}}><p className='bg-zinc-100 w-30 rounded-xl py-0.5 cursor-pointer hover:bg-zinc-200 duration-200'>Usuarios</p></button>
        <button className='w-1/2' onClick={() => {setUsuarios(false); setPropiedades(true)}}><p className='bg-zinc-100 w-30 rounded-xl py-0.5 cursor-pointer hover:bg-zinc-200 duration-200'>Propiedades</p></button>
      </div>
      <span className='h-[1px] w-full bg-zinc-300 md:hidden'/>
      
      <AnimatePresence mode='wait'>
      {usuarios ? (
        <motion.div initial={{opacity:0 }} animate={{opacity:1}} exit={{opacity:0}} key="usuarios" className='md:grid md:grid-cols-2 md:rows-2 xl:grid-cols-3 md:gap-4'>
          <input type="text" placeholder='Buscar por correo...' className='w-full px-3 py-1 bg-zinc-100 rounded-xl outline-none md:row-start-1 md:col-span-2 md:w-[49%] xl:col-span-3'
                 value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)}/>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <div key={user.id} className="relative flex flex-col gap-2 py-3 border-b-[1px] bg-white border-zinc-300 md:border-zinc-200 md:border md:rounded-xl md:p-2 md:shadow-xl">
                <div className="flex gap-2">
                  <p className="w-1/4">Nombre</p>
                  <p className="bg-zinc-100 font-inter rounded-xl px-2">{user.name}</p>
                </div>
                <div className="flex gap-2">
                  <p className="w-1/4">Email</p>
                  <p className="bg-zinc-100 font-inter rounded-xl px-2">{user.email}</p>
                </div>
                <div className="flex gap-2">
                  <p className="w-1/4">Telefono</p>
                  <p className="bg-zinc-100 font-inter rounded-xl px-2">{user.phone}</p>
                </div>
                <div className="flex gap-2">
                  <p className="w-1/4">DNI</p>
                  <p className="bg-zinc-100 font-inter rounded-xl px-2">{user.dni}</p>
                </div>
                {user.userType !== 10 && (
                  <button
                    className="fa-solid fa-trash cursor-pointer text-white bg-red-900 w-10 text-center h-10 absolute top-2 right-2 rounded-xl"
                    onClick={() => handleDeleteUser(user.id)}
                  />
                )}
              </div>
            ))
          ) : (
            <p className='mt-2'>No hay usuarios disponibles.</p>
          )}
        </motion.div>
      ) : (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} key="propiedades" className='md:grid md:grid-cols-2 md:rows-2 xl:grid-cols-3 md:gap-4'>
          <input type="text" placeholder='Buscar por dirección...' className='w-full px-3 py-1 bg-zinc-100 rounded-xl outline-none md:row-start-1 md:col-span-2 md:w-[49%] md:ml-auto xl:col-span-3'
                 value={searchAddress} onChange={(e) => setSearchAddress(e.target.value)}/>
          {filteredProperties.length > 0 ? (
          filteredProperties.map(property => (
            <div key={property.id} className='relative flex flex-col gap-2 py-3 bg-white border-b-[1px] border-zinc-300 md:p-3 md:rounded-xl md:border-1 md:shadow-xl md:border-zinc-200'>
              <div className='flex gap-2'>
                <p className='w-1/4'>Tipo</p>
                <p className='bg-zinc-100 font-inter rounded-xl px-2'>{property.type === 1 ? 'Venta' : 'Alquiler'}</p>
              </div>
              <div className='flex gap-2'>
                <p className='w-1/4'>Precio</p>
                <p className='bg-zinc-100 font-inter rounded-xl px-2'>${property.price}</p>
              </div>
              <div className='flex gap-2'>
                <p className='w-1/4'>Dirección</p>
                <p className='bg-zinc-100 font-inter rounded-xl truncate px-2'>{property.adress}</p>
              </div>
              <div className='flex gap-2'>
                <p className='w-1/4'>Ciudad</p>
                <p className='bg-zinc-100 font-inter rounded-xl truncate px-2'>{property.city}</p>
              </div>
              <div className='flex gap-2'>
                <p className='w-1/4'>Descripción</p>
                <p className='w-3/4 bg-zinc-100 font-inter rounded-xl px-2 h-19 overflow-y-auto'>{property.description}</p>
              </div>
              <Link to={`/article/${property.id}`}>
              <img className='w-3/4 h-40 object-cover rounded-xl ml-auto' src={`${import.meta.env.VITE_API_URL}${property.principalImage}`} />
              </Link>

              <button className='fa-solid fa-trash text-white bg-red-900 cursor-pointer w-10 text-center h-10 absolute top-2 right-2 rounded-xl'
                        onClick={() => handleDelete(property.id)}/>
            </div>
          ))
        ) : (
          <p className='mt-2'>No hay propiedades disponibles.</p>
        )}
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  )
}

export default Admin
