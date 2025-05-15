// src/utils/AnalyticsLogger.ts
// import analytics from "@react-native-firebase/analytics";
import { getAnalytics, logEvent } from "@react-native-firebase/analytics";
import { replaceWithUnderscore } from "@/utils/stringUtil";
import { getProductShortName } from "./productLoggerHelper";
class AnalyticsLogger {
  static async logEvent(eventName: string) {
    const normalisedEvent = replaceWithUnderscore(eventName);
    console.log(`[Analytics] ${eventName} normalised to ${normalisedEvent}`);
    try {
      const analytics = getAnalytics();

      logEvent(analytics, normalisedEvent);
      console.log(`[Analytics] Event logged: ${normalisedEvent}`);
    } catch (error) {
      console.error(
        `[Analytics] Failed to log event: ${normalisedEvent}\nReason: ${error}`
      );
    }
  }
  static async logProductEvent(eventName: string, productId: string) {
    const normalisedEvent = replaceWithUnderscore(eventName);
    const productShortName = getProductShortName(productId);
    const finalEvent = `${normalisedEvent}_${productShortName}`;
    await this.logEvent(finalEvent);
  }
}

export default AnalyticsLogger;
