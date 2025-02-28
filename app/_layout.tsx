import { Stack } from "expo-router";

export default function RootLayout() {
  return(
    <Stack>
      <Stack.Screen name="index"  />
      <Stack.Screen name="onboard" options={{headerShown: true , title: "Demographic information "}} />
      <Stack.Screen name="profile" options={{headerShown: true , title: "Profile"}} />
    </Stack>
  );
}
