import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSystemColor } from "@/hooks/useSystemColor";
import { useTranslation } from "@/i18n";

interface CheckButtonProps {
  onPress: () => void;
  isLoading: boolean;
}

const CheckButton: React.FC<CheckButtonProps> = ({ onPress, isLoading }) => {
  const { getColor } = useSystemColor();
  const { t } = useTranslation("home");

  return (
    <TouchableOpacity onPress={onPress} disabled={isLoading}>
      <LinearGradient
        style={[styles.checkButton, isLoading && styles.disabledButton]}
        colors={["rgba(109, 79, 142, 1)", "rgba(96, 67, 128, 1)"]}
      >
        {isLoading ? (
          <ActivityIndicator color={getColor("primary")} />
        ) : (
          <Text style={[styles.checkButtonText, { color: getColor("white") }]}>
            {t("check")}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkButton: {
    backgroundColor: "#000",
    borderRadius: 100,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 24,
  },
  checkButtonText: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default CheckButton;
