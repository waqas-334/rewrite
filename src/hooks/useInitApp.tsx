import React, { useEffect, useState } from "react";
import * as RNLocalize from "react-native-localize";
import { useStore } from "../store/useStore";

const useInitApp = () => {
  const [appLoading, setAppLoading] = useState(true);
  const setCurrentLanguage = useStore((state) => state.setCurrentLanguage);

  useEffect(() => {
    try {
      const locales = RNLocalize.getLocales();

      if (locales?.length > 0) {
        const primaryLocale = locales?.[0];
        setCurrentLanguage(primaryLocale?.languageCode || "en");
      }
    } catch (error) {
      console.log(error);
      setCurrentLanguage("en");
    } finally {
      setAppLoading(false);
    }
  }, []);

  return { appLoading };
};

export default useInitApp;
