/**
 * @file /src/app/api/collections/inaturalist/route.tsx
 * 
 * @fileoverview the route for getting all data for the {@link MapClientWrapper} component
 * 
 * @todo 
 */

import { DisplayOptions } from '@/app/components/map/Map';
import { LatLngLiteral } from 'leaflet';
import { NextResponse } from 'next/server';
import { fetchSpecimenObservations } from "@/app/api/fetchFunctions"


export interface iNatApiResponse {
    total_results: number
    page: number
    per_page: number
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



export const iNatUrl = (fetchObj: iNatFetchObj): string => {
    const { specimenName, coordinate, searchOptions } = fetchObj;

    const params = new URLSearchParams();
    params.set("taxon_name", encodeURIComponent(specimenName));
    params.set("lat", coordinate.lat.toString());
    params.set("lng", coordinate.lng.toString());
    params.set("radius", searchOptions.radius.toString());
    params.set("quality_grade", searchOptions.gradeType);

    
    if (searchOptions.sinceDate != '') 
        params.set("d1", new Date(searchOptions.sinceDate).toISOString())
    

    if (searchOptions.beforeDate != '') 
         params.set("d2", new Date(searchOptions.beforeDate).toISOString())

    return `https://api.inaturalist.org/v1/observations?${params.toString()}`;
};

export const iNatLeaderUrl = (fetchObj: iNatFetchObj, type: string): string => {
    const { specimenName, coordinate, searchOptions } = fetchObj;

    const params = new URLSearchParams();
    params.set("taxon_name", encodeURIComponent(specimenName));
    params.set("lat", coordinate.lat.toString());
    params.set("lng", coordinate.lng.toString());
    params.set("radius", searchOptions.radius.toString());
    params.set("quality_grade", searchOptions.gradeType);

    if (searchOptions.sinceDate != '') 
        params.set("d1", new Date(searchOptions.sinceDate).toISOString())
    

    if (searchOptions.beforeDate != '') 
         params.set("d2", new Date(searchOptions.beforeDate).toISOString())

    return `https://api.inaturalist.org/v1/observations/${type}?${params.toString()}`;
};

export async function POST(request: Request) {
    
    try {
        const data = await request.json();
    
        const { specimenName, coordinate, searchOptions } = data;
    
        // Validate input
        if (!specimenName || !coordinate || !searchOptions) 
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    
        const observations = await fetchSpecimenObservations(specimenName, coordinate, searchOptions);

        return NextResponse.json(observations, { status: 200 });

    } catch (error) {
        console.error("Error in POST handler:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
