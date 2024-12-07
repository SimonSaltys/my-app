/**
 * @file src/app/components/map/MapNavbar.tsx
 * 
 * @fileoverview Holds the relative navbar information for the map
 * 
 * @todo
 */
"use client"

//default imports
import { useContext } from "react";
import { Navbar } from "flowbite-react";
import { NavButton } from "./NavButton";
import { MapContext, MapContextData } from "../MapClientWrapper";

/**
 * @description The header for the MapClientWrapper component, 
 * when this component gets smaller it is responsible for what is currently 
 * being displayed in the wrapper.
 * 
 * @returns a JSX component for the header
 */
export function MapNavbar() {
    const context = useContext(MapContext) as MapContextData

    const handleClick = (section : string) => {
            context.dispatch({
                type:"SET_ACTIVE_SECTION",
                payload: section
            })
    }


    return (
        <Navbar className="bg-old-growth-green py-2 px-4 min-h-[60px]" fluid rounded border>
            <div className="flex justify-evenly items-center w-full lg:hidden">
                <NavButton label="Locations" onClick={() => handleClick("locations")} />
                <NavButton label="Images" onClick={() => handleClick("images")} />
                <NavButton label="Leader Board" onClick={() => handleClick("leaderboard")} />
            </div>
        </Navbar>
    );
}

