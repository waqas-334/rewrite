import { useStore } from "@/store/useStore";
import strings from "./strings";

export const useTranslation = (screen: string) => {
  const lang = useStore((s) => s.currentLanguage);

  const t = (key: string) => {
    // Split the key by dots to handle nested properties
    const keys = key.split(".");

    // Start with the screen and language specific strings
    let value = strings[screen][lang];

    // Traverse through the nested objects
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        console.warn(
          `Translation missing for key: ${key} in ${screen}/${lang}`
        );
        return key; // Return the key itself if translation is missing
      }
    }

    return value;
  };

  return { t };
};
