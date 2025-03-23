"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface TimeSelectProps {
  value?: number;
  onSelect: (hour: number) => void;
}

export default function TimeSelect({ value = 9, onSelect }: TimeSelectProps) {
  // Generate 24 hours (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, "0")}:00`;
  };

  return (
    <Select
      value={value.toString()}
      onValueChange={(val) => onSelect(parseInt(val))}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select notification time" />
      </SelectTrigger>
      <SelectContent className="max-h-[40vh] overflow-y-auto">
        {hours.map((hour) => (
          <SelectItem key={hour} value={hour.toString()}>
            {formatHour(hour)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
