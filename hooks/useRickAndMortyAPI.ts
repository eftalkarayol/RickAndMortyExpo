import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Tipleri tanımla
export default interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;

  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

const fetchCharacters = async (query: string): Promise<Character[]> => {
  try {
    const { data } = await axios.get(
      `https://rickandmortyapi.com/api/character/?name=${query}`
    );
    return data.results;
  } catch (error) {
    throw new Error("Error fetching characters");
  }
};

export const useRickAndMortyAPI = (query: string) => {
  return useQuery({
    queryKey: ["characters", query],
    queryFn: () => fetchCharacters(query),
    enabled: !!query, // Query'in boş olup olmadığını kontrol eder
  });
};
