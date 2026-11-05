import {useEffect, useState } from "react";
import { searchCities } from "../services/geocodingService";
import type { LocationCoord } from "../types/stargazing";

interface Props {
  onSelectLocation: (location: LocationCoord) => void;
}

function SearchBox(props: Props) {
  const [query, setQuery] = useState<string>("")
  const [results, setResults] = useState<LocationCoord[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)


  useEffect(() => {
    if (query.trim().length < 2) {
      setIsOpen(false)
      return 
    }
    const timer = setTimeout(async () => {
      setIsLoading(true);
      const cities = await searchCities(query);
      setResults(cities);
      setIsLoading(false);
      setIsOpen(true);
    }, 500)
    return () => clearTimeout(timer);
  }
    , [query])


  function handleSelect(city: LocationCoord) {
    props.onSelectLocation(city);
    setQuery(city.location_name ?? "");
    setIsOpen(false);
  }

  
  return (
    <div>
      <input value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter location..."
      />

      {isLoading && <div>Loading...</div>}

      {isOpen && (
        <ul>
          {results.map((city, index) => (
            <li key={index} onClick={() => handleSelect(city)}>
              {city.location_name}
            </li>
          ))}
        </ul>
      )}
    </div>  
  );
}
export default SearchBox;