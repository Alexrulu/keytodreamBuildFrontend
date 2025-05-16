import { useMap } from 'react-leaflet'
import { useState } from 'react'
import L from 'leaflet'
import 'leaflet-control-geocoder'
import { toast } from 'react-toastify'

const MapControls = () => {
  const map = useMap()
  const [search, setSearch] = useState('')

  const handleSearch = async () => {
    if (!search) return

    //GEOCODIFICADOR (busca propiedades por dirección)
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`)
    const data = await res.json()
    if (data.length > 0) {
      const { lat, lon, display_name } = data[0]
      const latlng = L.latLng(lat, lon)
      map.setView(latlng, 13)
      L.marker(latlng).addTo(map).bindPopup(display_name).openPopup()
    } else {
      toast.info("No se encontraron resultados")
    }
  }

  return (
    <>
      {/* zoom */}
      <div className="absolute top-2 right-2 flex flex-col gap-2 z-[1000]">
        <i onClick={() => map.zoomIn()} className="fa-solid fa-plus bg-white shadow-xl text-black px-3.5 py-[12px] rounded-xl cursor-pointer hover:scale-110 duration-200"/>
        <i onClick={() => map.zoomOut()} className="fa-solid fa-minus bg-white shadow-xl text-black px-3.5 py-[12px] rounded-xl cursor-pointer hover:scale-110 duration-200"/>
      </div>

      {/* search */}
      <div className="absolute top-2 left-2 z-1000 flex gap-2 drop-shadow-xl font-lora">
        <input type="text" value={search} placeholder="Buscar por ciudad" onChange={(e) => setSearch(e.target.value)} 
          className="px-2 py-[7px] text-sm rounded-xl outline-none bg-white text-zinc-600"/>
        <button onClick={handleSearch} className="px-3 py-[7px] text-sm rounded-xl bg-white cursor-pointer hover:scale-110 duration-200">Buscar</button>
      </div>
    </>
  )
}

export default MapControls
