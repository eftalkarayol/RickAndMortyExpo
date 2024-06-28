import React from "react";
import { TextInput, View, TextInputProps, ViewProps } from "react-native";
import { styled } from "nativewind";

// NativeWind ile stillendirilmiş bileşenler
const StyledTextInput = styled(TextInput);
const StyledView = styled(View);

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  inputStyle?: string;
  containerStyle?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder,
  inputStyle,
  containerStyle,
}) => {
  return (
    <StyledView className={containerStyle}>
      <StyledTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        className={inputStyle}
        multiline={false}
        numberOfLines={1}
      />
    </StyledView>
  );
};

export default SearchInput;
