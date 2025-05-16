import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useAuth } from '../components/AuthToken.jsx'

const Post = () => {
  //Frontend
  const [post1, setPost1] = useState(true)
  const [post2, setPost2] = useState(false)
  const [post3, setPost3] = useState(false)
  const [post4, setPost4] = useState(false)
  const [direction, setDirection] = useState(0)

  const [step2active, setStep2active] = useState(false)
  const [step3active, setStep3active] = useState(false)
  const [step4active, setStep4active] = useState(false)

  const [onAmbientes,   setOnAmbientes  ] = useState(false)
  const [onBaños,       setOnBaños      ] = useState(false)
  const [onCoches,      setOnCoches     ] = useState(false)
  const [onDormitorios, setOnDormitorios] = useState(false)

  const [showInfo, setShowInfo] = useState(false)
  const handleInfoClick = () => {
    setShowInfo(true)
    setTimeout(() => setShowInfo(false), 2000)
  }

  //API
  const {user, token} = useAuth();
  const [type,      setType     ] = useState(null) //1:venta, 2:alquiler
  const [model,     setModel    ] = useState(null) //1:casa, 2:departamento, 3:ph, 4:condominio
  const [adress,    setAdress   ] = useState('')
  const [city,      setCity     ] = useState('')
  const [m2tot,     setM2tot    ] = useState('')
  const [kitchen,   setKitchen  ] = useState(0)
  const [pool,      setPool     ] = useState(0)
  const [balcony,   setBalcony  ] = useState(0)
  const [grill,     setGrill    ] = useState(0)
  const [laundry,   setLaundry  ] = useState(0)
  const [vigilance, setVigilance] = useState(0)
  const [ambiente,  setAmbientes] = useState(null)
  const [bathroom,  setBathrooms] = useState(null)
  const [cars,      setCars     ] = useState(null)
  const [bedroom,   setBedrooms ] = useState(null)
  const [principalImage, setPrincipalImage] = useState(null)
  const [secondaryImages, setSecondaryImages] = useState([])
  const [personalName, setPersonalName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState({}) //almacenar campos incompletos
  const navigate = useNavigate()


  const handleTypeChange = (newType) => {
    setType(newType)
  }
  const handleModelChange = (newModel) => {
    setModel(newModel)
  }
  const handleSelection = (field, value) => {
    if (field === 'ambiente') setAmbientes(value)
    if (field === 'bathroom') setBathrooms(value)
    if (field === 'cars') setCars(value)
    if (field === 'bedroom') setBedrooms(value)
  }
  const handlePrincipalImageChange = (e) => {
    const file = e.target.files[0]
    if (file) setPrincipalImage(file)
  }
  const handleSecondaryImagesChange = (e) => {
    const files = Array.from(e.target.files)
    setSecondaryImages(files)
  }

  const validateForm = () => {
    const errors = {}
    if (type === null || model === null) errors.typeModel = "Por favor, selecciona tipo y modelo."
    if (adress.trim() === '') errors.adress = "La dirección es obligatoria."
    if (city.trim() === '') errors.city = "La ciudad es obligatoria."
    if (m2tot === '' || isNaN(m2tot)) errors.m2tot = "Los metros cuadrados deben ser un número válido."
    if (ambiente === null) errors.ambiente = "El número de ambientes es obligatorio."
    if (bathroom === null) errors.bathroom = "El número de baños es obligatorio."
    if (cars === null) errors.cars = "El número de autos es obligatorio."
    if (bedroom === null) errors.bedroom = "El número de dormitorios es obligatorio."
    if (!principalImage) errors.principalImage = "La imagen principal es obligatoria."
    if (secondaryImages.length !== 3) errors.secondaryImages = "Debes subir exactamente 3 imágenes secundarias."
    if (personalName.trim() === '') errors.personalName = "El nombre de contacto es obligatorio."
    if (price === '' || isNaN(price)) errors.price = "El precio debe ser un número válido."
    if (description.trim().length < 100) errors.description = "La descripción debe tener al menos 100 caracteres."
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }
    const formData = new FormData()
    formData.append('type', Number(type))
    formData.append('model', Number(model))
    formData.append('adress', adress)
    formData.append('city', city)
    formData.append('m2tot', Number(m2tot))
    formData.append('kitchen', Number(kitchen))
    formData.append('pool', Number(pool))
    formData.append('balcony', Number(balcony))
    formData.append('grill', Number(grill))
    formData.append('laundry', Number(laundry))
    formData.append('vigilance', Number(vigilance))
    formData.append('ambiente', Number(ambiente))
    formData.append('bathroom', Number(bathroom))
    formData.append('cars', Number(cars))
    formData.append('bedroom', Number(bedroom))
    formData.append('personalName', personalName)
    formData.append('price', Number(price))
    formData.append('description', description)
    formData.append('principalImage', principalImage)
    secondaryImages.forEach((file) => {
      formData.append('secondaryImages', file)
    })
    try {
      const response = await fetch('https://keytodreambuildbackend-production.up.railway.app/api/properties/posting', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      })
      if (response.ok) {
        const property = await response.json()
        toast.success("Propiedad publicada!")
        navigate(`/article/${property.id}`)
      } else {
        const error = await response.json()
        console.error(error)
        toast.error("Error al publicar la propiedad.")
      }
    } catch (err) {
      console.error(err)
      toast.error("Fallo en la comunicación con el servidor.")
    }
  }

  return (
    <>
    <form onSubmit={handleSubmit} className='overflow-x-clip'>
      {/*Progreso*/}
      <motion.div className='flex p-3 justify-between items-center md:px-10'>
        {/* 1 */}
        <div className='flex flex-col justify-center items-center gap-2 w-1/7'>
          <p className='flex bg-black w-10 h-10 text-white justify-center items-center rounded-xl'>1</p>
          <p className='text-sm'>Datos</p>
        </div>
        <motion.span className='h-[1px] bg-black w-1/7 translate-y-[-14px]'
                       initial={{clipPath:'inset(0 100% 0 0)'                          }}
                       animate={post2 || post3 || post4 ? {clipPath:'inset(0 0 0 0)'}:{}}
                    transition={{duration:0.5, ease:'easeInOut'                        }}
           onAnimationComplete={() => setStep2active(!step2active)                      }/>
        {/* 2 */}
        <motion.div className='flex flex-col justify-center items-center gap-2 w-1/7'
                      animate={step2active ? {scale:[1, 1.1, 1]}:{}}
                   transition={{duration:0.5                        }}>
          <p className={`flex w-10 h-10 text-white justify-center items-center duration-300 rounded-xl ${step2active ? 'bg-black' : 'bg-zinc-500'}`}>2</p>
          <p className={`text-sm duration-300 ${step2active ? 'text-black' : 'text-zinc-500'}`}>Imagen</p>
        </motion.div>
        <motion.span className='h-[1px] bg-black w-1/7 translate-y-[-14px]'
                       initial={{clipPath:'inset(0 100% 0 0)'                 }}
                       animate={post3 || post4 ? {clipPath:'inset(0 0 0 0)'}:{}}
                    transition={{duration:0.5, ease:'easeInOut'               }}
           onAnimationComplete={() => setStep3active(!step3active)             }/>
        {/* 3 */}
        <motion.div className='flex flex-col justify-center items-center gap-2 w-1/7'
                      animate={step3active ? {scale:[1, 1.1, 1]}:{}}
                   transition={{duration:0.5                      }}>
          <p className={`flex w-10 h-10 text-white justify-center items-center duration-300 rounded-xl ${step3active ? 'bg-black' : 'bg-zinc-500'}`}>3</p>
          <p className={`text-sm duration-300 ${step3active ? 'text-black' : 'text-zinc-500'}`}>Contacto</p>
        </motion.div>
        <motion.span className='h-[1px] bg-black w-1/7 translate-y-[-14px]'
                       initial={{clipPath:'inset(0 100% 0 0)'        }}
                       animate={post4 ? {clipPath:'inset(0 0 0 0)'}:{}}
                    transition={{duration:0.5, ease:'easeInOut'      }}
           onAnimationComplete={() => setStep4active(!step4active)    }/>
        {/* 4 */}
        <motion.div className='flex flex-col justify-center items-center gap-2 w-1/7'
                      animate={step4active ? {scale:[1, 1.1, 1]}:{}}
                   transition={{duration:0.5                      }}>
          <p className={`flex w-10 h-10 text-white justify-center items-center duration-300 rounded-xl ${step4active ? 'bg-black' : 'bg-zinc-500'}`}>4</p>
          <p className={`text-sm duration-300 ${step4active ? 'text-black' : 'text-zinc-500'}`}>Precio</p>
        </motion.div>
      </motion.div>

      {/*Post 1 (DATOS)*/}
      {post1 && (
        <motion.div className={`p-3 flex flex-col gap-5 md:px-10 md:w-4/5 lg:px-20 xl:w-4/6 2xl:w-4/7`}
        initial={{x: direction === 1 ? -100 : 100, opacity:0}}
        animate={{x:0   , opacity:1 }}
        transition={{duration:1,type:'spring'  }}>
          <button onClick={() => {setDirection(1) ;setPost2(true); setPost1(false)}} 
                className='flex justify-end bg-black text-white py-1 px-2 ml-auto active:translate-y-1 duration-100 cursor-pointer rounded-xl'>Continuar</button>
          <div className='flex justify-around w-full bg-zinc-100 py-1 rounded-xl'>
            <button type='button' onClick={() => handleTypeChange(1)} className={`py-1 px-2 duration-300 cursor-pointer rounded-xl ${type === 1 ? 'bg-blue-900 text-white' : 'text-black'}`}>Venta</button>
            <button type='button' onClick={() => handleTypeChange(2)} className={`py-1 px-2 duration-300 cursor-pointer rounded-xl ${type === 2 ? 'bg-blue-900 text-white' : 'text-black'}`}>Alquiler</button>
          </div>
          <div className='flex justify-around w-full bg-zinc-100 py-1 rounded-xl'>
            <button type='button' onClick={() => handleModelChange(1)} className={`py-1 px-2 duration-300 cursor-pointer rounded-xl ${model === 1 ? 'bg-blue-900 text-white' : 'text-black'}`}>Casa</button>
            <button type='button' onClick={() => handleModelChange(2)} className={`py-1 px-2 duration-300 cursor-pointer rounded-xl ${model === 2 ? 'bg-blue-900 text-white' : 'text-black'}`}>Departamento</button>
            <button type='button' onClick={() => handleModelChange(3)} className={`py-1 px-2 duration-300 cursor-pointer rounded-xl ${model === 3 ? 'bg-blue-900 text-white' : 'text-black'}`}>PH</button>
            <button type='button' onClick={() => handleModelChange(4)} className={`py-1 px-2 duration-300 cursor-pointer rounded-xl ${model === 4 ? 'bg-blue-900 text-white' : 'text-black'}`}>Condominio</button>
          </div>
          <div className='flex flex-col gap-3 md:w-3/4'>
            <p>Ubicación</p>
            <input type="text" className='outline-none border-b border-zinc-300' value={adress} placeholder='Ingresá la dirección'
               onChange={(e) => setAdress(e.target.value)}/>
            <input type="text" className='outline-none border-b border-zinc-300' value={city} placeholder='Ingresá la ciudad'
               onChange={(e) => setCity(e.target.value)}/>
          </div>
          <div className='flex flex-col gap-3 text-left'>
            <p>Características</p>
            <input type="number" min={0} value={m2tot} onChange={(e) => setM2tot(e.target.value)} className='outline-none border-b border-zinc-300 md:w-3/4' placeholder='Metros cuadrados'/>
            <div className="flex flex-col gap-5 my-3">
              <div className='flex gap-2 justify-around bg-zinc-100 rounded-xl py-1'>
                <button type="button" onClick={() => setKitchen(kitchen === 1 ? 0 : 1)} 
                   className={`py-1 px-3 w-30 rounded-xl cursor-pointer duration-200 ${kitchen === 1 ? 'bg-blue-900 text-white' : 'text-black'}`}>Cocina</button>
                <button type="button" onClick={() => setPool(pool === 1 ? 0 : 1)} 
                   className={`py-1 px-3 w-30 rounded-xl cursor-pointer duration-200 ${pool === 1 ? 'bg-blue-900 text-white' : 'text-black'}`}>Piscina</button>
                <button type="button" onClick={() => setBalcony(balcony === 1 ? 0 : 1)} 
                   className={`py-1 px-3 w-30 rounded-xl cursor-pointer duration-200 ${balcony === 1 ? 'bg-blue-900 text-white' : 'text-black'}`}>Balcón</button>
              </div>
              <div className='flex gap-2 justify-around bg-zinc-100 rounded-xl py-1'>
                <button type="button" onClick={() => setGrill(grill === 1 ? 0 : 1)} 
                   className={`py-1 px-3 w-30 rounded-xl cursor-pointer duration-200 ${grill === 1 ? 'bg-blue-900 text-white' : 'text-black'}`}>Parrilla</button>
                <button type="button" onClick={() => setLaundry(laundry === 1 ? 0 : 1)} 
                   className={`py-1 px-3 w-30 rounded-xl cursor-pointer duration-200 ${laundry === 1 ? 'bg-blue-900 text-white' : 'text-black'}`}>Lavadero</button>
                <button type="button" onClick={() => setVigilance(vigilance === 1 ? 0 : 1)}
                   className={`py-1 px-3 w-30 rounded-xl cursor-pointer duration-200 ${vigilance === 1 ? 'bg-blue-900 text-white' : 'text-black'}`}>Vigilancia</button>
              </div>
            </div>
            <div className='flex flex-col gap-3 lg:flex-row lg:gap-20'>
              <div className='flex justify-between items-center overflow-hidden lg:items-start lg:gap-2 lg:relative lg:h-60 lg:pr-[10px]'>
                <p onClick={() => setOnAmbientes(!onAmbientes)} className='py-1 active:translate-y-1 duration-100 cursor-pointer'>Ambientes <i className='fa-solid fa-angle-right text-sm lg:absolute lg:pointer-events-none lg:opacity-0'/>
                                               <i className='absolute pointer-events-none opacity-0 fa-solid fa-angle-down text-sm lg:relative lg:opacity-100 lg:pointer-events-auto'/></p>
                <AnimatePresence mode='wait'>
                  {onAmbientes && (
                    <>{/* mobile*/}
                      <motion.span className='flex md:-translate-x-50 rounded-xl bg-zinc-200 lg:hidden'
                                     initial={{x:100,opacity:0}}
                                     animate={{x:0,  opacity:1}}
                                        exit={{x:100,opacity:0}}
                                  transition={{duration:0.5   }}>
                        {[1, 2, 3, 4, 5, 6].map((value) => (
                          <p     key={value}
                           className={`py-1 px-3 cursor-pointer text-center duration-300 ${ambiente === value ? 'bg-blue-900 text-white rounded-xl' : ''}`}
                             onClick={() => handleSelection('ambiente', value)}>{value}</p>
                        ))}
                      </motion.span>
                      {/* desktop */}
                      <motion.span className='hidden lg:flex flex-col absolute right-0 top-8 rounded-xl bg-zinc-200'
                                     initial={{y:100,opacity:0}}
                                     animate={{y:0,  opacity:1}}
                                        exit={{y:100,opacity:0}}
                                  transition={{duration:0.5   }}>
                        {[1, 2, 3, 4, 5, 6].map((value) => (
                          <p     key={value}
                           className={`py-1 px-3 cursor-pointer text-center duration-300 ${ambiente === value ? 'bg-blue-900 text-white rounded-xl' : ''}`}
                             onClick={() => handleSelection('ambiente', value)}>{value}</p>
                        ))}
                      </motion.span>
                    </>
                  )}
                </AnimatePresence>
              </div>
              
              <div className='flex justify-between items-center overflow-hidden lg:items-start lg:gap-2 lg:relative lg:h-60 lg:pr-[10px]'>
                <p onClick={() => setOnBaños(!onBaños)} className='py-1 active:translate-y-1 duration-100 cursor-pointer'>Baños <i className='fa-solid fa-angle-right text-sm lg:absolute lg:pointer-events-none lg:opacity-0'/>
                               <i className='absolute pointer-events-none opacity-0 fa-solid fa-angle-down text-sm lg:relative lg:opacity-100 lg:pointer-events-auto'/></p>
                <AnimatePresence mode='wait'>
                  {onBaños && (
                    <>{/* mobile*/}
                    <motion.span className='flex md:-translate-x-50 rounded-xl bg-zinc-200 lg:hidden'
                                   initial={{x:100,opacity:0}}
                                   animate={{x:0,  opacity:1}}
                                      exit={{x:100,opacity:0}}
                                transition={{duration:0.5   }}> 
                      {[1, 2, 3, 4, 5, 6].map((value) => (
                        <p     key={value}
                         className={`py-1 px-3 cursor-pointer text-center duration-300 ${bathroom === value ? 'bg-blue-900 text-white rounded-xl' : ''}`}
                           onClick={() => handleSelection('bathroom', value)}>{value}</p>
                      ))}
                    </motion.span>
                    {/* desktop */}
                    <motion.span className='hidden lg:flex flex-col absolute right-0 top-8 rounded-xl bg-zinc-200'
                                   initial={{y:100,opacity:0}}
                                   animate={{y:0,  opacity:1}}
                                      exit={{y:100,opacity:0}}
                                transition={{duration:0.5   }}>
                      {[1, 2, 3, 4, 5, 6].map((value) => (
                        <p     key={value}
                         className={`py-1 px-3 cursor-pointer text-center duration-300 ${bathroom === value ? 'bg-blue-900 text-white rounded-xl' : ''}`}
                           onClick={() => handleSelection('bathroom', value)}>{value}</p>
                      ))}
                    </motion.span>
                  </>
                  )}
                </AnimatePresence>
              </div>
              
              <div className='flex justify-between items-center overflow-hidden lg:items-start lg:gap-2 lg:relative lg:h-60 lg:pr-[10px]'>
                <p onClick={() => setOnCoches(!onCoches)} className='py-1 active:translate-y-1 duration-100 cursor-pointer'>Coches <i className='fa-solid fa-angle-right text-sm lg:absolute lg:pointer-events-none lg:opacity-0'/>
                                  <i className='absolute pointer-events-none opacity-0 fa-solid fa-angle-down text-sm lg:relative lg:opacity-100 lg:pointer-events-auto'/></p>
                <AnimatePresence mode='wait'>
                  {onCoches && (
                    <>{/* mobile*/}
                      <motion.span className='flex md:-translate-x-50 rounded-xl bg-zinc-200 lg:hidden'
                                     initial={{x:100,opacity:0}}
                                     animate={{x:0,  opacity:1}}
                                        exit={{x:100,opacity:0}}
                                  transition={{duration:0.5   }}>
                        {[0, 1, 2, 3, 4, 5].map((value) => (
                          <p     key={value}
                           className={`py-1 px-3 cursor-pointer text-center duration-300 ${cars === value ? 'bg-blue-900 text-white rounded-xl' : ''}`}
                             onClick={() => handleSelection('cars', value)}>{value}</p>
                        ))}
                      </motion.span>
                      {/* desktop */}
                      <motion.span className='hidden lg:flex flex-col absolute right-0 top-8 rounded-xl bg-zinc-200'
                                     initial={{y:100,opacity:0}}
                                     animate={{y:0,  opacity:1}}
                                        exit={{y:100,opacity:0}}
                                  transition={{duration:0.5   }}>
                        {[0, 1, 2, 3, 4, 5].map((value) => (
                          <p     key={value}
                           className={`py-1 px-3 cursor-pointer text-center duration-300 ${cars === value ? 'bg-blue-900 text-white rounded-xl' : ''}`}
                             onClick={() => handleSelection('cars', value)}>{value}</p>
                        ))}
                      </motion.span>
                    </>
                  )}
                </AnimatePresence>
              </div>
              
              <div className='flex justify-between items-center overflow-hidden lg:items-start lg:gap-2 lg:relative lg:h-60 lg:pr-[10px]'>
                <p onClick={() => setOnDormitorios(!onDormitorios)} className='py-1 active:translate-y-1 duration-100 cursor-pointer'>Dormitorios <i className='fa-solid fa-angle-right text-sm lg:absolute lg:pointer-events-none lg:opacity-0'/>
                                                 <i className='absolute pointer-events-none opacity-0 fa-solid fa-angle-down text-sm lg:relative lg:opacity-100 lg:pointer-events-auto'/></p>
                <AnimatePresence mode='wait'>
                  {onDormitorios && (
                    <>{/* mobile*/}
                    <motion.span className='flex md:-translate-x-50 rounded-xl bg-zinc-200 lg:hidden'
                                   initial={{x:100,opacity:0}}
                                   animate={{x:0,  opacity:1}}
                                      exit={{x:100,opacity:0}}
                                transition={{duration:0.5   }}>
                      {[1, 2, 3, 4, 5, 6].map((value) => (
                        <p     key={value}
                         className={`py-1 px-3 cursor-pointer text-center duration-300 ${bedroom === value ? 'bg-blue-900 text-white rounded-xl' : ''}`}
                           onClick={() => handleSelection('bedroom', value)}>{value}</p>
                      ))}
                    </motion.span>
                    {/* desktop */}
                    <motion.span className='hidden lg:flex flex-col absolute right-0 top-8 rounded-xl bg-zinc-200'
                                   initial={{y:100,opacity:0}}
                                   animate={{y:0,  opacity:1}}
                                      exit={{y:100,opacity:0}}
                                transition={{duration:0.5   }}>
                      {[1, 2, 3, 4, 5, 6].map((value) => (
                        <p     key={value}
                         className={`py-1 px-3 cursor-pointer text-center duration-300 ${bedroom === value ? 'bg-blue-900 text-white rounded-xl' : ''}`}
                           onClick={() => handleSelection('bedroom', value)}>{value}</p>
                      ))}
                    </motion.span>
                  </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      )}      

      {/*Post 2 (IMAGEN)*/}
      {post2 && (
        <motion.div className={`p-3 flex flex-col gap-5 md:px-10 md:w-4/5 md:ml-[6.5%] lg:px-20 xl:w-4/6 xl:ml-[11%] 2xl:w-4/7 2xl:ml-[14.4%]`}
                      initial={{x: direction === 1 ? -100 : 100, opacity:0}}
                      animate={{x:0   , opacity:1                         }}
                   transition={{duration:1,type:'spring'                  }}>
          <div className='flex justify-between'>
            <button onClick={() => {setDirection(0) ;setPost2(false); setPost1(true)}} 
                  className='flex justify-start bg-zinc-200 py-1 px-2 mr-auto active:translate-y-1 duration-100 cursor-pointer rounded-xl'>Volver</button>
            <button onClick={() => {setDirection(1);setPost3(true); setPost2(false)}} 
                  className='flex justify-end bg-black text-white py-1 px-2 ml-auto active:translate-y-1 duration-100 cursor-pointer rounded-xl'>Continuar</button>
          </div>
          <div className='flex justify-between items-center overflow-hidden md:w-3/4'>
            <label htmlFor='principalImage'>Imagen Principal</label>
            <label htmlFor='principalImage' className='fa-solid fa-plus bg-black text-white py-2 px-2.5 cursor-pointer rounded-xl'/>
            <input type='file' id='principalImage' className='hidden' accept='image/*' onChange={handlePrincipalImageChange}/>
          </div>
          {/* Vista previa imagen principal */}
          {principalImage && (
            <div className="mt-2 md:w-3/4">
              <img src={URL.createObjectURL(principalImage)} alt="Imagen principal" className="w-60 h-40 object-cover rounded-xl"/>
            </div>
          )}
          <div className='flex justify-between items-center overflow-hidden md:w-3/4'>
            <label htmlFor='secondaryImages' className='flex gap-2 items-center'>Imagenes Secundarias <p className='text-xs text-zinc-500'>(Hasta 3)</p></label>
            <label htmlFor='secondaryImages' className='fa-solid fa-plus bg-black text-white py-2 px-2.5 cursor-pointer rounded-xl'/>
            <input type='file' id='secondaryImages' className='hidden' accept='image/*' multiple onChange={handleSecondaryImagesChange}/>
          </div>
          {/* Vista previa imágenes secundarias */}
          {secondaryImages.length > 0 && (
            <div className="flex gap-2 mt-2 md:w-3/4 flex-wrap">
              {secondaryImages.map((img, i) => (
                <img key={i} src={URL.createObjectURL(img)} alt={`sec-${i}`} className="w-24 h-24 object-cover rounded-xl"/>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/*Post 3 (CONTACTO)*/}
      {post3 && (
        <motion.div className={`p-3 flex flex-col gap-5 md:px-10 md:w-4/5 md:ml-[13%] lg:px-20 xl:w-4/6 xl:ml-[22%] 2xl:w-4/7 2xl:ml-[28.8%] relative`}
                      initial={{x: direction === 1 ? -100 : 100, opacity:0}}
                      animate={{x:0       , opacity:1                     }}
                   transition={{duration:1, type:'spring'                 }}>
          <div className='flex justify-between'>
            <button onClick={() => {setDirection(0) ;setPost3(false); setPost2(true)}} 
                  className='flex justify-start bg-zinc-200 py-1 px-2 mr-auto active:translate-y-1 duration-100 cursor-pointer rounded-xl'>Volver</button>
            <button onClick={() => {setDirection(1) ;setPost4(true); setPost3(false)}} 
                  className='flex justify-end bg-black text-white py-1 px-2 ml-auto active:translate-y-1 duration-100 cursor-pointer rounded-xl'>Continuar</button>
          </div>
          <p>Mi información de contacto</p>
          <div className='flex justify-around w-full bg-zinc-100 py-1 rounded-xl'>
            <p onClick={() => handleInfoClick()} className={`py-1 px-2 text-center duration-300 rounded-xl ${user.userType === 2 ? 'bg-blue-900 text-white' : 'text-black'}`}>Inmobiliaria</p>
            <p onClick={() => handleInfoClick()} className={`py-1 px-2 text-center duration-300 rounded-xl ${user.userType === 1 ? 'bg-blue-900 text-white' : 'text-black'}`}>Dueño directo</p>
          </div>
          <AnimatePresence>
            {showInfo && (
              <motion.div className="mt-2 p-2 bg-zinc-100 text-zinc-500 px-2 py-1 text-sm text-center w-35 absolute right-3 md:w-auto md:right-0 translate-y-57 md:translate-y-10 rounded-xl"
                          initial={{opacity:0, x:50 }} 
                          animate={{opacity:1, x:0  }} 
                             exit={{opacity:0, x:-50}}
                       transition={{duration:1, type:'spring'}}>
                Su cuenta es tipo: {user.userType === 1 ? 'Particular' : 'Inmobiliaria'}
              </motion.div>
            )}
          </AnimatePresence>
          <p>Email <span className='italic bg-zinc-100 py-1 px-2 rounded-xl ml-2'>{user.email}</span></p>
          <input value={personalName} onChange={(e) => setPersonalName(e.target.value)} type="text" placeholder='Nombre o Inmobiliaria a cargo' className='border-b border-zinc-300 outline-none md:w-3/4'/>
          <p>Teléfono <span className='italic bg-zinc-100 py-1 px-2 rounded-xl ml-2'>{user.phone}</span></p>
        </motion.div>
      )}
      
      {/*Post 4 (PRECIO)*/}
      {post4 && (
        <motion.div className='relative p-3 flex flex-col gap-5 md:px-10 md:ml-auto md:w-4/5 lg:px-20 xl:w-4/6 2xl:w-4/7'
                      initial={{x: direction === 1 ? -100 : 100, opacity:0}}
                      animate={{x:0       , opacity:1                     }}
                   transition={{duration:1, type:'spring'                 }}>
          <button onClick={() => {setDirection(0) ;setPost4(false); setPost3(true)}} 
                className='flex justify-start bg-zinc-200 py-1 px-2 mr-auto active:translate-y-1 duration-100 cursor-pointer rounded-xl'>Volver</button>
          <div className='flex w-full justify-between'>
            <p>Precio en USD</p>
            <div className='flex'>
              <p className='border-b border-zinc-300'>$</p>
              <input type="number" min={0} value={price} placeholder=' 999.999' className='border-b border-zinc-300 outline-none' onChange={(e) => setPrice(e.target.value)} />
            </div>
          </div>
          <div className='flex flex-col gap-3'>
            <p>Agregá una descripción</p>
            <textarea className="bg-zinc-100 outline-none w-3/4 h-[30vh] p-2 rounded-xl" minLength={100} maxLength={500} placeholder='minimo 100 caracteres, maximo 500.' 
                          value={description} onChange={(e) => setDescription(e.target.value)}/>
          </div>
          <button className='flex justify-center ml-auto w-3/5 bg-black text-white py-2 px-3 shadow-xl cursor-pointer active:translate-y-1 duration-100 rounded-xl'
                       type='submit'>Publicar</button>

          {Object.keys(errors).length > 0 && (
            <motion.div className="p-2 font-inter w-3/4 bg-red-100/50 rounded-lg xl:absolute xl:-left-85 xl:top-32.5 xl:w-90"
                          initial={{opacity:0}} animate={{opacity:1}}>
              <h3 className="font-semibold text-red-800">Campos incompletos</h3>
              <ul className="text-red-900 text-sm">
                {Object.keys(errors).map((key) => (
                  <li key={key}>{errors[key]}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </motion.div>
      )}
    </form>
    </>
  )
}

export default Post