import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  ListRenderItem,
} from "react-native";
import { useRickAndMortyAPI } from "@/hooks/useRickAndMortyAPI";
import { useCharacterStore } from "@/store/useCharacterStore";
import { CheckBox } from "rn-inkpad";
import { AntDesign } from "@expo/vector-icons";
import SearchInput from "./SearchInput";

interface Character {
  id: number;
  name: string;
  image: string;
  episode: string[];
}

const MultiSelectAutocomplete: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const { data, isLoading, error } = useRickAndMortyAPI(query);

  const {
    selectedCharacters,
    filteredCharacters,
    removeCharacter,
    updateCharacterCheck,
    toggleCharacterCheck,
    setOriginalCharacters,
    filterCharacters,
    refresh,
    setRefresh,
  } = useCharacterStore();

  useEffect(() => {
    if (data) {
      setOriginalCharacters(data);
    }
  }, [data, setOriginalCharacters]);

  useEffect(() => {
    filterCharacters(query);
  }, [query, filterCharacters]);

  useEffect(() => {
    filterCharacters(query);
  }, [refresh, filterCharacters]);

  const toggleSelection = useCallback(
    (character: Character) => {
      toggleCharacterCheck(character);
    },
    [toggleCharacterCheck]
  );

  const isSelected = useCallback(
    (character: Character) => {
      const selectedCharacter = selectedCharacters.find(
        (c) => c.id === character.id
      );
      return selectedCharacter ? selectedCharacter.isChecked : false;
    },
    [selectedCharacters]
  );

  const handleRemove = useCallback(
    (character: Character) => {
      updateCharacterCheck(character.id, false);
      removeCharacter(character.id);
      setRefresh();
    },
    [updateCharacterCheck, removeCharacter, setRefresh]
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const charactersToShow = isOpen
    ? selectedCharacters
    : selectedCharacters.slice(0, 2);

  const hasCharactersToShow = charactersToShow.length > 0;

  const truncateText = useCallback((text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  }, []);

  const renderItem: ListRenderItem<Character> = useCallback(
    ({ item }) => (
      <TouchableOpacity className="p-2 border-b border-black">
        <View className="flex flex-row items-center pr-10">
          <CheckBox
            iconColor="blue"
            checked={isSelected(item)}
            onChange={() => toggleSelection(item)}
            title=""
          />
          <Image
            className="h-16 w-16 rounded-md ml-4"
            source={{ uri: item.image }}
          />
          <View className="ml-4">
            <Text>{highlightQuery(item.name, query)}</Text>
            <Text>{item.episode.length} episodes</Text>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [isSelected, toggleSelection, query]
  );

  return (
    <View
      style={{ paddingTop: Platform.OS === "android" ? 20 : 0 }}
      className="flex-1"
    >
      <TouchableOpacity style={{ width: 380 }} className="relative pt-3 m-2 ">
        <View className="border rounded-xl p-2">
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row flex-wrap gap-2">
              {hasCharactersToShow &&
                charactersToShow.map((character) => (
                  <View
                    key={character.id}
                    className="bg-blue-100 rounded-lg border border-blue-200 p-1 flex-row items-center"
                  >
                    <Text className="text-sm">
                      {isOpen
                        ? truncateText(character.name, 15)
                        : truncateText(character.name, 9)}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleRemove(character)}
                      className="bg-blue-300 rounded-lg p-1 ml-2"
                    >
                      <AntDesign name="close" size={17} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
            {!isOpen && (
              <View style={{ flex: 1 }}>
                <SearchInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search"
                  inputStyle="border-2 border-white w-full h-[30px] pl-2.5 mr-2.5 rounded-lg font-bold overflow-hidden pt-0.5"
                />
              </View>
            )}
            <TouchableOpacity
              onPress={toggleOpen}
              style={{
                position: "absolute",
                top: isOpen ? 11 : 5,
                right: 5,
              }}
            >
              <AntDesign
                name={isOpen ? "caretup" : "caretdown"}
                size={20}
                color="black"
              />
            </TouchableOpacity>
          </View>
          {isOpen && (
            <View>
              <SearchInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search"
                inputStyle="border-2 border-white w-full h-[30px] pl-2.5 mb-2.5 font-bold overflow-hidden pt-2"
              />
            </View>
          )}
        </View>
      </TouchableOpacity>

      {query ? (
        <View
          className="border border-black m-2 rounded-lg bg-blue-100 mt-1"
          style={{ height: 650 }}
        >
          {isLoading && <Text>Loading...</Text>}
          {error && <Text>Error: {error.message}</Text>}
          <FlatList
            data={filteredCharacters}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ flexGrow: 1 }}
            maintainVisibleContentPosition={{
              minIndexForVisible: 20,
              autoscrollToTopThreshold: 5,
            }}
            initialScrollIndex={0}
            horizontal={false}
            ListFooterComponent={<View style={{ height: 200 }} />}
          />
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

const highlightQuery = (text: string, query: string) => {
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <Text>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <Text key={index} style={{ fontWeight: "bold" }}>
            {part}
          </Text>
        ) : (
          part
        )
      )}
    </Text>
  );
};

export default MultiSelectAutocomplete;
