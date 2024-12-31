import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ChevronDown } from "lucide-react";
import SearchResultsCard from "./searchResultsCard/SearchResultsCard";
import { useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";

export default function SearchResults() {
  const location = useLocation();
  const { searchResults = [], query = '' } = location.state || {};

  console.log("SearchResults state:", location.state);

  return (
    <div className="container">
      <div className="flex w-full max-w-sm items-center mt-8">
        <Input type="text" placeholder="Paracetamol" defaultValue={query} />
        <Button type="submit">Search</Button>
      </div>
      <h2 className="my-4 font-bold text-3xl">Results for: {query}</h2>
      <div className="flex gap-8 mb-5">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center text-sm lg:text-base pr-5 text-gray-700 gap-4 border-r-2 border-r-gray-700">
            Filter by price <ChevronDown className="w-5 h-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>10birr-100birr</DropdownMenuItem>
            <DropdownMenuItem>100birr-200birr</DropdownMenuItem>
            <DropdownMenuItem>200birr-300birr</DropdownMenuItem>
            <DropdownMenuItem>300birr-400birr</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex text-sm items-center pr-5 text-gray-700 gap-4 border-r-2 border-r-gray-700">
            Filter by location <ChevronDown className="w-5 h-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>4 kilo</DropdownMenuItem>
            <DropdownMenuItem>Legehar</DropdownMenuItem>
            <DropdownMenuItem>Megenagna</DropdownMenuItem>
            <DropdownMenuItem>Mexico</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-col gap-8 md:flex-row flex-wrap mb-80">
        <Separator />
        {searchResults.length === 0 ? (
          <p>No results found</p>
        ) : (
          searchResults.map((result, index) => {
            if (!result || !result.pharmacyName || !result.address) {
              console.error(`Invalid result at index ${index}`, result);
              return null;
            }
            return (
              <SearchResultsCard
                key={index}
                pharmacyName={result.pharmacyName}
                address={result.address}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
