import React, { useEffect, useState } from "react";
import * as RNLocalize from "react-native-localize";
import { useStore } from "../store/useStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useInitApp = () => {
  const [appLoading, setAppLoading] = useState(true);
  const [showSubscription, setShowSubscription] = useState(false);
  const setCurrentLanguage = useStore((state) => state.setCurrentLanguage);

  const checkAppLaunched = async () => {
    const appLaunched = await AsyncStorage.getItem("appLaunched");
    if (!appLaunched) {
      setShowSubscription(true);
      AsyncStorage.setItem("appLaunched", "true");
    } else {
      const randomNum = Math.floor(Math.random() * 3);

      if (randomNum === 0) {
        setShowSubscription(true);
      }
    }
  };

  useEffect(() => {
    checkAppLaunched().finally(() => {
      setAppLoading(false);
    });

    try {
      const locales = RNLocalize.getLocales();

      if (locales?.length > 0) {
        const primaryLocale = locales?.[0];
        setCurrentLanguage(primaryLocale?.languageCode || "en");
      }
    } catch (error) {
      console.log(error);
      setCurrentLanguage("en");
    }
  }, []);

  return { appLoading, showSubscription };
};

export default useInitApp;
