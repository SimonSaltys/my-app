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
import ImageGallery from 'react-image-gallery'
import { ReactImageGalleryItem } from "react-image-gallery"
import { createContext, useEffect, useReducer} from "react"
import { GridLoader } from "react-spinners"

//my own imports
import { MapNavbar } from "@/app/components/map/navitems/MapNavbar"
import { Footer } from "@/app/components/Footer"
import { LeaderBoard }  from "@/app/components/map/LeaderBoard"
import { fetchCoordinates, iNatFetch, setCredentials} from"@/app/functions/MapFunctions"

//dynamic imports
import dynamic from 'next/dynamic'
import MapDataReducer, { MapDataAction, MapDataInitialState, MapDataState } from "@/app/reducers/MapDataReducer"
const DynamicMap = dynamic(() => import('./Map'), {
    ssr: false 
})

export interface MapContextData {
    state: MapDataState,
    dispatch: React.Dispatch<MapDataAction>
}

export const MapContext = createContext<MapContextData | ''>('');

/**
 * MapClientWrapper Component
 * 
 * @returns {JSX.Element} A JSX element representing the MapClientWrapper component.
 */
const MapClientWrapper = () => {
    const [state, dispatch] = useReducer(MapDataReducer, MapDataInitialState);
    
    /*
        every time the user updates the graph by moving around or changing parameters
        we want to update the graph with the new data
    */
    useEffect(() => { 

        fetchCoordinates(state,dispatch)
        iNatFetch(state,dispatch)

    }, [state.displayOptions, state.coordinates]); 
    
   
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
                {state.observations.length > 0 && (
                    <>
                        <p className='flex w-full h-[10%] justify-center items-center text-2xl'>{(state.observationTitle as string)}</p>
                        <div className='w-3/5 h-[70%] lg:h-[60%] lg:w-4/5'>
                            <ImageGallery autoPlay items={state.images as ReactImageGalleryItem[]} slideInterval={4000} 
                                onSlide={(currentIndex) => setCredentials(currentIndex, state,dispatch) } 
                                onPlay={(currentIndex) => setCredentials(currentIndex, state, dispatch)}/>
                        </div>
                        <div className="flex flex-col items-center justify-center h-[160px] w-full">
                            <div id='observationCredentials' className='flex flex-col h-[20%] xl:h-[30%] w-4/5 text-center items-center justify-center text-base xl:text-lg'>
                                <p className="">{state.observationLocation}</p>
                                <p className="">{state.observationDate}</p>
                                <p className='mt-1'>
                                    <img className='inline-block h-[48px] w-[48px] mr-4' src={state.observationIcon} alt='Observer Icon' />
                                    <span className="">{state.observer}</span>
                                </p>
                            </div>
                        </div>
                        
                    </>
                )}
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
