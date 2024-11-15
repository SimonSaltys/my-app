/**
 * @file src/app/components/map/navitems/NavButton.tsx
 * 
 * @fileoverview Holds the relative navbar information for the map
 * 
 * @todo 
 */

"use client";

import { Button } from "flowbite-react";

interface NavButtonProps {
  label: string;
  onClick: () => void;
}

export function NavButton({ label, onClick }: NavButtonProps) {
  return (
    <Button className="bg-sea-glass text-black focus:ring-4 focus:ring-dune-grass" onClick={onClick}>
      {label}
    </Button>
  )
}
