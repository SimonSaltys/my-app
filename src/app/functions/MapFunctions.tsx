/**
 * @file /src/app/functions/MapFunctions.tsx
 * 
 * @fileoverview Contains all the functions for all Map components to use
 * 
 * @todo 
 */

import { LatLngLiteral } from "leaflet";
import { Dispatch, SetStateAction } from "react"
import { iNatApiResult, iNatFetchObj, iNatLeadingUser, iNatUserObservation } from "@/app/api/collections/inaturalist/route"
import { DisplayOptions, SearchValues } from "../components/map/Map";

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
const getCoords = async () => {
    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
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
 * @param {LatLngLiteral} coordinates - The fallback or explicitly set coordinates.
 * @param {DisplayOptions} displayOptions - The current display options, including the `useCurrentLocation` flag.
 * @param {Dispatch<SetStateAction<DisplayOptions>>} setDisplayOptions - Function to update the display options state.
 * @param {Dispatch<SetStateAction<LatLngLiteral>>} setCoordinates - Function to update the coordinates state.
 */
export const fetchCoordinates = async (
    params : fetchCoordinatesParams
    ) => {
        
    if (params.displayOptions.useCurrentLocation) {
        const coords = await getCoords()

        if (!params.coordinates || params.coordinates.lat !== coords.latitude || params.coordinates.lng !== coords.longitude) {
            params.setCoordinates({ lat: coords.latitude, lng: coords.longitude })
        }
            params.setDisplayOptions({
            ...params.displayOptions,
            useCurrentLocation: false,
         })
    } else {
        params.setCoordinates(params.coordinates || defaultCoordinates)
    }
}

/**
 * Fetches observations and user data from the iNaturalist API and updates the corresponding state.
 *
 * The function constructs a request object and sends it as a POST request to the API endpoint.
 * It updates the corresponding states with the data returned from the API or logs an error if the request fails.
 */
export const iNatFetch = async (
   params : iNatFetchParams

) => {
    const iNatFetchObj : iNatFetchObj = {
        specimenName: params.searchedValue.specimenName ?? '',
        coordinate: params.coordinates ?? defaultCoordinates,
        searchOptions : params.displayOptions
    }

    params.setLoading(true)

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
    
        params.setObservations(json.observations)

        params.setImages(json.images)

        params.setTopIdentifiers(json.leadingUsers.identifiers)
    
        params.setTopObservers(json.leadingUsers.observers)

        params.setLoading(false)
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
export const setCredentials = (index: number,

    params : CredentialsParams
) => {
    const observation = params.observations[index]
    params.setObserver(observation.user.userName)
    params.setObservationTitle(observation.species_guess)
    params.setObservationDate(observation.observedDate)
    params.setObservationLocation(observation.place_guess)
    params.setObserverIcon(observation.user.userIcon ?? 'img/blankIcon.jpg')
}

/**
 * Parameters for fetching coordinates of the user, 
 * either where they have clicked or their current location
 * 
 * @param coordinates - The current location of where the map is displaying data
 * @param displayOptions - Options controlling the display of results (only using value `displayOptions.useCurrentLocation`)
 * @param setDisplayOptions
 * @param setCoordinates 
 */
export interface fetchCoordinatesParams {
    coordinates : LatLngLiteral,
    displayOptions : DisplayOptions,
    setDisplayOptions: Dispatch<SetStateAction<DisplayOptions>>,
    setCoordinates: Dispatch<SetStateAction<LatLngLiteral>>
}


/**
 * Parameters for setting the credentials for the currently active observation 
 * in the image gallery
 * 
 * @param observations - The list of currently displaying observations
 * @param observer - The user name of the observer
 * @param observationTitle - What the user named their observation
 * @param observationLocation - The location where the user made their observation
 * @param observationIcon - The users icon on the inat site
 */
export interface CredentialsParams {
    observations : iNatUserObservation[],
    setObserver : Dispatch<SetStateAction<string>>,
    setObservationTitle : Dispatch<SetStateAction<string>>,
    setObservationDate : Dispatch<SetStateAction<string>>,
    setObservationLocation : Dispatch<SetStateAction<string>>,
    setObserverIcon : Dispatch<SetStateAction<string>>
 }

/**
 * Parameters for fetching data from the iNat API
 * 
 * @param  searchedValue - The search parameters, including the name of the specimen to be searched.
 * @param  coordinates - Latitude and longitude representing the search area.
 * @param  displayOptions - Options controlling the display of results (e.g., sorting, filters).
 * @param  setLoading
 * @param  setObservations 
 * @param  setImages 
 * @param  setTopIdentifiers
 * @param  setTopObservers 
 */
export interface iNatFetchParams {
    searchedValue : SearchValues,
    coordinates : LatLngLiteral,
    displayOptions : DisplayOptions,

    setLoading : Dispatch<SetStateAction<boolean>>,
    setObservations : Dispatch<SetStateAction<iNatUserObservation[]>>,
    setImages : Dispatch<SetStateAction<any[]>>,
    setTopIdentifiers : Dispatch<SetStateAction<iNatLeadingUser[]>>,
    setTopObservers : Dispatch<SetStateAction<iNatLeadingUser[]>>
}