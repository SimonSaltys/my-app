/**
 * @file src/app/components/map/MapClientWrapper.tsx
 * 
 * @fileoverview Holds the header, map, image gallery, and footer
 * 
 * @todo 
 */

"use client"
//library imports
import "react-image-gallery/styles/css/image-gallery.css"
import { createContext, useEffect, useReducer} from "react"
import { GridLoader } from "react-spinners"

//custom imports
import { MapNavbar } from "@/app/components/map/navitems/MapNavbar"
import { Footer } from "@/app/components/Footer"
import { LeaderBoard }  from "@/app/components/map/LeaderBoard"
import { fetchCoordinates, iNatFetch} from"@/app/functions/mapFunctions"
import MapDataReducer, { MapDataAction } from "@/app/reducers/MapDataReducer"
import { MapImageGallery } from "./MapImageGallery"
import { MapDataState, MapDataInitialState } from "@/app/interfaces/mapInterfaces"

//dynamic imports
import dynamic from 'next/dynamic'
const DynamicMap = dynamic(() => import('./Map'), {
    ssr: false 
})

export interface MapContextData {
    state: MapDataState,
    dispatch: React.Dispatch<MapDataAction>
}

export const MapContext = createContext<MapContextData | ''>('');

/**
 * Wraps all the children that make up this component together
 * 
 * @returns a JSX element representing the MapClientWrapper component.
 */
const MapClientWrapper = () => {
    const [state, dispatch] = useReducer(MapDataReducer, MapDataInitialState);
    
    /*
        Updates the data when the user updates their 
        search parameters or clicks somewhere else on the map. 
    */
    useEffect(() => { 

        fetchCoordinates(state,dispatch)
        iNatFetch(state,dispatch)
         // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [state.displayOptions, state.coordinates])
    
   
    return (
        <MapContext.Provider value={{state, dispatch}}>
        <MapNavbar/>
   
        <main className="flex w-full h-[calc(100vh-120px)] min-h-[calc(100vh-120px)] overflow-y-auto">
            <section className={`h-[95%] min-h-[600px] lg:flex justify-center items-center lg:w-1/3 ml-2 mt-4 ${state.activeSection === "locations" ? "mr-2 flex w-full" : "hidden"}`}>
                {state.loading ? (
                    <div className="flex justify-center items-center w-full h-full flex-col border-2 border-pacific-blue rounded-lg">
                        <GridLoader size={20} color="#004C46" />
                        <p className="mt-4 text-2xl">Updating Map...</p>
                    </div>
                    ) : (
                <DynamicMap
                />
                    )}
            </section>
            
            <section className={`lg:flex min-h-[600px] lg:w-1/3 items-center justify-center w-full flex-col ${state.activeSection === "images" ? "flex" : "hidden"}`}>
               <MapImageGallery />
            </section>
    
            <section className={`lg:flex lg:w-1/3 min-h-[600px] flex-col justify-center items-center  ${state.activeSection === 'leaderboard' ? 'flex w-full' : 'hidden'} text-md`}>
                <LeaderBoard identifiers={state.topIdentifiers} observers={state.topObservers} />
            </section>
        </main>
        <Footer/>
        </MapContext.Provider>
    )

}

export default MapClientWrapper
