import { useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const [formData, setFormData] = useState({
    userType: '',
    email: '',
    password: '',
    name: '',
    dni: '',
    phone: '',
    cellphone: '',
    terms: false,
    privacyPolicy: false
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.terms || !formData.privacyPolicy) {
      toast.error('Debe aceptar los términos y políticas.')
      return
    }
    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (response.ok) {
        toast.success('Registro exitoso.')
        navigate('/login')
      } else {
        toast.error(data.error || 'Error en el registro.')
      }
    } catch (error) {
      console.error('Error al enviar registro:', error)
      toast.error('Error al conectar con el servidor.')
    }
  }

  return (
    <div className="my-5 flex flex-col gap-5 px-5 md:px-10 lg:px-[25vw]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <p className="text-xl">Información para crear tu cuenta</p>
        <p>Tipo de usuario</p>
        <div className="flex justify-around text-black border-1 border-zinc-300 rounded-xl py-1 px-2">
          <button type="button" onClick={() => setFormData(prev => ({ ...prev, userType: 1 }))}
             className={`px-4 py-1 rounded-xl duration-300 cursor-pointer ${formData.userType === 1 ? 'bg-black shadow-xl text-white' : 'bg-white'}`}>
            Particular
          </button>
          <button type="button" onClick={() => setFormData(prev => ({ ...prev, userType: 2 }))}
             className={`px-4 py-1 rounded-xl duration-300 cursor-pointer ${formData.userType === 2 ? 'bg-black shadow-xl text-white' : 'bg-white'}`}>
            Inmobiliaria
          </button>
        </div>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange}
          className="outline-none border-b-1 border-zinc-300" required/>
        <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange}
          className="outline-none border-b-1 border-zinc-300" required/>
        <p>Datos</p>
        <input type="text" name="name" placeholder="Nombre completo" value={formData.name} onChange={handleChange}
          className="outline-none border-b-1 border-zinc-300" required/>
        <input type="text" name="dni" placeholder="DNI" value={formData.dni} onChange={handleChange}
          className="outline-none border-b-1 border-zinc-300" required/>
        <input type="text" name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange}
          className="outline-none border-b-1 border-zinc-300"/>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-start">
            <input id="terms" name="terms" type="checkbox" checked={formData.terms} onChange={handleChange}
            className="checkbox bg-zinc-200 rounded-lg"/>
            <label htmlFor="terms">Acepto los términos y condiciones de uso</label>
          </div>
          <div className="flex gap-2 items-start">
            <input id="privacyPolicy" name="privacyPolicy" type="checkbox" checked={formData.privacyPolicy} onChange={handleChange}
            className="checkbox bg-zinc-200 rounded-lg"/>
            <label htmlFor="privacyPolicy">Acepto las políticas de privacidad</label>
          </div>
          <div className="w-full flex justify-center">
            <button type="submit" className="mt-10 bg-black text-white py-1 px-2 rounded-xl shadow-xl w-5/10 cursor-pointer">Registrarme</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Register
