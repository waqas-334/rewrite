import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { CrownIcon, MenuIcon } from "@/components/icon";
import RightIcon from "@/components/icon/RightIcon";
import { useStore } from "@/store/useStore";
import { useTranslation } from "@/i18n";
import { useSystemColor } from "@/hooks/useSystemColor";

interface HeaderProps {
  onMenuPress: () => void;
  onTrialPress: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuPress, onTrialPress }) => {
  const isPremiumUser = useStore((state) => state.isPremiumUser);
  const globalLoading = useStore((state) => state.globalLoading);
  const { getColor } = useSystemColor();
  const { t } = useTranslation("home");

  return (
    <View style={styles.header}>
      <Text style={[styles.title, { color: getColor("lightInherit") }]}>
        {t("home")}
      </Text>

      {!isPremiumUser && (
        <TouchableOpacity
          style={[
            styles.trialButton,
            { backgroundColor: getColor("trialButton") },
            globalLoading && { opacity: 0.5 },
          ]}
          onPress={onTrialPress}
          disabled={globalLoading}
        >
          {!globalLoading && (
            <>
              <CrownIcon width={20} height={16} fill="#FF9200" />
              <Text style={[styles.trialText, { color: getColor("white") }]}>
                {t("freeTrial")}
              </Text>
              <RightIcon color={getColor("white")} />
            </>
          )}
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[
          styles.menuButtonContainer,
          { backgroundColor: getColor("backOpacity") },
        ]}
        onPress={onMenuPress}
      >
        <MenuIcon width={16} height={10} color={getColor("iconColor")} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    width: "100%",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
    fontFamily: "Inter",
  },
  trialButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    gap: 6,
    width: 187.77,
    height: 36,
  },
  trialText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500",
    fontFamily: "Inter",
  },
  menuButtonContainer: {
    width: 48,
    height: 48,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Header;
