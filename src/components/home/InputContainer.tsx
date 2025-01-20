import React from "react";
import {
  StyleSheet,
  TextInput,
  Animated,
  TouchableOpacity,
  Text,
  Pressable,
  View,
} from "react-native";
import { PasteIcon, CloseIcon } from "@/components/icon";
import * as Clipboard from "expo-clipboard";
import {
  useAnimatedStyle,
  withTiming,
  SharedValue,
} from "react-native-reanimated";

interface InputContainerProps {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<TextInput>;
  closeButtonOpacity: SharedValue<number>;
  hideHeading: SharedValue<number>;
  resultAnimatedStyle: any;
  getColor: (key: any) => string;
  setIsKeyboardFocused: (focused: boolean) => void;
  t: (key: string) => string;
}

const InputContainer = ({
  text,
  setText,
  inputRef,
  closeButtonOpacity,
  hideHeading,
  resultAnimatedStyle,
  getColor,
  setIsKeyboardFocused,
  t,
}: InputContainerProps) => {
  const handleTextChange = (newText: string) => {
    setText(newText);
    closeButtonOpacity.value = withTiming(newText.length > 0 ? 1 : 0, {
      duration: 200,
    });
  };

  const handlePaste = async () => {
    const clipboardText = await Clipboard.getStringAsync();
    if (clipboardText) {
      setText((prevState: string) => prevState + clipboardText);
    }
  };

  const handleClear = () => {
    setText("");
    closeButtonOpacity.value = withTiming(0, { duration: 200 });
  };

  const closeButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: closeButtonOpacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.inputContainer,
        { borderColor: getColor("border") },
        resultAnimatedStyle,
      ]}
    >
      <TextInput
        style={[styles.input, { color: getColor("lightInherit") }]}
        multiline
        placeholder={t("enterText")}
        placeholderTextColor={getColor("placeholder")}
        value={text}
        onChangeText={handleTextChange}
        onFocus={() => {
          hideHeading.value = withTiming(0, { duration: 200 });
          setIsKeyboardFocused(true);
        }}
        onBlur={() => {
          if (text.length === 0) {
            hideHeading.value = withTiming(1, { duration: 200 });
          }
          setIsKeyboardFocused(false);
        }}
        ref={inputRef}
      />
      <Animated.View
        style={[
          styles.pasteButton,
          { backgroundColor: getColor("backOpacity") },
        ]}
      >
        <TouchableOpacity
          onPress={handlePaste}
          style={[styles.pasteButtonContent]}
        >
          <PasteIcon
            color={getColor("topIcons")}
            width={12.92}
            height={15.42}
          />
          <Text style={[styles.pasteText, { color: getColor("topIcons") }]}>
            {t("paste")}
          </Text>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View
        style={[
          styles.closeButton,
          { backgroundColor: getColor("backOpacity") },
          closeButtonAnimatedStyle,
        ]}
      >
        <Pressable onPress={handleClear} style={styles.closeButtonContent}>
          <CloseIcon
            color={getColor("topIcons")}
            width={10.57}
            height={10.57}
          />
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    paddingBottom: 64,
  },
  input: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
    color: "rgba(0, 0, 0, 1)",
    paddingBottom: 64,
  },
  pasteButton: {
    position: "absolute",
    bottom: 16,
    left: 16,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    width: 83,
    height: 40,
    borderRadius: 100,
  },
  pasteButtonContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  pasteText: {
    marginLeft: 4,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500",
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "Inter",
  },
  closeButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  closeButtonContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default InputContainer;
