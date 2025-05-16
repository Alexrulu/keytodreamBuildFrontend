import { motion } from 'motion/react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return(
    <>
      <motion.footer className="w-full flex flex-col justify-center text-sm gap-2 text-center pb-2 mt-[15vh]"
                       initial={{x:-100    }}
                   whileInView={{x:0       }}
                      viewport={{once: true}}
                    transition={{duration:2}}>
        <span className=" h-[1px] w-8/10 bg-zinc-300"/>
        <a href="https://alexandrolucero.vercel.app/" target="_blank">Lucero Alexandro</a>
        <Link to="/terms">Terminos y condiciones</Link>
      </motion.footer>
    </>
  )
}

export default Footer
