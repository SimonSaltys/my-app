/**
 * @file src/app/components/map/LeaderBoard.tsx
 * 
 * @fileoverview Displays the top observers and identifiers of the species
 * 
 * @todo
 */

"use client"

import React from "react"

/**
 * LeaderBoard component
 * 
 * This component displays the top observers and identifiers for a specific species, 
 * based on data passed in as props.
 * 
 * @param {Object} props - The component's props.
 * @param {Array} props.identifiers - An array of top identifiers for the species. Each entry in the array
 *                                     contains data about an individual identifier.
 * @param {Array} props.observers - An array of top observers for the species. Each entry in the array
 *                                   contains data about an individual observer.
 * 
 * @returns {JSX.Element} A JSX element representing the LeaderBoard component.
 */
export function LeaderBoard(props : {identifiers : any[] | undefined, observers : any[] | undefined}): JSX.Element {

    return(
        <>
        { props.observers &&
            <div className="grid grid-cols-3 w-[95%] h-[45%] my-4 rounded-lg">
                 <div className="flex border-b justify-center items-center">#</div>
                 <div className="flex border-b justify-center items-center">Observer</div>
                 <div className="flex border-b justify-center items-center">Observations</div>

                 {props.observers.map((observer, index) => (
                        <React.Fragment key={index}>
                            <div className="flex justify-center items-center">{index + 1}</div>
                            <div className="flex justify-center items-center">{observer.user.login_exact}</div>
                            <div className="flex justify-center items-center">{observer.observation_count}</div>
                        </React.Fragment>
                    ))}

            </div>
        }

        { props.identifiers &&
             <div className="grid grid-cols-3 w-[95%] h-[45%] my-4 rounded-lg">
                 <div className="flex border-b justify-center items-center">#</div>
                 <div className="flex border-b justify-center items-center">Identifier</div>
                 <div className="flex border-b justify-center items-center">Identifications</div>


                 {props.identifiers.map((identifier, index) => (
                        <React.Fragment key={index}>
                            <div className="flex justify-center items-center">{index + 1}</div>
                            <div className="flex justify-center items-center">{identifier.user.login_exact}</div>
                            <div className="flex justify-center items-center">{identifier.count}</div>
                        </React.Fragment>
                    ))}
             </div>
        }
        </>
    )
}