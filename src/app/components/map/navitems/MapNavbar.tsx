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
    activeSelection : string
  }

export function MapNavbar({ setActiveSection, activeSelection } : MapNavbarProps) {

    const handleClick = (section : string) => {
            setActiveSection(section)
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

