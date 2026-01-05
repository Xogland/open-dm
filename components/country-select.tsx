"use client";

import { useEffect, useState } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import Image from "next/image";
// NOTE: Assuming the 'countries' import is correct and provides the data structure needed
import { countries } from "country-codes-flags-phone-codes";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Country {
  name: string;
  flag: string;
  code: string;
  dialCode: string;
}

const countryOptions = countries.map((country: Country) => ({
  value: country.code, // e.g., "US"
  label: country.name,
  flag: country.flag,
  dialCode: country.dialCode,
  code: country.code,
}));

// Finds the US code to use as the default value.
const US_CODE = countryOptions.find((c) => c.code === "US")?.code || "";

const Flag = ({ flag }: { flag: string }) => {
  // Ensure the flag code is lowercased for the CDN URL
  const src = `https://cdnjs.cloudflare.com/ajax/libs/flag-icons/7.5.0/flags/4x3/${flag.toLowerCase()}.svg`;
  return (
    <Image
      src={src}
      alt={flag}
      width={20} // Adjusted width for better control
      height={15} // Adjusted height
      className="object-cover rounded-xs"
    />
  );
};

export default function Component({
  value = US_CODE,
  onChange,
  // clickable = true, // Removed unused
  expanded = false,
}: {
  value?: string;
  onChange: (value: string) => void;
  clickable?: boolean;
  expanded?: boolean;
}) {
  console.log(value);
  // const id = useId(); // Removed unused
  const [open, setOpen] = useState<boolean>(false);

  const totalCountries = countryOptions.length;

  const selectedCountry = countryOptions.find(
    (country) => country.value === value,
  );

  // Optional: Log total once for debugging (runs on mount)
  useEffect(() => {
    console.log(`Total countries available: ${totalCountries}`);
  }, [totalCountries]);

  return (
    <div className="">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex items-center border-b border-primary/50 px-2 cursor-pointer py-2">
            <div className="flex items-center gap-2 flex-1">
              {selectedCountry ? (
                <>
                  {/* 2. ONLY SHOW FLAG ON SELECT */}
                  <span className="shrink-0 w-5 h-4 flex items-center justify-center">
                    {/* 3. ENSURE FLAG FIT WIDTH */}
                    <Flag flag={selectedCountry.code} />
                  </span>
                  {expanded ? (
                    <span className="ml-2">{selectedCountry.label}</span>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <span className="text-muted-foreground truncate">
                  Select country
                </span>
              )}
            </div>
            <ChevronDownIcon
              size={16}
              className="text-muted-foreground/80"
              aria-hidden="true"
            />
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countryOptions.map((country) => (
                  <CommandItem
                    key={country.value}
                    value={country.value}
                    onSelect={(currentValue) => {
                      setOpen(false);
                      onChange(currentValue);
                    }}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Flag inside the dropdown list */}
                      <span className="shrink-0 w-5 h-4 flex items-center justify-center">
                        <Flag flag={country.code} />
                      </span>
                      <span className="truncate">{country.label}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Dial Code */}
                      <span className="text-sm text-muted-foreground font-mono">
                        {country.dialCode}
                      </span>
                      {/* Checkmark */}
                      {value === country.value && (
                        <CheckIcon size={16} className="text-primary" />
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
