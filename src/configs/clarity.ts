import { ClarityConfig, initialize, LogLevel } from "react-native-clarity";

export const clarityConfig: ClarityConfig = {
  logLevel: LogLevel.Verbose,
};

let initialized = false;

const clarityProjectId = process.env.CLARITY_TOKEN;

export const initializeClarity = () => {
  if (!clarityProjectId) {
    return console.warn("CLARITY_TOKEN is not set");
  }

  if (initialized) {
    return;
  }

  initialize(clarityProjectId, clarityConfig);
  initialized = true;
};
