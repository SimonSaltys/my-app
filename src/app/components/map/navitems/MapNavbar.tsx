/**
 * @file src/app/components/map/MapNavbar.tsx
 * 
 * @fileoverview Holds the relative navbar information for the map
 * 
 * @todo make it tell the map client what to display
 */
"use client"

//default imports
import { Dispatch, SetStateAction } from "react";
import { Navbar, Button } from "flowbite-react";
import { NavButton } from "./NavButton";

interface MapNavbarProps {
    setActiveSection : Dispatch<SetStateAction<string>> 
  }

export function MapNavbar({ setActiveSection } : MapNavbarProps) {

    const handleClick = (section : string) => {

    }


    return (
        <Navbar className="h-[7vh] bg-old-growth-green py-2 px-4" fluid rounded border>
            <div className="flex justify-evenly items-center w-full lg:hidden">
                <NavButton label="Locations" onClick={() => handleClick("Locations")} />
                <NavButton label="Images" onClick={() => handleClick("Images")} />
                <NavButton label="Leader Board" onClick={() => handleClick("Leader Board")} />
            </div>
        </Navbar>
    );
}

