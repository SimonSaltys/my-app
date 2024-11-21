import { iNatApiResponse, iNatApiResult, iNatFetchObj, iNatLeaderUrl, iNatLeadingUser, iNatUrl, iNatUserObservation } from "./collections/inaturalist/route"
import { DisplayOptions } from "../components/map/Map"
import L, { LatLngLiteral } from 'leaflet'

export const basicFetch = async <ReturnType>(endpoint: string): Promise<ReturnType> => {
    const response: Response = await fetch(endpoint, { next: { revalidate: 86400 } })
    if (!response.ok) throw new Error('Error with fetching endpoint: ' + endpoint)
  
    const data: ReturnType = await response.json()
  
    return data
  };

export const fetchSpecimenObservations = async (specimenName: string, coordinate : LatLngLiteral, searchOptions: DisplayOptions): Promise<iNatApiResult> => {
    if (!specimenName || !searchOptions || !coordinate) return { observations: [], images: [], leadingUsers : {identifiers : [], observers : []} }

    const fetchObj: iNatFetchObj = {
        specimenName: specimenName,
        coordinate: coordinate,
        searchOptions: searchOptions,
    }

    const endpoint = iNatUrl(fetchObj)
    
    const response : iNatApiResponse = await basicFetch<iNatApiResponse>(endpoint)
    

    if(!response) return { observations: [], images: [], leadingUsers : {identifiers : [], observers : []} }


    const observedSpecimenArray : iNatUserObservation[] = []
    const imageArray :  {original : string, thumbnail : string, small : string}[] = []

    for(let result of response.results) {
        if(!result.photos[0] || !result.geojson.coordinates)
            continue

        const image = result.photos[0]?.url.replace('square', 'large');
        const imageSmall = result.photos[0]?.url.replace('square', 'small');

        const specimenInfo : iNatUserObservation  = {
            user : {
                userName: result.user.login,
                userId: result.user.id,
                userIcon: result.user.icon ?? 'img/blankIcon.jpg'
            },

            //add more default values if the ?? fails
            observedDate: result.observed_on_details.date ?? '',
            species_guess: result.species_guess ?? specimenName,
            taxon_name: result.taxon.preferred_common_name ?? specimenName,
            place_guess: result.place_guess ?? '',
            gradeType: result.quality_grade,
            coordinates: {lat : result.geojson.coordinates[0], lng : result.geojson.coordinates[1]},
            images:  {original: image, thumbnail: result.photos[0].url, small : imageSmall}
        }
        observedSpecimenArray.push(specimenInfo)
        imageArray.push(specimenInfo.images)
    }

    const leadingUsers = await getLeadingUsers(fetchObj)

    return { 
        observations: observedSpecimenArray, 
        images: imageArray, 
        leadingUsers : {identifiers : leadingUsers.identifiers,
                        observers : leadingUsers.observers} }
}


const getLeadingUsers = async (fetchObj : iNatFetchObj): 
    Promise<{identifiers : iNatLeadingUser[], observers : iNatLeadingUser[]}> => {

    const endpointObservers = iNatLeaderUrl(fetchObj,'observers')
    const endpointIdentifiers = iNatLeaderUrl(fetchObj,'identifiers')

    
    const responseObservers : iNatApiResponse = await basicFetch<iNatApiResponse>(endpointObservers)
    const responseIdentifiers : iNatApiResponse = await basicFetch<iNatApiResponse>(endpointIdentifiers)

    if(!responseObservers || !responseIdentifiers) 
        return {identifiers: [], observers: []}

    const leadingIdentifiers : iNatLeadingUser[] = [];
    const leadingObservers : iNatLeadingUser[] = [];

    //populate observers
    const obvResult = responseObservers.results;
    for(let i = 0; i < 10; i++) {
        const leader : iNatLeadingUser = {
            user: {
                userName: obvResult[i]?.user?.login ?? '',
                userId: obvResult[i]?.user?.id ?? -1,    
                userIcon: obvResult[i]?.user?.icon ?? '',  
            },
            count: obvResult[i]?.observation_count ?? 0 
        }
        leadingObservers.push(leader)
    }

    //populate leaders
    const idResult = responseIdentifiers.results;
    for(let i = 0; i < 10; i++) {
        const leader : iNatLeadingUser = {
            user: {
                userName: idResult[i]?.user?.login ?? '',
                userId: idResult[i]?.user?.id ?? -1,    
                userIcon: idResult[i]?.user?.icon ?? '',  
            },
            count: idResult[i]?.count ?? 0 
        }
        leadingIdentifiers.push(leader)
    }

    return {identifiers : leadingIdentifiers, observers : leadingObservers}
}
