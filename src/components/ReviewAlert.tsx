import { Alert, Linking } from "react-native";
import * as StoreReview from "expo-store-review";
import AnalyticsLogger from "@/hooks/logger/remoteLogger";
import { HOME_EVENTS } from "@/utils/events/events";

export const showReviewAlert = () => {
  Alert.alert(
    "Are you enjoying our app?",
    "Your feedback help us improve. Let us know if you're enjoying our app!",
    [
      {
        text: "Not really",
        onPress: () => {
          AnalyticsLogger.logEvent(HOME_EVENTS.REVIEW.NOT_REALLY);
        },
      },
      {
        text: "Yes, I love it!",
        onPress: reviewApp,
      },
    ]
  );
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
