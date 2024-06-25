import { create } from "zustand";

type Character = {
  id: number;
  name: string;
  image: string;
  isChecked: boolean;
};

type CharacterStore = {
  selectedCharacters: Character[];
  filteredCharacters: Character[];
  originalCharacters: Character[];
  removeCharacter: (id: number) => void;
  updateCharacterCheck: (id: number, isChecked: boolean) => void;
  toggleCharacterCheck: (character: Character) => void;
  setOriginalCharacters: (characters: Character[]) => void;
  filterCharacters: (query: string) => void;
  refresh: boolean;
  setRefresh: () => void;
};

export const useCharacterStore = create<CharacterStore>((set) => ({
  selectedCharacters: [],
  filteredCharacters: [],
  originalCharacters: [],

  removeCharacter: (id) =>
    set((state) => ({
      selectedCharacters: state.selectedCharacters.filter(
        (character) => character.id !== id
      ),
      filteredCharacters: state.filteredCharacters.filter(
        (character) => character.id !== id
      ),
    })),
  updateCharacterCheck: (id, isChecked) =>
    set((state) => ({
      selectedCharacters: state.selectedCharacters.map((character) =>
        character.id === id ? { ...character, isChecked } : character
      ),
      filteredCharacters: state.filteredCharacters.map((character) =>
        character.id === id ? { ...character, isChecked } : character
      ),
    })),
  toggleCharacterCheck: (character) =>
    set((state) => {
      const isSelected = state.selectedCharacters.some(
        (c) => c.id === character.id
      );
      if (isSelected) {
        return {
          selectedCharacters: state.selectedCharacters.filter(
            (c) => c.id !== character.id
          ),
          filteredCharacters: state.filteredCharacters.map((c) =>
            c.id === character.id ? { ...c, isChecked: false } : c
          ),
        };
      } else {
        return {
          selectedCharacters: [
            ...state.selectedCharacters,
            { ...character, isChecked: true },
          ],
          filteredCharacters: state.filteredCharacters.map((c) =>
            c.id === character.id ? { ...c, isChecked: true } : c
          ),
        };
      }
    }),
  setOriginalCharacters: (characters) =>
    set({
      originalCharacters: characters,
      filteredCharacters: characters,
    }),
  filterCharacters: (query) =>
    set((state) => ({
      filteredCharacters: state.originalCharacters.filter((character) =>
        character.name.toLowerCase().includes(query.toLowerCase())
      ),
    })),
  refresh: false,
  setRefresh: () =>
    set((state) => ({
      refresh: !state.refresh,
    })),
}));
