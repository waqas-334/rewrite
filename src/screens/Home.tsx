import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  ScrollView,
} from "react-native";
import {
  CrownIcon,
  MenuIcon,
  PasteIcon,
  CloseIcon,
  ShareIcon,
  CopyIcon,
} from "@/components/icon";
import RightIcon from "@/components/icon/RightIcon";
import * as Clipboard from "expo-clipboard";
import Animated, {
  withTiming,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
} from "react-native-reanimated";

const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Home</Text>

      <TouchableOpacity style={styles.trialButton}>
        <CrownIcon width={20} height={16} fill="#FF9200" />
        <Text style={styles.trialText}>Free Trial</Text>
        <RightIcon />
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuButtonContainer}>
        <MenuIcon width={16} height={10} />
      </TouchableOpacity>
    </View>
  );
};

const Home = () => {
  const [text, setText] = useState("");
  const opacity = useSharedValue(1);
  const closeButtonOpacity = useSharedValue(0);
  const hideHeading = useSharedValue(1);
  const resultAnim = useSharedValue(1);
  const [showResult, setShowResult] = useState(false);

  const handleTextChange = (newText: string) => {
    setText(newText);
    closeButtonOpacity.value = withTiming(newText.length > 0 ? 1 : 0, {
      duration: 200,
    });
    opacity.value = withTiming(newText.length > 0 ? 0 : 1, {
      duration: 200,
    });
  };

  const handlePaste = async () => {
    const clipboardText = await Clipboard.getStringAsync();
    if (clipboardText) {
      setText((prevState) => prevState + clipboardText);
    }
  };

  const handleClear = () => {
    setText("");
    closeButtonOpacity.value = withTiming(0, { duration: 200 });
  };

  const handleCheck = () => {
    setShowResult(true);
  };

  useEffect(() => {
    if (showResult) {
      resultAnim.value = withTiming(0, { duration: 200 });
    }
  }, [showResult]);

  const closeButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: closeButtonOpacity.value,
  }));

  const headingAnimatedStyle = useAnimatedStyle(() => ({
    opacity: hideHeading.value,
    height: interpolate(hideHeading.value, [0, 1], [0, 100]),
    marginBottom: interpolate(hideHeading.value, [0, 1], [0, 24]),
    display: hideHeading.value === 0 ? "none" : "flex",
  }));

  const resultAnimatedStyle = useAnimatedStyle(() => ({
    flex: interpolate(resultAnim.value, [0, 1], [0.5, 1]),
  }));

  const animatedResultStyle = useAnimatedStyle(() => ({
    flex: interpolate(resultAnim.value, [1, 0], [0, 0.5]),
  }));

  return (
    <SafeAreaView style={styles.container}>
      <>
        <Header />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingView}
          >
            <View style={styles.content}>
              {!showResult && (
                <Animated.Text style={[styles.heading, headingAnimatedStyle]}>
                  Check your{"\n"}Grammar !
                </Animated.Text>
              )}
              <Animated.View
                style={[styles.inputContainer, resultAnimatedStyle]}
              >
                <TextInput
                  style={styles.input}
                  multiline
                  placeholder="Enter your text"
                  placeholderTextColor="rgba(0, 0, 0, 0.5)"
                  value={text}
                  onChangeText={handleTextChange}
                  onFocus={() => {
                    hideHeading.value = withTiming(0, { duration: 200 });
                  }}
                  onBlur={() => {
                    if (text.length === 0) {
                      hideHeading.value = withTiming(1, { duration: 200 });
                    }
                  }}
                />
                <Animated.View style={[styles.pasteButton]}>
                  <TouchableOpacity
                    onPress={handlePaste}
                    style={styles.pasteButtonContent}
                  >
                    <PasteIcon width={12.92} height={15.42} />
                    <Text style={styles.pasteText}>Paste</Text>
                  </TouchableOpacity>
                </Animated.View>
                <Animated.View
                  style={[styles.closeButton, closeButtonAnimatedStyle]}
                >
                  <Pressable
                    onPress={handleClear}
                    style={styles.closeButtonContent}
                  >
                    <CloseIcon width={10.57} height={10.57} />
                  </Pressable>
                </Animated.View>
              </Animated.View>
              {/* result box */}
              {showResult && (
                <Animated.View style={[styles.resultBox, animatedResultStyle]}>
                  <ScrollView
                    contentContainerStyle={{
                      padding: 16,
                      paddingBottom: 72,
                    }}
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={true}
                  >
                    <Text style={styles.correctedText}>Hi, how are you</Text>
                  </ScrollView>
                  <TouchableOpacity style={styles.shareIconWrapper}>
                    <ShareIcon
                      width={20}
                      height={20}
                      fill="rgba(34, 39, 47, 1)"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.copyIconWrapper}>
                    <CopyIcon
                      width={20}
                      height={20}
                      fill="rgba(34, 39, 47, 1)"
                    />
                  </TouchableOpacity>
                </Animated.View>
              )}
              <TouchableOpacity
                style={styles.checkButton}
                onPress={handleCheck}
              >
                <Text style={styles.checkButtonText}>Check</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    width: "100%",
    justifyContent: "space-between",
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
    color: "#000",
    fontFamily: "Inter",
  },
  trialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(254, 234, 207, 0.64)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    gap: 6,
  },
  trialText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500",
    color: "#000",
    fontFamily: "Inter",
  },

  menuButtonContainer: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  heading: {
    fontSize: 40,
    fontWeight: "700",
    lineHeight: 48,
    marginBottom: 24,
  },
  inputContainer: {
    flex: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    // paddingBottom: 64,
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
  checkButton: {
    backgroundColor: "#000",
    borderRadius: 100,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 24,
  },
  checkButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
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
  resultBox: {
    flex: 0.5,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 16,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderWidth: 1,
    marginBottom: 24,
    flexDirection: "column",
  },
  resultText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500",
    color: "rgba(0, 0, 0, 0.5)",
    marginBottom: 8,
  },
  correctedText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#000",
    marginBottom: 16,
  },
  resultActions: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    // marginTop: "auto",
    position: "absolute",
    bottom: 16,
    left: 16,
  },

  shareIconWrapper: {
    width: 40,
    height: 40,
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 16,
    right: 16,
  },
});

export default Home;
