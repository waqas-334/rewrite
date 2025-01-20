import React from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Share,
} from "react-native";
import { ShareIcon, CopyIcon } from "@/components/icon";
import { useSystemColor } from "@/hooks/useSystemColor";
import Animated from "react-native-reanimated";

interface ResultBoxProps {
  result: string;
  isKeyboardFocused: boolean;
  animatedResultStyle: any;
  onCopy: () => void;
}

const ResultBox: React.FC<ResultBoxProps> = ({
  result,
  isKeyboardFocused,
  animatedResultStyle,
  onCopy,
}) => {
  const { getColor } = useSystemColor();

  return (
    <Animated.View
      style={[
        styles.resultBox,
        {
          backgroundColor: getColor("resultBg"),
          borderColor: getColor("resultBorder"),
        },
        animatedResultStyle,
        isKeyboardFocused && {
          paddingBottom: 0,
        },
        { maxHeight: 300 },
      ]}
    >
      <TextInput
        value={result}
        multiline
        style={[
          styles.correctedText,
          { color: getColor("lightInherit") },
          {
            padding: 16,
            paddingBottom: isKeyboardFocused ? 0 : 16,
          },
        ]}
        placeholderTextColor={getColor("placeholder")}
        editable={false}
      />
      {!isKeyboardFocused && (
        <>
          <TouchableOpacity
            style={[
              styles.shareIconWrapper,
              { backgroundColor: getColor("backOpacity2") },
            ]}
            onPress={() => {
              Share.share({
                url: "https://apps.apple.com/us/app/ai-rewrite-spell-checker/id6739363989",
                message: result,
              });
            }}
          >
            <ShareIcon width={20} height={20} color={getColor("grayOpacity")} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.copyIconWrapper,
              { backgroundColor: getColor("backOpacity2") },
            ]}
            onPress={onCopy}
          >
            <CopyIcon width={20} height={20} color={getColor("grayOpacity")} />
          </TouchableOpacity>
        </>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  resultBox: {
    flex: 0.5,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    flexDirection: "column",
    paddingBottom: 44,
  },
  correctedText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  shareIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 16,
    left: 16,
  },
  copyIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 16,
    right: 16,
  },
});

export default ResultBox;
