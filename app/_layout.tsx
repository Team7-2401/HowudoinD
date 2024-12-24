import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack 
      screenOptions={{
        headerShown: false, // This will hide the header bar
        // Optional additional styling
        contentStyle: { backgroundColor: 'white' }
      }}
    />
  );
}
