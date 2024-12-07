/**
 * @file /src/app/reducers/MapDataReducer.ts
 * 
 * @fileoverview holds all the state that the children of the `MapClientWrapper` need
 * to use and update 
 * 
 * @todo 
 */

import { LatLngLiteral } from "leaflet"
import { iNatUserObservation, iNatLeadingUser } from "../api/collections/inaturalist/route"
import { DisplayOptions, SearchValues } from "../components/map/Map"
import { defaultCoordinates } from "../functions/MapFunctions"

export interface MapDataState {
    searchedValue : SearchValues
    coordinates : LatLngLiteral,
    displayOptions : DisplayOptions
    activeSection : string,
    loading : boolean,
    images : Image[],
    observations : iNatUserObservation[],
    topObservers : iNatLeadingUser[],
    topIdentifiers : iNatLeadingUser[],
    observer : string,
    observationTitle : string,
    observationLocation : string,
    observationDate : string,
    observationIcon :  string
}

export interface Image {
    original: string, 
    thumbnail: string, 
    small : string
}

export const MapDataInitialState: MapDataState = {
    searchedValue: {
        specimenName: "Poppy", 
        taxonId: -1 
    },

    displayOptions: {
        radius : 75,
        displayAmount : 20,
        beforeDate : "",
        sinceDate : "",
        gradeType : "needs_id,research,casual",
        useCurrentLocation : false },

    coordinates: defaultCoordinates,
    activeSection: "images",
    loading: false,
    images: [],
    observations: [],
    topObservers: [],
    topIdentifiers: [],
    observer: "",
    observationTitle: "",
    observationLocation: "",
    observationDate: "",
    observationIcon: "/img/blankIcon.jpg",
};

export type MapDataAction =
    | { type: "SET_COORDINATES"; payload: LatLngLiteral }
    | { type: "SET_ACTIVE_SECTION"; payload: string }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_API_FETCH"; payload: Partial<Pick<MapDataState, "observations" | "images" | "topIdentifiers" | "topObservers" | "loading">> }
    | { type: "SET_CREDENTIALS"; payload: Partial<Pick<MapDataState, "observer" | "observationTitle" | "observationLocation" | "observationDate" | "observationIcon">> }
    | { type: "SET_DISPLAY_OPTIONS"; payload: DisplayOptions }

    // Add other action types as needed

/**
 * @param state the global state of the map
 * @param action what in the state to update
 * @returns the newly updated state
 */
export default function MapDataReducer(
    state: MapDataState , 
    action: MapDataAction
) : MapDataState {

        switch(action.type) {

            case "SET_COORDINATES":
                return {...state, coordinates : action.payload}
            case "SET_ACTIVE_SECTION":
                return {...state, activeSection : action.payload}
            case "SET_LOADING":
                return {...state, loading : action.payload}
            case "SET_DISPLAY_OPTIONS":
                return {...state, displayOptions : action.payload}
            case "SET_API_FETCH":
                return {...state, ...action.payload }
            case "SET_CREDENTIALS":
                return {...state, ...action.payload }
            default: 
                return state
        }
}