import React from "react";
import { Share, Linking } from "react-native";
import MoreModal from "@/components/MoreModal";
import {
  APP_STORE_URL,
  PRIVACY_POLICY_URL,
  TERMS_OF_SERVICE_URL,
  SUPPORT_EMAIL,
  SUPPORT_URL,
} from "@/configs/constants";
import { MORE_MODAL_EVENTS } from "@/utils/events/events";
import AnalyticsLogger from "@/hooks/logger/remoteLogger";

interface MoreModalContainerProps {
  visible: boolean;
  onClose: () => void;
  navigation: any;
  handleTrialPress: () => void;
  showReviewAlert: () => void;
}

const MoreModalContainer = ({
  visible,
  onClose,
  navigation,
  handleTrialPress,
  showReviewAlert,
}: MoreModalContainerProps) => {
  const handleSharePress = () => {
    AnalyticsLogger.logEvent(MORE_MODAL_EVENTS.SHARE);
    Share.share({
      message: "AI Rewrite & Spell Checker app!",
      url: APP_STORE_URL,
    }).catch((e) => console.log(e));
  };

  const handlePrivacyPress = () => {
    Linking.openURL(PRIVACY_POLICY_URL);
  };

  const handleSupportPress = async () => {
    try {
      if (await Linking.canOpenURL(`mailto:${SUPPORT_EMAIL}`)) {
        Linking.openURL(
          `mailto:${SUPPORT_EMAIL}?subject=AI%20Rewrite%20Support`
        );
      } else {
        Linking.openURL(SUPPORT_URL);
      }
    } catch (error) {
      Linking.openURL(SUPPORT_URL);
    }
  };

  const handleTermsPress = () => {
    Linking.openURL(TERMS_OF_SERVICE_URL);
  };

  const handleTrialModalPress = () => {
    AnalyticsLogger.logEvent(MORE_MODAL_EVENTS.UPGRADE);
    onClose();
    handleTrialPress();
  };

  return (
    <MoreModal
      visible={visible}
      onClose={onClose}
      navigation={navigation}
      onTrialPress={handleTrialModalPress}
      onRatePress={showReviewAlert}
      onSharePress={handleSharePress}
      onPrivacyPress={handlePrivacyPress}
      onSupportPress={handleSupportPress}
      onTermsPress={handleTermsPress}
    />
  );
};

export default MoreModalContainer;
