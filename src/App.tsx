import React, { useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import Home from "./screens/Home";
import SubscriptionScreen from "./screens/SubscriptionScreen";
import useAdapt from "./hooks/useAdapt";
import FlashMessage from "react-native-flash-message";
import Offer from "./screens/Offer";
import useInitApp from "./hooks/useInitApp";
import useAdjust from "./hooks/useAdjust";
import { initializeClarity } from "./configs/clarity";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "@react-native-firebase/app";
import { useEffect } from "react";

// SplashScreen.preventAutoHideAsync();

// SplashScreen.setOptions({
//   duration: 500,
//   fade: true,
// });

export type RootStackParamList = {
  Home: undefined;

  Subscription: undefined;
  Offer: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

initializeClarity();

export default function App() {
  console.log("App started");

  useEffect(() => {
    // Check if Firebase is already initialized
    if (!firebase.apps.length) {
      // Initialize Firebase
      firebase.initializeApp();
      console.log("Firebase initialized");
    } else {
      console.log("Firebase already initialized");
    }
  }, []);

  useAdjust();
  const { isPremiumUser, initLoading } = useAdapt();
  const { appLoading, showSubscription } = useInitApp();

  if (initLoading || appLoading) {
    return null;
  }

  let initialScreen: keyof RootStackParamList = "Home";

  if (showSubscription && !isPremiumUser) {
    initialScreen = "Subscription";
  }

  return (
    <View style={{ flex: 1 }}>
      <FlashMessage position="top" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialScreen}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen
            name="Subscription"
            component={SubscriptionScreen}
            options={{}}
          />
          <Stack.Screen name="Offer" component={Offer} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
