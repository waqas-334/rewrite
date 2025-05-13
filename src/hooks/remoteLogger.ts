// src/utils/AnalyticsLogger.ts
// import analytics from "@react-native-firebase/analytics";
import { getAnalytics, logEvent } from "@react-native-firebase/analytics";

class AnalyticsLogger {
  static async logEvent(eventName: string) {
    try {
      const analytics = getAnalytics();
      logEvent(analytics, eventName);
      console.log(`[Analytics] Event logged: ${eventName}`);
    } catch (error) {
      console.error(`[Analytics] Failed to log event: ${eventName}`);
    }
  }
}

export default AnalyticsLogger;
