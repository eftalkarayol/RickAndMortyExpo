// src/hooks/useRickAndMortyAPI.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchCharacters = async (query: string) => {
  const { data } = await axios.get(
    `https://rickandmortyapi.com/api/character/?name=${query}`
  );
  return data.results;
};

export const useRickAndMortyAPI = (query: string) => {
  return useQuery({
    queryKey: ["characters", query],
    queryFn: () => fetchCharacters(query),
    enabled: !!query,
  });
};
