import { Alert, Linking } from "react-native";
import * as StoreReview from "expo-store-review";
import AnalyticsLogger from "@/hooks/logger/remoteLogger";
import { HOME_EVENTS } from "@/utils/events/events";
import { useTranslation } from "@/i18n";

export const useReviewAlert = () => {
  const { t } = useTranslation("review");

  const showReviewAlert = () => {
    // Fallback strings in case translations are not loaded
    Alert.alert(`${t("title")}`, `${t("message")}`, [
      {
        text: `${t("notReally")}`,
        onPress: () => {
          AnalyticsLogger.logEvent(HOME_EVENTS.REVIEW.NOT_REALLY);
        },
      },
      {
        text: `${t("yesLoveIt")}`,
        onPress: reviewApp,
      },
    ]);
  };

  const reviewApp = async () => {
    const hasStoreReviewAction = await StoreReview.hasAction();

    if (hasStoreReviewAction) {
      await StoreReview.requestReview();
      AnalyticsLogger.logEvent(HOME_EVENTS.REVIEW.IN_APP_REVIEW_SHOWN);
    } else {
      AnalyticsLogger.logEvent(HOME_EVENTS.REVIEW.OPEN_APP_STORE);
      Linking.openURL(
        "https://apps.apple.com/us/app/ai-rewrite-spell-checker/id6739363989?action=write-review"
      );
    }
  };

  return { showReviewAlert };
};
