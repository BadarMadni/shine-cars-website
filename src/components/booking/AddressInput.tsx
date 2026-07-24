"use client";

import { useRef, useEffect } from "react";

interface AddressInputProps {
  id: string;
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
}

export default function AddressInput({
  id,
  label,
  placeholder,
  icon,
  onPlaceSelect,
}: AddressInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!inputRef.current || !window.google?.maps?.places) return;
    if (autocompleteRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "gb" },
      fields: ["formatted_address", "geometry", "name"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place?.geometry) onPlaceSelect(place);
    });

    autocompleteRef.current = autocomplete;
  }, [onPlaceSelect]);

  return (
    <div>
      <label htmlFor={id} className="block text-navy/70 text-sm font-medium mb-1.5">
        {label}
      </label>
      <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 border border-gray-200 focus-within:border-crimson/50 transition-colors">
        <div className="shrink-0">{icon}</div>
        <input
          ref={inputRef}
          id={id}
          type="text"
          placeholder={placeholder}
          className="bg-transparent text-navy text-sm outline-none w-full placeholder:text-navy/35"
        />
      </div>
    </div>
  );
}
