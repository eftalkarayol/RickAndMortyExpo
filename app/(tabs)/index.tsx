import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import MultiSelectAutocomplete from "@/components/MultiSelectAutocomplete";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { styled } from "nativewind";
const queryClient = new QueryClient();
const TabOneScreen = () => {
  const StyledView = styled(View);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <StyledView style={styles.container}>
            <MultiSelectAutocomplete />
          </StyledView>
        </SafeAreaProvider>
      </QueryClientProvider>
    </SafeAreaView>
  );
};

export default TabOneScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
