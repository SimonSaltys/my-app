/**
 * @file src/app/components/map/navitems/NavButton.tsx
 * 
 * @fileoverview Holds the relative navbar information for the map
 * 
 * @todo
 */

"use client"

import { Button } from "flowbite-react"

interface NavButtonProps {
  label: string
  onClick: () => void
}

export function NavButton({ label, onClick }: NavButtonProps) {
  return (
    <Button className="bg-sea-glass text-black active:ring-4 active:ring-chanterelle-gold focus:ring-0 focus:ring-sea-glass" onClick={onClick}>
      {label}
    </Button>
  )
}
