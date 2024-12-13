import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import {
  StarIcon,
  ShareIcon,
  PrivacyIcon,
  MailIcon,
  RightIcon,
  TermsIcon,
} from "@/components/icon";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useStore } from "@/store/useStore";
import { useTranslation } from "@/i18n";

interface MoreModalProps {
  visible: boolean;
  onClose: () => void;
  onTrialPress?: () => void;
  onRatePress?: () => void;
  onSharePress?: () => void;
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
  onSupportPress?: () => void;
  navigation: any;
}

const MoreModal = ({
  visible,
  onClose,
  onTrialPress,
  onRatePress,
  onSharePress,
  onTermsPress,
  onPrivacyPress,
  onSupportPress,
  navigation,
}: MoreModalProps) => {
  const opacity = useSharedValue(0);
  const isPremiumUser = useStore((s) => s.isPremiumUser);
  const { t } = useTranslation("more");

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        opacity.value = withTiming(0.5, { duration: 250 });
      }, 400);
    } else {
      opacity.value = 0;
    }
  }, [visible]);

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      opacity.value,
      [0, 0.5],
      ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.5)"]
    ),
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable onPress={onClose} style={{ flex: 1 }}>
        <Animated.View style={[styles.overlay, animatedOverlayStyle]}>
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>{t("more")}</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            {!isPremiumUser && (
              <TouchableOpacity
                style={styles.trialBanner}
                onPress={() => {
                  onClose();
                  navigation.navigate("Subscription");
                }}
              >
                <View>
                  <Text style={styles.trialText}>{t("trialNotClaimed")}</Text>
                  <Text style={styles.tapText}>{t("tapToClaim")}</Text>
                </View>
                <View style={styles.giftIcon}>
                  <Text style={{ fontSize: 38 }}>🎁</Text>
                </View>
              </TouchableOpacity>
            )}

            {/* <TouchableOpacity style={styles.menuItem} onPress={onRatePress}>
              <View style={styles.menuIconContainer}>
                <StarIcon width={20} height={20} />
              </View>
              <Text style={styles.menuText}>{t("rateUs")}</Text>
              <RightIcon color="rgba(0, 0, 0, 0.5)" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={onSharePress}>
              <View style={styles.menuIconContainer}>
                <ShareIcon width={20} height={20} color="#000" />
              </View>
              <Text style={styles.menuText}>{t("share")}</Text>
              <RightIcon color="rgba(0, 0, 0, 0.5)" />
            </TouchableOpacity> */}

            <TouchableOpacity style={styles.menuItem} onPress={onPrivacyPress}>
              <View style={styles.menuIconContainer}>
                <PrivacyIcon width={20} height={20} />
              </View>
              <Text style={styles.menuText}>{t("privacyPolicy")}</Text>
              <RightIcon color="rgba(0, 0, 0, 0.5)" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={onTermsPress}>
              <View style={styles.menuIconContainer}>
                <TermsIcon width={20} height={20} />
              </View>
              <Text style={styles.menuText}>{t("termsOfUse")}</Text>
              <RightIcon color="rgba(0, 0, 0, 0.5)" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={onSupportPress}>
              <View style={styles.menuIconContainer}>
                <MailIcon width={20} height={20} />
              </View>
              <Text style={styles.menuText}>{t("support")}</Text>
              <RightIcon color="rgba(0, 0, 0, 0.5)" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    // backgroundColor: "rgba(0, 0, 0)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    flex: 0.84,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },
  closeButton: {
    fontSize: 20,
    color: "#000",
  },
  trialBanner: {
    backgroundColor: "rgba(254, 234, 207, 0.64)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 9,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  trialText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    // flex: 1,
  },
  tapText: {
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.5)",
  },
  giftIcon: {
    marginLeft: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
});

export default MoreModal;
