import { createContext, useContext, useState, useEffect } from "react"
import { toast } from 'react-toastify'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user,       setUser      ] = useState(null)
  const [token,      setToken     ] = useState(null)

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token")
    if (!storedToken) return
    setToken(storedToken)
    const fetchUser = async () => {
      try {
        const res = await fetch("https://keytodreambuildbackend-production.up.railway.app/api/users/me", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        })
        if (!res.ok) throw new Error("Token inválido o expirado")
        const data = await res.json()
        setIsLoggedIn(true)
        setUser(data)
      } catch (error) {
        console.error("Error al obtener usuario:", error.message)
        setIsLoggedIn(false)
        setUser(null)
        setToken(null)
        localStorage.removeItem("token")
        sessionStorage.removeItem("token")
      }
    }
    fetchUser()
  }, [])

  const login = (newToken, userData, rememberMe) => {
    const storage = rememberMe ? localStorage : sessionStorage
    storage.setItem("token", newToken)
    setToken(newToken)
    setIsLoggedIn(true)
    setUser(userData)
  }

  const logout = () => {
    if (user?.name) {
      toast.success(`Hasta pronto, ${user.name}`)
    }
    localStorage.removeItem("token")
    sessionStorage.removeItem("token")
    setIsLoggedIn(false)
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user, token, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}
export const useAuth = () => useContext(AuthContext)
