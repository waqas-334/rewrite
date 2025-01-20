import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { RepeatIcon } from "@/components/icon";
import { useSystemColor } from "@/hooks/useSystemColor";
import { useTranslation } from "@/i18n";
import EditIcon from "../icon/EditIcon";

interface ResultFooterProps {
  onClear: () => void;
  onCheck: () => void;
  isLoading: boolean;
}

const ResultFooter: React.FC<ResultFooterProps> = ({
  onClear,
  onCheck,
  isLoading,
}) => {
  const { getColor } = useSystemColor();
  const { t } = useTranslation("home");

  return (
    <View style={styles.resultFooter}>
      <TouchableOpacity
        style={[
          styles.trashButton,
          { backgroundColor: getColor("backOpacity") },
        ]}
        onPress={onClear}
      >
        <EditIcon
          color={getColor("lightInherit")}
          width={16.02}
          height={14.02}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onCheck}
        disabled={isLoading}
        style={{ flex: 1 }}
      >
        <LinearGradient
          style={[styles.againButton, isLoading && styles.disabledButton]}
          colors={["rgba(109, 79, 142, 1)", "rgba(96, 67, 128, 1)"]}
        >
          <View style={styles.againContent}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <RepeatIcon width={16} height={16} color={getColor("white")} />
                <Text style={[styles.againText, { color: getColor("white") }]}>
                  {t("reCheck")}
                </Text>
              </>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  resultFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  trashButton: {
    width: 56,
    height: 56,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  againButton: {
    flex: 1,
    borderRadius: 100,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  againContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  againText: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default ResultFooter;
