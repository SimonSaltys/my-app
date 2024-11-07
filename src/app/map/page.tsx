"use client";
import dynamic from 'next/dynamic';
const MapClientWrapper = dynamic(() => import("@/app/components/map/MapClientWrapper"), {
    // ssr: false 
});
export default function MapPage() {

    return (
         <MapClientWrapper/>
    );
}
