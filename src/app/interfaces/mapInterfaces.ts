import { LatLngLiteral } from "leaflet"

//When the map first loads it will load here, If there is an error it will also load back to here
export const defaultCoordinates: LatLngLiteral = { lat: 39.35, lng: -120.26 }

/**
 * Value of the searched specimen 
 //todo remove when interfacing with the actual application
 */
 export interface SearchValues {
    specimenName : string | undefined
    taxonId : number 
}

/**
 * The values the user can change 
 * to format their search queries
 */
export interface DisplayOptions {
    radius : number
    displayAmount : number
    beforeDate: string
    sinceDate: string
    gradeType : string
    useCurrentLocation : boolean
}


export interface iNatApiResponse {
    total_results: number
    page: number
    per_page: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    results: any[]
}

//The final result that the MapClientWrapper will use
export interface iNatApiResult {
    observations : iNatUserObservation[] | []
    images : {original : string, thumbnail : string, small : string}[] | []
    leadingUsers : {identifiers : iNatLeadingUser[], observers : iNatLeadingUser[]}
}

//A single observation of the specified specimen by a user
export interface iNatUserObservation {
    user : iNatUser
    observedDate : string
    species_guess : string
    taxon_name : string
    place_guess : string
    coordinates : LatLngLiteral
    gradeType: string 
    images : {original : string, thumbnail : string, small : string}
}

//Represents leading user of either identifier or observation
export interface iNatLeadingUser {
    user : iNatUser
    count : number
}

//Represents a user on the inaturalist site 
export interface iNatUser {
    userName : string
    userId : number
    userIcon: string
}

//The initial search query that will be sent to the inat api
export interface iNatFetchObj {
    specimenName: string
    coordinate : LatLngLiteral  
    searchOptions: DisplayOptions
}

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