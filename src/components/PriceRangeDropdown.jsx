import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

function PriceRangeDropdown({ onSelect }) {
  const priceRanges = [
    { label: "Below $10", value: [0, 10] },
    { label: "$10 - $50", value: [10, 50] },
    { label: "$50 - $100", value: [50, 100] },
    { label: "Above $100", value: [100, Infinity] },
  ];

  const handleSelect = (range) => {
    onSelect(range);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Filter by Price</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {priceRanges.map((range) => (
          <DropdownMenuItem
            key={range.label}
            onClick={() => handleSelect(range.value)}
          >
            {range.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default PriceRangeDropdown;
