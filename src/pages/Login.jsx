import { Link, useNavigate } from "react-router-dom"
import { useState, useContext } from "react"
import { toast } from 'react-toastify'

import { AuthContext } from "../components/AuthToken"

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (response.ok) {
        const token = data.token;
        const storage = remember ? localStorage : sessionStorage
        storage.setItem("token", token);
        const userRes = await fetch('http://localhost:5000/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const userData = await userRes.json()
        if (userRes.ok) {
          login(token, userData, remember)
          const previousPage = sessionStorage.getItem('previousPage') || '/'
          navigate(previousPage)
          toast.success(`Hola, ${userData.name}.`)
        } else {
          toast.error('Error al obtener los datos del usuario.')
        }
      } else {
        toast.error(data.error || 'Error al iniciar sesión.')
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      toast.error('Error al conectar con el servidor.')
    }
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="my-5 flex flex-col gap-5 px-5 md:px-10 lg:px-[25vw]">
      <p className="text-xl">Ingresá a tu cuenta y accedé a tu historial, favoritos y mucho más</p>
      <div className="w-full flex flex-col gap-2">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" placeholder="example@gmail.com" className="outline-none border-b-1 border-zinc-300" 
            value={email} onChange={(e) => setEmail(e.target.value)}/>
      </div>
      <div className="w-full flex flex-col gap-2">
        <label htmlFor="password">Contraseña</label>
        <input id="password" type="password" placeholder="Contraseña" className="outline-none border-b-1 border-zinc-300" 
            value={password} onChange={(e) => setPassword(e.target.value)}/>
      </div>
      <div className="flex gap-2 items-start">
        <input id="remember" type="checkbox" className="checkbox bg-zinc-200 rounded-lg" checked={remember} onChange={(e) => setRemember(e.target.checked)}/>
        <label htmlFor="remember">Recordarme</label>
      </div>
      <div className="w-full flex justify-center">
        <button type="submit" className="mt-10 bg-black py-1 px-2 text-white w-5/10 shadow-xl cursor-pointer active:translate-y-1 duration-100 rounded-xl">
          Ingresar
        </button>
      </div>
      <div className="mt-10 flex flex-col items-center gap-5">
        <p>También puedes ingresar con</p>
        <div className="text-2xl flex gap-10">
          <i className="fa-brands fa-google" />
          <i className="fa-brands fa-facebook" />
          <i className="fa-brands fa-apple" />
        </div>
        <p>¿No tienes una cuenta?</p>
        <Link to="/register" className="bg-zinc-100 py-1 px-2  border-1 border-zinc-200 rounded-xl">Registrarse</Link>
      </div>
    </form>
    </>
  )
}

export default Login;
