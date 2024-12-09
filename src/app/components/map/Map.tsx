/**
 * @file /src/app/components/map/Map.tsx
 * 
 * @fileoverview Displays the map with all its relative points controlled by the 
 * `MapOptions`
 * 
 * @todo
 */
"use client"

import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet'
import { useState,useEffect, useContext} from "react"
import { MapOptions } from '@/app/components/map/MapOptions'
import L from 'leaflet'
import RecenterMap from './RecenterMap'
import { MapContext, MapContextData } from './MapClientWrapper'
import Image from 'next/image'
import { MapDataState } from '@/app/interfaces/mapInterfaces'


/**
 * @returns a JSX component which displays a map of the all the observations of 
 * the specimen, with a focus on where the user has clicked
 */
export default function Map() {
    const [showMapOptions, setShowMapOptions] = useState<boolean>(false)
    
    //The global context being used by all child components
    const context = useContext(MapContext) as MapContextData
    const dispatch = context.dispatch;
    const data : MapDataState = context.state;

    //Getting the tile map to be shown on the map
    const lightModeTiles: string = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'
    const darkModeTiles: string = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
    const prefersDarkMode: boolean = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const openAttribution: string = '&copy; https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    const esriAttribution: string = "Powered by <a href='https://www.esri.com/en-us/home' rel='noopener noreferrer'>Esri</a>"
    const iNatTileUrl: string = 'https://api.inaturalist.org/v1/points/{z}/{x}/{y}.png?photos=true&taxon_name=' + data.searchedValue.specimenName

    const tiles = !prefersDarkMode ? lightModeTiles : darkModeTiles
    const attribution = !prefersDarkMode ? openAttribution : esriAttribution
    
    //The icon that each observation will have
    const observationIcon = L.icon({
        iconRetinaUrl: '/img/marker-32.png',
        iconUrl: '/img/marker-32.png',
        popupAnchor: [-0, -0],
        iconSize: [32, 32],
      });

      //The icon that is shown in the center of the circle
      const centerIcon = L.icon({
        iconRetinaUrl: '/img/marker-icon-2x.png',
        iconUrl: '/img/marker-icon.png',
        shadowUrl: '/img/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
      });

    /**
     * @returns a JSX component that only displays a marker;
     * it is responsible for setting a marker and updating 
     * the coordinates when the user clicks on the map
     */
    const LocationFinder = () => {
        useMapEvents({
            click(e) {
                dispatch({
                    type: "SET_COORDINATES",
                    payload: { lat: e.latlng.lat, lng: e.latlng.lng }
                })
            },
        })

        return  data.coordinates === null ? null : (
            <Marker position={data.coordinates} icon={centerIcon} />
        )
    }

    //hide the forum on submit
    useEffect(() => {
        setShowMapOptions(false)
    }, [context.state.displayOptions]);

   return (
        <div className="relative h-full w-full">
        
        <button 
            onClick={() => setShowMapOptions((prev) => !prev)} 
            className="bg-blue-500 text-white p-2 rounded absolute top-4 right-4 z-10 shadow-md"
        >
            Toggle Map Options
        </button>

        {showMapOptions && 
            <div className="absolute top-16 right-4 z-50 bg-white shadow-md p-4 rounded">
                <MapOptions 
                />
            </div>
        }

        <MapContainer className="z-0 rounded-xl h-full w-full" center={[data.coordinates.lat, data.coordinates.lng]} zoom={7} scrollWheelZoom={false}>
            <LocationFinder />
            <RecenterMap position={data.coordinates}/>
            <TileLayer
                attribution={attribution}
                url={tiles}
            />
            <TileLayer
                url={iNatTileUrl}
            />
            {data.coordinates && (
                //draws a circle around the currently clicked coordinate
                <Circle
                    center={data.coordinates}
                    radius={data.displayOptions.radius * 1000}
                    pathOptions={{ color: '#004C46', fillColor: '#004C46' }}
                />
            )}

            {data.observations.length > 0 && (
                <>
                    {data.observations.map((observation, index) => {
                        //sets a marker for each observation in the current observations array
                        if (index < data.displayOptions.displayAmount) {
                            return (
                                <Marker 
                                    key={index} 
                                    position={[observation.coordinates.lng, observation.coordinates.lat]} 
                                    icon={observationIcon}
                                >
                                    <Popup>
                                        <div className='flex h-[200px] w-[300px] justify-between'>
                                            <div>
                                                <p className='text-center text-[20px] !mt-0 !mb-[12px] text-[#004C46] dark:text-[#F5F3E7]'>
                                                    {observation.taxon_name}
                                                </p>
                                                <p className='text-[14px] !mt-0 !mb-[12px]'>Observer: {observation.user.userName ?? ''}</p>
                                                <p className='text-[14px] !m-0 !mb-[12px]'>Date: {observation.observedDate}</p>
                                                <p className='text-[14px] !m-0 !mb-[12px]'>Verifiable: {observation.gradeType}</p>

                                            </div>

                                                <Image src={observation.images.small} 
                                                    alt="observation photo"
                                                    width={125}
                                                    height={150} />
                                            
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        }
                        return null; //beyond index allowed
                    })}
                </>
            )}
        </MapContainer>
    </div>
   ) 
}