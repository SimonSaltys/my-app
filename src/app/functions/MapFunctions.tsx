/**
 * @file /src/app/functions/MapFunctions.tsx
 * 
 * @fileoverview Contains all the functions for all Map components to use
 * 
 * @todo 
 */

import { LatLngLiteral } from "leaflet";
import { iNatApiResult, iNatFetchObj} from "@/app/api/collections/inaturalist/route"
import { MapDataAction, MapDataState } from "../reducers/MapDataReducer";
import { Dispatch } from "react";

//When the map first loads it will load here, If there is an error it will also load back to here
export const defaultCoordinates: LatLngLiteral = { lat: 39.35, lng: -120.26 }

/**
 * Retrieves the user's current geographical coordinates using the browser's Geolocation API.
 * 
 * This function uses `navigator.geolocation.getCurrentPosition` to asynchronously obtain 
 * the user's longitude and latitude.
 * 
 * @returns {Promise<{ longitude: number, latitude: number }>}
 * @throws {GeolocationPositionError}
 */
const getCoords = async (): Promise<{ longitude: number; latitude: number; }> => {
    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, (error) => {
            reject(new Error(`Geolocation error: ${error.message}`));
        });
    })
    
    return {
        longitude: pos.coords.longitude,
        latitude: pos.coords.latitude,
    }
};

/**
 * Updates the user's location based on their preference.
 * 
 * This function either fetches the user's current location using the Geolocation API 
 * (if the user has opted to use their current location) or sets the location to a provided set of coordinates.
 * 
 */
export const fetchCoordinates = async (
    state : MapDataState, 
    dispatch : Dispatch<MapDataAction>
    
    ) => {
        try {
            if (state.displayOptions.useCurrentLocation) {
                const coords = await getCoords()
        
                if (!state.coordinates || state.coordinates.lat !== coords.latitude || state.coordinates.lng !== coords.longitude) {
                   dispatch({ 
                    type: "SET_COORDINATES",
                    payload: {
                        lat: coords.latitude, 
                        lng: coords.longitude }})
                }
                uncheckLocationCheckbox(state,dispatch)

            } else {
                dispatch({ 
                    type: "SET_COORDINATES",
                    payload: state.coordinates || defaultCoordinates,
                })
            }
        } catch (error) {
            dispatch({
                type: "SET_COORDINATES",
                payload: defaultCoordinates,
            })

            uncheckLocationCheckbox(state,dispatch)
    }
}

function uncheckLocationCheckbox(
    state : MapDataState, 
    dispatch : Dispatch<MapDataAction>
) {

    if (state.displayOptions.useCurrentLocation) {
        dispatch({
            type: "SET_DISPLAY_OPTIONS",
            payload: {
                ...state.displayOptions,
                useCurrentLocation: false}
            })
    }
}

/**
 * Fetches observations and user data from the iNaturalist API and updates the corresponding state.
 *
 * The function constructs a request object and sends it as a POST request to the API endpoint.
 * It updates the corresponding states with the data returned from the API or logs an error if the request fails.
 */
export const iNatFetch = async (
    state : MapDataState, 
    dispatch : Dispatch<MapDataAction>

) => {
    const iNatFetchObj : iNatFetchObj = {
        specimenName: state.searchedValue.specimenName ?? '',
        coordinate: state.coordinates ?? defaultCoordinates,
        searchOptions : state.displayOptions
    }

    dispatch({
        type: "SET_LOADING",
        payload: true
    })

    const res = await fetch('api/collections/inaturalist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',  
        },
        body: JSON.stringify(iNatFetchObj) 
    })

    if (res.ok) {
        const json : iNatApiResult = await res.json()
        console.log(json);

        const images : any[] = []
        


        dispatch({
            type: "SET_API_FETCH",
            payload: {
                observations : json.observations,
                images : json.images,
                topIdentifiers : json.leadingUsers.identifiers,
                topObservers : json.leadingUsers.observers,
                loading : false
            }
        })
    } else {
        console.error("Error fetching iNaturalist data:", res.text)
    }
}

/**
 * Sets the credentials for the image gallery's info box 
 * about the currently displaying image. This will be called 
 * on every image change.
 * 
 * @param {number} index the index at what observation we want to set the credentials 
 * @param {iNatUserObservation[]} observations 
 */
export const setCredentials = (
    index: number,
    state : MapDataState, 
    dispatch : Dispatch<MapDataAction>

) => {
    const observation = state.observations[index]

    dispatch({
        type:"SET_CREDENTIALS",
        payload: {
            observer : observation.user.userName,
            observationTitle : observation.species_guess,
            observationDate : observation.observedDate,
            observationLocation : observation.place_guess,
            observationIcon : observation.user.userIcon
        }
    })
}
