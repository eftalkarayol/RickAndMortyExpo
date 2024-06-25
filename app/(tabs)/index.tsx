import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import MultiSelectAutocomplete from "@/components/MultiSelectAutocomplete";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";

const queryClient = new QueryClient();
const TabOneScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <View style={styles.container}>
            <MultiSelectAutocomplete />
          </View>
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
    alignItems: "center",
    justifyContent: "center",
  },
});
