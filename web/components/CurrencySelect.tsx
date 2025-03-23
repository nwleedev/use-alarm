"use client";

import { currencies, getLocalCurrency } from "@/lib/currency";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface CurrencySelectProps {
  value?: string;
  onSelect: (currency: string) => void;
}

export default function CurrencySelect({
  value,
  onSelect,
}: CurrencySelectProps) {
  const [selectedCurrency, setSelectedCurrency] = useState(
    value || getLocalCurrency()
  );

  const handleSelect = (currency: string) => {
    setSelectedCurrency(currency);
    onSelect(currency);
  };

  return (
    <Select value={selectedCurrency} onValueChange={handleSelect}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select currency" />
      </SelectTrigger>
      <SelectContent className="max-h-[40vh] overflow-y-auto">
        {currencies.map((currency) => (
          <SelectItem key={currency.code} value={currency.code}>
            {currency.symbol} - {currency.name} ({currency.code})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
