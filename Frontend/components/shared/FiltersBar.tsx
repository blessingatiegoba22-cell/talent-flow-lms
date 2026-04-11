"use client";

import { ChevronDown } from "lucide-react";

type Filters = {
  category?: string;
  level?: string;
  duration?: string;
  price?: string;
  sort?: string;
};

type Props = {
  onChange: (key: keyof Filters, value: string) => void;
  currentFilters?: Filters;
};

const FILTERS_OPTIONS = {
  category: ["Design", "Development", "Business"],
  level: ["Beginner", "Intermediate", "Expert"],
  duration: ["Short", "Medium", "Long"],
  price: ["Free", "Paid"],
  sort: ["Rating", "Newest", "Price"],
};

export default function FiltersBar({ onChange, currentFilters }: Props) {
  return (
    <div className="border border-border bg-card px-4 py-3 rounded-md flex flex-wrap gap-4 items-center">
      
      {(Object.keys(FILTERS_OPTIONS) as Array<keyof Filters>).map((key) => (
        <div key={key} className="relative group">
          <select
            onChange={(e) => onChange(key, e.target.value)}
            className="appearance-none bg-transparent flex items-center gap-2 text-sm font-bold text-foreground pl-3 pr-8 py-1.5 rounded-md border border-transparent hover:border-border hover:bg-muted transition cursor-pointer outline-none"
          >
            <option value="">{key.charAt(0).toUpperCase() + key.slice(1)}</option>
            {FILTERS_OPTIONS[key].map((opt) => (
              <option key={opt} value={opt.toLowerCase()}>
                {opt}
              </option>
            ))}
          </select>

          <ChevronDown 
            size={14} 
            className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" 
          />
        </div>
      ))}

    </div>
  );
}