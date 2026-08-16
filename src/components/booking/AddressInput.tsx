"use client";

import { useRef, useEffect, useState } from "react";
import { PenLine, Search } from "lucide-react";

interface AddressInputProps {
  id: string;
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  onManualAddress?: (address: string) => void;
  onDetailsChange?: (details: string) => void;
}

export default function AddressInput({
  id, label, placeholder, icon, onPlaceSelect, onManualAddress, onDetailsChange,
}: AddressInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const acRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [manual, setManual] = useState(false);
  const [details, setDetails] = useState("");

  useEffect(() => {
    if (!inputRef.current || !window.google?.maps?.places || manual) return;
    if (acRef.current) return;
    const ac = new google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "gb" },
      fields: ["formatted_address", "geometry", "name"],
    });
    ac.addListener("place_changed", () => {
      const place = ac.getPlace();
      if (place?.geometry) onPlaceSelect(place);
    });
    acRef.current = ac;
  }, [onPlaceSelect, manual]);

  const toggleManual = () => {
    setManual((m) => !m);
    acRef.current = null;
    setDetails("");
    onDetailsChange?.("");
  };

  const fieldCls = "flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 border border-gray-200 focus-within:border-crimson/50 transition-colors";

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-navy/70 text-sm font-medium mb-1.5">{label}</label>
      <div className={fieldCls}>
        <div className="shrink-0">{icon}</div>
        <input ref={inputRef} id={id} type="text"
          placeholder={manual ? "Type full address..." : placeholder}
          onChange={manual ? (e) => onManualAddress?.(e.target.value) : undefined}
          className="bg-transparent text-navy text-sm outline-none w-full placeholder:text-navy/35" />
        <button type="button" onClick={toggleManual} title={manual ? "Search address" : "Type manually"}
          className="shrink-0 p-1.5 rounded-lg text-navy/30 hover:text-crimson hover:bg-gray-100 transition-colors cursor-pointer">
          {manual ? <Search className="w-3.5 h-3.5" /> : <PenLine className="w-3.5 h-3.5" />}
        </button>
      </div>
      {manual && (
        <input type="text" value={details} placeholder="Building, flat, landmark (optional)"
          onChange={(e) => { setDetails(e.target.value); onDetailsChange?.(e.target.value); }}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-navy text-xs placeholder:text-navy/30 outline-none focus:border-crimson/30" />
      )}
    </div>
  );
}
