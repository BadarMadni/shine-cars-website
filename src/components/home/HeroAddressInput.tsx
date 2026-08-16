"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { PenLine, Search } from "lucide-react";

interface PlaceData { address: string; lat: number; lng: number }

export default function HeroAddressInput({ id, placeholder, icon, iconBg, ready, onSelect, onDetailsChange }: {
  id: string; placeholder: string; icon: React.ReactNode; iconBg: string;
  ready: boolean; onSelect: (p: PlaceData) => void;
  onDetailsChange?: (details: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const acRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [manual, setManual] = useState(false);
  const [details, setDetails] = useState("");

  const handlePlace = useCallback(() => {
    const place = acRef.current?.getPlace();
    if (place?.geometry?.location) {
      const name = place.name || "";
      const formatted = place.formatted_address || "";
      const address = name && formatted && !formatted.toLowerCase().includes(name.toLowerCase())
        ? `${name}, ${formatted}` : formatted || name;
      onSelect({ address, lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
    }
  }, [onSelect]);

  useEffect(() => {
    if (!ready || !inputRef.current || acRef.current || manual) return;
    const ac = new google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "gb" },
      fields: ["formatted_address", "geometry", "name"],
    });
    ac.addListener("place_changed", handlePlace);
    acRef.current = ac;
  }, [ready, handlePlace, manual]);

  const toggleManual = () => {
    setManual((m) => !m);
    acRef.current = null;
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 border border-white/10 focus-within:border-gold/40 transition-colors">
        <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <label htmlFor={id} className="sr-only">{placeholder}</label>
        <input ref={inputRef} id={id} type="text" placeholder={manual ? "Type full address..." : placeholder}
          onChange={manual ? (e) => onSelect({ address: e.target.value, lat: 0, lng: 0 }) : undefined}
          className="bg-transparent text-white text-sm placeholder:text-white/35 outline-none w-full" />
        <button type="button" onClick={toggleManual} title={manual ? "Search address" : "Type manually"}
          className="shrink-0 p-1.5 rounded-lg text-white/30 hover:text-gold hover:bg-white/10 transition-colors cursor-pointer">
          {manual ? <Search className="w-3.5 h-3.5" /> : <PenLine className="w-3.5 h-3.5" />}
        </button>
      </div>
      {manual && (
        <input type="text" value={details} placeholder="Building, flat, landmark (optional)"
          onChange={(e) => { setDetails(e.target.value); onDetailsChange?.(e.target.value); }}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-xs placeholder:text-white/25 outline-none focus:border-gold/30" />
      )}
    </div>
  );
}
