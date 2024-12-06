"use client"

import { setCredentials } from "@/app/functions/MapFunctions";
import { useContext, useEffect } from "react";
import { ReactImageGalleryItem } from "react-image-gallery";
import { MapContext, MapContextData } from "./MapClientWrapper";
import ImageGallery from 'react-image-gallery'
import { stat } from "fs";


export const MapImageGallery = () => { 
    const context = useContext(MapContext) as MapContextData
    const state = context.state
    const dispatch = context.dispatch

    useEffect(() => { 

        if(state.observations.length > 0)
            setCredentials(0,state,dispatch)
    }, [state.displayOptions]); 

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
                                    <img className='inline-block h-[48px] w-[48px] mr-4' src={state.observationIcon} alt='Observer Icon' />
                                    <span className="">{state.observer}</span>
                                </p>
                            </div>
                        </div>
                        
                    </>
                )}
        </>
    )

}