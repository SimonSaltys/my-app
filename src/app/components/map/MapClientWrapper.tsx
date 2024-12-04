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
import { useState, useEffect } from "react"
import { LatLngLiteral } from "leaflet"
import { GridLoader } from "react-spinners"

//my own imports
import { SearchValues } from "./Map"
import { DisplayOptions } from "./Map"
import { MapNavbar } from "@/app/components/map/navitems/MapNavbar"
import { Footer } from "@/app/components/Footer"
import { LeaderBoard }  from "@/app/components/map/LeaderBoard"
import { defaultCoordinates, fetchCoordinates, iNatFetch, setCredentials, CredentialsParams, iNatFetchParams, fetchCoordinatesParams } from"@/app/functions/MapFunctions"
import { iNatLeadingUser, iNatUserObservation } from "@/app/api/collections/inaturalist/route"

//dynamic imports
import dynamic from 'next/dynamic'
const DynamicMap = dynamic(() => import('./Map'), {
    ssr: false 
})

/**
 * MapClientWrapper Component
 * 
 * @returns {JSX.Element} A JSX element representing the MapClientWrapper component.
 */
export default function MapClientWrapper() {

    //default values
    //todo remove searched value when integrating to the main repo
    const [searchedValue, setSearchedValue] = useState<SearchValues>({
                                                specimenName: "Poppy", 
                                                taxonId: -1 
                                                })
     const [displayOptions,setDisplayOptions] = useState<DisplayOptions>({
        radius : 75,
        displayAmount : 20,
        beforeDate : undefined,
        sinceDate : undefined,
        gradeType : "needs_id,research,casual",
        useCurrentLocation : false })

    //misc states 
    const [coordinates, setCoordinates] = useState<LatLngLiteral>(defaultCoordinates)
    const [activeSection, setActiveSection] = useState<string>("images")
    const [loading, setLoading] = useState<boolean>(false)

    //api response
    const [images, setImages] = useState<any[]>([])
    const [observations, setObservations] = useState<iNatUserObservation[]>([])
    const [topObservers, setTopObservers] = useState<iNatLeadingUser[]>([])
    const [topIdentifiers, setTopIdentifiers] = useState<iNatLeadingUser[]>([])

    //credentials
    const [observer, setObserver] = useState<string>(" ")
    const [observationTitle, setObservationTitle] = useState<string>(" ")
    const [observationLocation, setObservationLocation] = useState<string>(" ")
    const [observationDate, setObservationDate] = useState<string>(" ")
    const [observerIcon, setObserverIcon] = useState<string>(" ")

    //params for fetching coordinates 
    const fetchCoordinatesParams : fetchCoordinatesParams = {
        coordinates,
        displayOptions,
        setDisplayOptions,
        setCoordinates
    }

    //params for setting credentials 
    const credentialParams : CredentialsParams = {
        observations,
        setObserver,
        setObservationTitle,
        setObservationDate,
        setObservationLocation,
        setObserverIcon
    }

    //params for fetching data from the iNat API
    const iNatFetchParams : iNatFetchParams = {
        searchedValue,
        coordinates,
        displayOptions,
        setLoading,
        setObservations,
        setImages,
        setTopIdentifiers,
        setTopObservers
    }

    /*
        every time the user updates the graph by moving around or changing parameters
        we want to update the graph with the new data
    */
    useEffect(() => { 

        fetchCoordinates(fetchCoordinatesParams)
        iNatFetch(iNatFetchParams)

    }, [displayOptions, coordinates]); 
    
   
    return (
        <>
        
        <MapNavbar activeSelection={activeSection} setActiveSection={setActiveSection}/>
   
        <main className="flex w-full h-[calc(100vh-120px)] min-h-[calc(100vh-120px)] overflow-y-auto">
            <section className={`h-[95%] min-h-[600px] lg:flex justify-center items-center lg:w-1/3 ml-2 mt-4 ${activeSection === "locations" ? "mr-2 flex w-full" : "hidden"}`}>
                {loading ? (
                    <div className="flex justify-center items-center w-full h-full flex-col border-2 border-pacific-blue rounded-lg">
                        <GridLoader size={20} color="#004C46" />
                        <p className="mt-4 text-2xl">Updating Map...</p>
                    </div>
                    ) : (
                <DynamicMap
                            activeSpecies={searchedValue.specimenName} 
                            position={coordinates ?? defaultCoordinates} 
                            setCoordinates={setCoordinates} 
                            observations={observations}
                            displayOptions={displayOptions}
                            setDisplayOptions={setDisplayOptions}
                            setLoading={setLoading}
                />
                    )}
            </section>
            
            <section className={`lg:flex min-h-[600px] lg:w-1/3 items-center justify-center w-full flex-col ${activeSection === "images" ? "flex" : "hidden"}`}>
                {observations.length > 0 && (
                    <>
                        <p className='flex w-full h-[10%] justify-center items-center text-2xl'>{(observationTitle as string)}</p>
                        <div className='w-3/5 h-[70%] lg:h-[60%] lg:w-4/5'>
                            <ImageGallery autoPlay items={images as ReactImageGalleryItem[]} slideInterval={4000} 
                                onSlide={(currentIndex) => setCredentials(currentIndex, credentialParams) } 
                                onPlay={(currentIndex) => setCredentials(currentIndex, credentialParams)}/>
                        </div>
                        <div className="flex flex-col items-center justify-center h-[160px] w-full">
                            <div id='observationCredentials' className='flex flex-col h-[20%] xl:h-[30%] w-4/5 text-center items-center justify-center text-base xl:text-lg'>
                                <p className="">{observationLocation}</p>
                                <p className="">{observationDate}</p>
                                <p className='mt-1'>
                                    <img className='inline-block h-[48px] w-[48px] mr-4' src={observerIcon} alt='Observer Icon' />
                                    <span className="">{observer}</span>
                                </p>
                            </div>
                        </div>
                        
                    </>
                )}
            </section>
    
            <section className={`lg:flex lg:w-1/3 min-h-[600px] flex-col justify-center items-center  ${activeSection === 'leaderboard' ? 'flex w-full' : 'hidden'} text-md`}>
                <LeaderBoard identifiers={topIdentifiers} observers={topObservers} />
            </section>
        </main>
        <Footer/>
        
        </>
    )

}
