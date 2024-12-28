 import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList, CommandSeparator } from "./ui/command";
import { cn } from "@/lib/utils";
import { CommandItem } from "cmdk";

 
export default function StoreSwitcher({
    // className,
    items=[]
}){
    // const params = useParams();
 
    // const router = useRouter();

    const formatedItems = items.map((item)=>({
        label: item.name,
        value: item._id
    }));

    // to show the selected store
    // const currentStore = formatedItems.find((item)=> item.value === params.storeid);

    const [open, setOpen] = useState(false)
    const [selectedMedicine, setSElectedMedicne] = useState();

    const onStoreSelect = (store) => {
        setOpen(false);
        //// set the image // set the medine
        setSElectedMedicne()
    }
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button 
                    variant="outline" 
                    size='sm' 
                    role="combobox" 
                    aria-expanded={open} 
                    aria-label="Select a store"
                    className={cn("w-[200px] justify-between", className)}
                >
                    <StoreIcon  className="mr-2 h-4 w-4"/>
                    {selectedMedicine?selectedMedicine:"Select a Medicine"}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Serach medicine .."/>
                        <CommandEmpty>No store found.</CommandEmpty>
                        <CommandGroup heading="Stores">
                            {formatedItems.map((store) =>(
                                <CommandItem
                                    key={store.value}
                                    onSelect={()=>{onStoreSelect(store)}}
                                    className="flex items-center p-2 text-sm cursor-pointer"
                                >
                                    <Pill className="mr-2 h-4 w-4" />
                                    {store.label}
                                    <Check 
                                        className={cn(
                                            'ml-auto h-4 w-4',
                                            currentStore?.value === store.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    /> 
                                </CommandItem>
                            ) )}  
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator />
                    <CommandList>
                        <CommandGroup>
                            <CommandItem
                                onSelect={() => {
                                    setOpen(false);
                                    StoreModal.onOpen();
                                }}
                                className="flex items-center p-2 text-sm cursor-pointer"
                            >
                                <PlusCircle className="mr-2 w-5 h-5" />
                                Create Store
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
    
}