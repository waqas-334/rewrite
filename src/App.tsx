import React, { useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";
import Home from "./screens/Home";
import SubscriptionScreen from "./screens/SubscriptionScreen";
import useAdapt from "./hooks/useAdapt";
import FlashMessage from "react-native-flash-message";
import Offer from "./screens/Offer";
import useInitApp from "./hooks/useInitApp";

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

export default function App() {
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
