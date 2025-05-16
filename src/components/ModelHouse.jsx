import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useRef, useEffect, useState } from 'react'

const House = ({ onModelReady, disabledObjects }) => {

  const { scene } = useGLTF('/modern_house.glb')
  const ref = useRef()

  //MATERIAL
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    scene.position.sub(center)
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        if (disabledObjects.includes(child.name)) {
          child.visible = false
        } else {
          child.visible = true
        }
      }
    })
    if (onModelReady) {
      onModelReady(-center.y + box.min.y)
    }
  }, [scene, onModelReady, disabledObjects])
  return <primitive ref={ref} object={scene} />
}
const ModelHouse = () => {
  
  //CAMARA
  const [groundY, setGroundY] = useState(-1)
  const [cameraPos, setCameraPos] = useState([0, 0, 45])
  const disabledObjects = ['Object_87', 'Object_89', 'Object_97']
  useEffect(() => {
    const updateCamera = () => {
      const width = window.innerWidth
      if (width < 1024) {
        setCameraPos([10, 0, 35])
      } else if (width < 1440) {
        setCameraPos([10, 0, 30])
      } else {
        setCameraPos([16, 0, 26])
      }
    }
    updateCamera()
    window.addEventListener('resize', updateCamera)
    return () => window.removeEventListener('resize', updateCamera)
  }, [])

  //MODELO
  return (
    <Canvas shadows camera={{ position: cameraPos, fov: 50 }}>
      <ambientLight intensity={1}/>
      <directionalLight position={[10, 10, 10]}
                       intensity={5   } castShadow
            shadow-mapSize-width={2048}
           shadow-mapSize-height={2048}
              shadow-camera-near={1   }
               shadow-camera-far={50  }
              shadow-camera-left={-10 }
             shadow-camera-right={10  }
               shadow-camera-top={10  }
            shadow-camera-bottom={-10 }/>
      <OrbitControls maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 10} autoRotate autoRotateSpeed={0.5} enableZoom={false}/>
      <House onModelReady={setGroundY} disabledObjects={disabledObjects}/>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, groundY, 0]}receiveShadow>
        <planeGeometry args={[100, 100]}/>
        <shadowMaterial opacity={0.3}/>
      </mesh>
    </Canvas>
  )
}

export default ModelHouse
