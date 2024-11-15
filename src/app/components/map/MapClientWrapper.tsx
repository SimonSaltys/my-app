/**
 * @file src/app/components/map/MapClientWrapper.tsx
 * 
 * @fileoverview Holds the header, map, image gallery, and footer
 * 
 * @todo add footer and leader board
 */

"use client"

//default imports
import "react-image-gallery/styles/css/image-gallery.css"
import ImageGallery from 'react-image-gallery'
import { ReactImageGalleryItem } from "react-image-gallery"
import { useState, useEffect } from "react"
import { LatLngLiteral } from "leaflet"

//custom imports
import { SearchValues } from "./Map"
import { DisplayOptions } from "./Map"
import { MapNavbar } from "@/app/components/map/navitems/MapNavbar"
import { Header } from "@/app/components/Header"
import { Footer } from "@/app/components/Footer"
import { LeaderBoard }  from "@/app/components/map/LeaderBoard"

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
    const defaultCoordinates: LatLngLiteral = { lat: 39.35, lng: -120.26 }
    const [searchedValue, setSearchedValue] = useState<SearchValues>({
                                                specimenName: "Sequoia", 
                                                taxonId: -1 
                                                })
     const [displayOptions,setDisplayOptions] = useState<DisplayOptions>({
        radius : 75,
        displayAmount : 20,
        beforeDate : undefined,
        sinceDate : undefined,
        gradeType : "needs_id,research,casual"})

    const [userCoordinates, setUserCoordinates] = useState<LatLngLiteral>()
    const [coordinates, setCoordinates] = useState<LatLngLiteral>()
    const [activeSection, setActiveSection] = useState<string>("images")

    const [images, setImages] = useState<any[]>([])

    const [observations, setObservations] = useState<any[]>([])
    const [topObservers, setTopObservers] = useState<any[]>()
    const [topIdentifiers, setTopIdentifiers] = useState<any[]>()

    const [observer, setObserver] = useState<string>()
    const [observationTitle, setObservationTitle] = useState<string>()
    const [observationLocation, setObservationLocation] = useState<string>()
    const [observationDate, setObservationDate] = useState<string>()
    const [observerIcon, setObserverIcon] = useState<string>()

    const setCredentials = (index: number) => {
        const observation = observations[index]
        setObserver(observation.user.login_exact ?? observation.user.login ?? '')
        setObservationTitle(observation.species_guess ?? observation.taxon.name ?? '')
        setObservationDate(observation.observed_on_details.date ?? observation.time_observed_at ?? '')
        setObservationLocation(observation.place_guess ?? '')
        setObserverIcon(observation.user.icon ?? 'img/blankIcon.jpg')
    }
    
    useEffect(() => {
        const iNatFetch = async () => {
            if(!searchedValue.specimenName)
                return

            const iNatFetchObj = {
                activeSpecies: searchedValue.specimenName,
                userCoordinates: userCoordinates ? userCoordinates : undefined,
                radius: displayOptions.radius,
                qualityGrade: displayOptions.gradeType
            }

            const res = await fetch('api/collections/inaturalist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',  
                },
                body: JSON.stringify(iNatFetchObj) 
            })

            if (res.ok) {
                const json = await res.json()
                setCoordinates(userCoordinates)
            
                setObservations(json.data.observations)
            
                setImages(json.data.images)
            
                setTopObservers(json.data.topObservers)
            
                setTopIdentifiers(json.data.topIdentifiers)
                if (!userCoordinates) {
                    setCoordinates(json.data.point)
                }

            } else {
                console.error("Error fetching iNaturalist data:", res.statusText)
            }
        }
        iNatFetch()
    }, [userCoordinates, displayOptions])
 
 
    return (
        <>
        <MapNavbar setActiveSection={setActiveSection}/>
    
        <main className="flex w-full h-[90vh]">
            <section className='hidden lg:flex ml-2 w-1/3 my-2'>
                <DynamicMap
                            activeSpecies={searchedValue.specimenName} 
                            position={coordinates ?? defaultCoordinates} 
                            userCoordinates={userCoordinates} 
                            setUserCoordinates={setUserCoordinates} 
                            observations={observations ?? []}
                            displayOptions={displayOptions}
                            setDisplayOptions={setDisplayOptions}
                />
            </section>
            
            <section className='flex items-center justify-center h-full w-full lg:w-1/3 flex-col'>
                {observations && (
                    <>
                        <p className='flex w-full h-[50px] justify-center items-center text-2xl xl:text-3xl'>{(observationTitle as string)}</p>
                        <div className='w-3/5 h-[500px] lg:h-[60%] lg:w-4/5 xl:w-[95%] xl:h-[75%]'>
                            <ImageGallery autoPlay items={images as ReactImageGalleryItem[]} slideInterval={5000} onSlide={(currentIndex) => setCredentials(currentIndex)}/>
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
    
            <section className="hidden lg:flex flex-col justify-center items-center w-1/3">
                <LeaderBoard identifiers={topIdentifiers} observers={topObservers} />
            </section>
        </main>
        
        <Footer/>
        </>
    )

}
