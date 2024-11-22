import { LatLngLiteral } from 'leaflet';
import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

export default function RecenterMap(props: {position : LatLngLiteral})  {
    const map = useMap();

    useEffect(() => {
        if (props.position) {
            map.setView([props.position.lat, props.position.lng], map.getZoom());
        }
    }, [props.position, map]);

    return null;
};
