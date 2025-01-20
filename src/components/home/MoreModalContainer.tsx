import React from "react";
import { Share, Linking } from "react-native";
import MoreModal from "@/components/MoreModal";

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
    Share.share({
      message: "AI Rewrite & Spell Checker app!",
      url: "https://apps.apple.com/app/id6739363989",
    }).catch((e) => console.log(e));
  };

  const handlePrivacyPress = () => {
    Linking.openURL("https://deployglobal.ee/corrector/privacy");
  };

  const handleSupportPress = () => {
    Linking.openURL("https://deployglobal.ee/support");
  };

  const handleTermsPress = () => {
    Linking.openURL("https://deployglobal.ee/corrector/terms");
  };

  const handleTrialModalPress = () => {
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
