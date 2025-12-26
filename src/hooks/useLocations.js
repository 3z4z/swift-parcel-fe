import { useEffect, useState } from "react";

export default function useLocations() {
  const [locations, setLocations] = useState([]);
  useEffect(() => {
    fetch("/data/locations.json")
      .then((res) => res.json())
      .then((data) => setLocations(data));
  }, []);
  return locations;
}
