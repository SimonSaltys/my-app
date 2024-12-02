import { LatLngLiteral } from "leaflet";
import { Dispatch, SetStateAction } from "react"
import { DisplayOptions } from "../components/map/Map";

export const defaultCoordinates: LatLngLiteral = { lat: 39.35, lng: -120.26 }

export const getCoords = async () => {
    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    
    return {
        longitude: pos.coords.longitude,
        latitude: pos.coords.latitude,
    }
};

export const fetchCoordinates = async (coordinates : LatLngLiteral,
    displayOptions : DisplayOptions,
    setDisplayOptions: Dispatch<SetStateAction<DisplayOptions>>,
    setCoordinates: Dispatch<SetStateAction<LatLngLiteral>>) => {

    if (displayOptions.useCurrentLocation) {
        const coords = await getCoords()

        if (!coordinates || coordinates.lat !== coords.latitude || coordinates.lng !== coords.longitude) {
            setCoordinates({ lat: coords.latitude, lng: coords.longitude })
        }
            setDisplayOptions({
            ...displayOptions,
            useCurrentLocation: false,
         })
    } else {
        setCoordinates(coordinates || defaultCoordinates)
    }
}

//todo add inat fetch here