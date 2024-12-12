import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import SubscriptionScreen from "./screens/SubscriptionScreen";

export type RootStackParamList = {
  Home: undefined;
  Privacy: undefined;
  Support: undefined;
  Subscription: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="Subscription"
          component={SubscriptionScreen}
          options={
            {
              // presentation: "modal",
            }
          }
        />
        {/* Add other screens as needed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
