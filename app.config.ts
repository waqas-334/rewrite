import { ExpoConfig } from "expo/config";

const config = require("./app.json");

const expoConfig: ExpoConfig = {
  ...config.expo,
  ios: {
    ...config.expo.ios,
    appStoreUrl:
      "https://apps.apple.com/us/app/ai-rewrite-spell-checker/id6739363989",
  },
};

export default expoConfig;
