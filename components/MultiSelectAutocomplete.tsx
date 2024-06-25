import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import { useRickAndMortyAPI } from "@/hooks/useRickAndMortyAPI";
import { useCharacterStore } from "@/store/useCharacterStore";
import { CheckBox } from "rn-inkpad";
import AntDesign from "@expo/vector-icons/AntDesign";

const MultiSelectAutocomplete = () => {
  const [query, setQuery] = useState("");
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

  const toggleSelection = (character) => {
    toggleCharacterCheck(character);
  };

  const isSelected = (character) => {
    const selectedCharacter = selectedCharacters.find(
      (c) => c.id === character.id
    );
    return selectedCharacter ? selectedCharacter.isChecked : false;
  };

  const handleRemove = (character) => {
    updateCharacterCheck(character.id, false);
    removeCharacter(character.id);
    setRefresh();
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const charactersToShow = isOpen
    ? selectedCharacters
    : selectedCharacters.slice(0, 2);

  const hasCharactersToShow = charactersToShow.length > 0;

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <View
      style={{ paddingTop: Platform.OS === "android" && 20 }}
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
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search"
                  className="border-2 fw-bold pt-1 h-8 w-44 mr-32 border-white rounded-lg mb-2"
                  multiline={false}
                  numberOfLines={1}
                  style={{
                    borderWidth: 2,
                    height: 30,
                    width: "100%",
                    paddingLeft: 10,
                    borderColor: "white",
                    borderRadius: 8,
                    marginRight: 10,
                    fontWeight: "bold",
                    overflow: "hidden",
                  }}
                />
              </View>
            )}
            <TouchableOpacity
              onPress={toggleOpen}
              style={{
                position: "absolute",
                top: isOpen ? 11 : 8,
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
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search"
                className="border-2 w-44 border-white pt-2"
                multiline={false}
                numberOfLines={1}
                style={{
                  borderWidth: 2,
                  height: 30,
                  width: "100%",
                  paddingLeft: 10,
                  marginBottom: 10,
                  fontWeight: "bold",
                  overflow: "hidden",
                }}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>

      {query ? (
        <View className="border border-black m-2 rounded-lg bg-blue-100 mt-1">
          {isLoading && <Text>Loading...</Text>}
          {error && <Text>Error: {error.message}</Text>}
          <FlatList
            data={filteredCharacters}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity className="p-2 border-b border-black">
                <View className="flex flex-row items-center pr-10">
                  <CheckBox
                    iconColor={"blue"}
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
            )}
          />
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

const highlightQuery = (text, query) => {
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <Text>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <Text key={index} style={styles.highlight}>
            {part}
          </Text>
        ) : (
          part
        )
      )}
    </Text>
  );
};

const styles = StyleSheet.create({
  highlight: {
    fontWeight: "bold",
  },
});

export default MultiSelectAutocomplete;
