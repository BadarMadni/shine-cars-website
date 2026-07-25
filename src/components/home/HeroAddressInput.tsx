"use client";

import { useRef, useEffect, useCallback } from "react";

interface PlaceData { address: string; lat: number; lng: number }

export default function HeroAddressInput({ id, placeholder, icon, iconBg, ready, onSelect }: {
  id: string; placeholder: string; icon: React.ReactNode; iconBg: string;
  ready: boolean; onSelect: (p: PlaceData) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const acRef = useRef<google.maps.places.Autocomplete | null>(null);
  const handlePlace = useCallback(() => {
    const place = acRef.current?.getPlace();
    if (place?.geometry?.location) {
      const name = place.name || "";
      const formatted = place.formatted_address || "";
      const address = name && formatted && !formatted.toLowerCase().includes(name.toLowerCase())
        ? `${name}, ${formatted}` : formatted || name;
      onSelect({
        address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  }, [onSelect]);

  useEffect(() => {
    if (!ready || !inputRef.current || acRef.current) return;
    const ac = new google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "gb" },
      fields: ["formatted_address", "geometry", "name"],
    });
    ac.addListener("place_changed", handlePlace);
    acRef.current = ac;
  }, [ready, handlePlace]);

  return (
    <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 border border-white/10 focus-within:border-gold/40 transition-colors">
      <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <label htmlFor={id} className="sr-only">{placeholder}</label>
      <input ref={inputRef} id={id} type="text" placeholder={placeholder}
        className="bg-transparent text-white text-sm placeholder:text-white/35 outline-none w-full" />
    </div>
  );
}
