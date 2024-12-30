import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Store as StoreIcon } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList, CommandSeparator } from "./ui/command";
import { cn } from "@/lib/utils";
import { CommandItem } from "cmdk";
import { Pill } from "lucide-react";

export default function Dropdown({ medicines, onSelect }) {
  const [open, setOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const formatedMedicines = medicines.map((item) => ({
    label: item.name,
    value: item._id,
  }));

  const onStoreSelect = (medicine) => {
    setOpen(false); // Close the popover
    setSelectedMedicine(medicine); // Set the selected medicine object
    onSelect(medicine.value); // Call onSelect with the medicine ID
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="dropdown"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a medicine"
          className={"w-[200px] justify-between block"}
        >
          {selectedMedicine ? selectedMedicine.label : "Select a Medicine"}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search medicine..." />
            <CommandEmpty>No medicine found.</CommandEmpty>
            <CommandGroup heading="Medicines">
              {formatedMedicines.map((medicine) => (
                <CommandItem
                  key={medicine.value}
                  onSelect={() => onStoreSelect(medicine)}
                  className="flex items-center p-2 text-sm cursor-pointer"
                >
                  <Pill className="mr-2 h-4 w-4" />
                  {medicine.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedMedicine?.value === medicine.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
        </Command>
      </PopoverContent>
    </Popover>
  );
}
