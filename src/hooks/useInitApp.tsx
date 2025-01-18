import React, { useEffect, useState } from "react";
import * as RNLocalize from "react-native-localize";
import { useStore } from "../store/useStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import strings from "@/i18n/strings";

const useInitApp = () => {
  const [appLoading, setAppLoading] = useState(true);
  const [showSubscription, setShowSubscription] = useState(false);
  const setCurrentLanguage = useStore((state) => state.setCurrentLanguage);

  const checkAppLaunched = async () => {
    const appLaunched = await AsyncStorage.getItem("appLaunched");
    const today = new Date();
    const targetDate = new Date("2025-01-22");

    if (today < targetDate) {
      setShowSubscription(false);
      return;
    }

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

      let currentLanguage = "en";

      if (locales?.length > 0) {
        let primaryLocale = locales?.[0];
        const supportedLanguages = Object.keys(strings.home);

        if (supportedLanguages.includes(primaryLocale?.languageCode)) {
          currentLanguage = primaryLocale?.languageCode;
        }
      }

      setCurrentLanguage(currentLanguage);
    } catch (error) {
      console.log(error);
      setCurrentLanguage("en");
    }
  }, []);

  return { appLoading, showSubscription };
};

export default useInitApp;
