import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from 'motion/react'
import { ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Header   from "./layout/Header.jsx"
import Hero     from "./layout/Hero.jsx"
import Main     from "./layout/Main.jsx"
import Footer   from "./layout/Footer.jsx"
import Alquilar from "./pages/Alquilar.jsx"
import Comprar  from "./pages/Comprar.jsx"
import Article  from "./pages/Article.jsx"
import Register from "./pages/Register.jsx"
import Login    from "./pages/Login.jsx"
import Map      from "./pages/Map.jsx"
import Admin    from "./pages/Admin.jsx"
import Post     from "./pages/Post.jsx"
import Terms    from "./pages/Terms.jsx"

import {AuthProvider} from "./components/AuthToken.jsx"
import ParallaxBackground from "./components/ParallaxBackground.jsx"

const pageTransition = {
     initial:{clipPath:'circle(0 at 50% 50%)'   },
     animate:{clipPath:'circle(100% at 50% 50%)', transition:{duration:1}},
        exit:{clipPath:'circle(0 at 50% 50%)'   },
}

const AnimatedRoutes = () => {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        <Route path="/" element={
          <motion.div initial={{opacity:0 }} 
                      animate={{opacity:1 }}
                   transition={{duration:1}}>
            <Hero />
            <Main />
            <Footer />
          </motion.div>
        }/>

        <Route path="/alquilar" element={
          <motion.div {...pageTransition}>
            <Alquilar />
          </motion.div>
        }/>

        <Route path="/comprar" element={
          <motion.div {...pageTransition}>
            <Comprar />
          </motion.div>
        }/>

        <Route path="/article/:id" element={
          <motion.div {...pageTransition}>
            <Article />
          </motion.div>
        }/>

        <Route path="/register" element={
          <motion.div {...pageTransition}>
            <Register />
          </motion.div>
        }/>

        <Route path="/login" element={
          <motion.div {...pageTransition}>
            <Login />
          </motion.div>
        }/>

        <Route path="/map" element={
          <motion.div {...pageTransition}>
            <Map />
          </motion.div>
        }/>

        <Route path="/admin" element={
          <motion.div {...pageTransition}>
            <Admin />
          </motion.div>
        }/>

        <Route path="/post" element={
          <motion.div {...pageTransition}>
            <Post />
          </motion.div>
        }/>

        <Route path="/terms" element={
          <motion.div {...pageTransition}>
            <Terms />
          </motion.div>
        }/>

      </Routes>
    </AnimatePresence>
  )
}

const App = () => {
  return(
    <AuthProvider>
      <ToastContainer toastClassName="custom-toast" position="bottom-right" closeButton={false} hideProgressBar autoClose={2000} transition={Zoom} pauseOnHover={false}/>
      <BrowserRouter>
        <Header />
        <ParallaxBackground />
        <div className="fixed inset-0 bg-gradient-to-b from-transparent from-30% to-white -z-10"></div>
        <AnimatedRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
export default App