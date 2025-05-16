import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-control-geocoder/dist/Control.Geocoder.css'
import MapControls from '../components/MapControls'

const position = [-34.6037, -58.3816] // Buenos Aires

const Map = () => {
  const propertyIcon = L.icon({
    iconUrl: '/map-icon-property.png',
    iconSize: [30, 52],
    iconAnchor: [16, 38],
    popupAnchor: [0, -32],
    shadowUrl: '/marker-shadow.png',
    shadowSize: [50, 50],
    shadowAnchor: [16, 38],
  })

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  //GEOCODIFICAR
  const obtenerCoordenadas = async (direccion, ciudad, property) => {
    const query = `${direccion}, ${ciudad}`
    const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
    const geoData = await geoResponse.json()
    if (geoData.length > 0) {
      const updatedProperty = {
        ...property,
        lat: parseFloat(geoData[0].lat),
        lng: parseFloat(geoData[0].lon),
      }
      setProperties((prevProperties) => {
        const exists = prevProperties.some(p => p.id === updatedProperty.id)
        if (exists) return prevProperties
        return [...prevProperties, updatedProperty]
      })
    }
  }

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/properties')
        const data = await response.json()
        data.forEach((property) => {
          obtenerCoordenadas(property.adress, property.city, property)
        })
        setLoading(false)
      } catch (error) {
        console.error('Error al cargar propiedades o geocodificar:', error)
      }
    }
    fetchProperties()
  }, [])

  const fadeInMarker = (marker) => {
    let opacity = 0
    marker.setOpacity(opacity)
    const fadeIn = setInterval(() => {
      opacity += 0.1
      marker.setOpacity(opacity)
      if (opacity >= 1) {
        clearInterval(fadeIn)
      }
    }, 50)
  }

  return (
    <div className="w-9/10 drop-shadow-xl mx-auto mt-5 lg:w-10/10 lg:px-20">
      <MapContainer center={position} zoom={13} zoomControl={false} style={{height: '85vh', width: '100%', borderRadius: '12px'}}>
        <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
           attribution='&copy; <a href="http://hot.openstreetmap.org">Humanitarian OSM Team</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'/>
        <MapControls />

        {properties.filter((property) => typeof property.lat === 'number' && typeof property.lng === 'number').map((property) => (
          <Marker key={property.id} position={[property.lat, property.lng]} icon={propertyIcon} eventHandlers={{add: (e) => fadeInMarker(e.target)}}>
            <Popup>
              <div style={{fontFamily: 'Lora, serif',textAlign:'left', width:'200px', padding:'0', display:'flex', flexDirection:'column', alignItems:'center', gap:'5px', transform:'translateX(3px)'}}>
                <p style={{width:'100%', margin:'0 auto 2px 0', fontSize:'1.1em', lineHeight:'1.2', fontWeight:'bold'}}>{property.adress}</p>
                <p style={{width:'auto', margin:'0 auto 2px 0', fontSize:'1em', lineHeight:'1.2', padding:'2px 4px', backgroundColor:'rgba(0, 0, 0, 0.1)', borderRadius:'12px'}}>USD ${property.price}</p>
                <p style={{width:'100%', margin:'0 auto 2px 0', fontSize:'1em', lineHeight:'1.2', fontStyle:'italic'}}>{property.city}</p>
                <Link to={`/article/${property.id}`} style={{ width: '100%'}}>
                <img src={`http://localhost:5000${property.principalImage}`} alt="Imagen de propiedad" style={{ width: '100%',height: '100px',objectFit: 'cover',borderRadius: '8px'}}/>
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default Map;
