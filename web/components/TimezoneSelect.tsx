"use client";

import {
  getLocalTimezone,
  getTimezones,
  type TimezoneOption,
} from "@/lib/timezone";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface TimezoneSelectProps {
  value?: string;
  onSelect: (timezone: string) => void;
}

export default function TimezoneSelect({
  value,
  onSelect,
}: TimezoneSelectProps) {
  const [timezones, setTimezones] = useState<TimezoneOption[]>([]);
  const [selectedTimezone, setSelectedTimezone] = useState(
    value || getLocalTimezone()
  );

  useEffect(() => {
    setTimezones(getTimezones());
  }, []);

  const handleSelect = (timezone: string) => {
    setSelectedTimezone(timezone);
    onSelect(timezone);
  };

  return (
    <Select value={selectedTimezone} onValueChange={handleSelect}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select timezone" />
      </SelectTrigger>
      <SelectContent className="max-h-[40vh] overflow-y-auto">
        {timezones.map((tz) => (
          <SelectItem key={tz.value} value={tz.value}>
            {tz.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
