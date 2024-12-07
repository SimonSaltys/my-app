/**
 * @file /src/app/components/map/MapImageGallery.tsx
 * 
 * @fileoverview Displays the images of the currently selected location
 * on the map
 * 
 * @todo
 */
"use client"
//custom imports
import { setCredentials } from "@/app/functions/MapFunctions";
import { MapContext, MapContextData } from "./MapClientWrapper";

//library imports
import { useContext, useEffect } from "react";
import { ReactImageGalleryItem } from "react-image-gallery";
import ImageGallery from 'react-image-gallery'
import Image from "next/image";

/**
 * @returns a JSX component that holds the images of the 
 * currently viewed observations on the map
 */
export const MapImageGallery = () => { 

    //The global context being used by all child components
    const context = useContext(MapContext) as MapContextData
    const state = context.state
    const dispatch = context.dispatch

    //When the user updates their search parameters, set the credentials back to the start
    useEffect(() => { 
        if(state.observations.length > 0)
            setCredentials(0,state,dispatch)
         // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [state.displayOptions])

    return (
        <>
        {state.observations.length > 0 && (
                    <>
                        <p className='flex w-full h-[10%] justify-center items-center text-2xl'>{(state.observationTitle as string)}</p>
                        <div className='w-3/5 h-[70%] lg:h-[60%] lg:w-4/5'>
                            <ImageGallery autoPlay items={state.images as ReactImageGalleryItem[]} slideInterval={4000} 
                                onSlide={(currentIndex) => setCredentials(currentIndex, state,dispatch)} 
                                onPlay={(currentIndex) => setCredentials(currentIndex, state, dispatch)
                                }/>
                        </div>
                        <div className="flex flex-col items-center justify-center h-[160px] w-full">
                            <div id='observationCredentials' className='flex flex-col h-[20%] xl:h-[30%] w-4/5 text-center items-center justify-center text-base xl:text-lg'>
                                <p className="">{state.observationLocation}</p>
                                <p className="">{state.observationDate}</p>
                                <p className='mt-1'>
                                    <Image width={48} height={48} src={state.observationIcon} alt="Observer Icon" style={{ display: 'inline-block', marginRight: '1rem' }} />
                                    <span className="">{state.observer}</span>
                                </p>
                            </div>
                        </div>
                        
                    </>
                )}
        </>
    )

}