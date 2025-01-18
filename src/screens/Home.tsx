import React, { useEffect, useRef, useState } from "react";
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
  ActivityIndicator,
  Linking,
  Share,
  Alert,
} from "react-native";
import {
  CrownIcon,
  MenuIcon,
  PasteIcon,
  CloseIcon,
  ShareIcon,
  CopyIcon,
  RepeatIcon,
} from "@/components/icon";
import RightIcon from "@/components/icon/RightIcon";
import * as Clipboard from "expo-clipboard";
import Animated, {
  withTiming,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
} from "react-native-reanimated";
import useGrammar from "@/hooks/useGrammar";
import MoreModal from "@/components/MoreModal";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStore } from "@/store/useStore";
import EditIcon from "@/components/icon/EditIcon";
import { showMessage } from "react-native-flash-message";
import { useTranslation } from "@/i18n";
import { useSystemColor } from "@/hooks/useSystemColor";
import * as StoreReview from "expo-store-review";
import { LinearGradient } from "expo-linear-gradient";

const Header = ({
  onMenuPress,
  onTrialPress,
}: {
  onMenuPress: () => void;
  onTrialPress: () => void;
}) => {
  const navigation: any = useNavigation();
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

const Home = ({ navigation }: { navigation: any }) => {
  const [text, setText] = useState("");
  const opacity = useSharedValue(1);
  const closeButtonOpacity = useSharedValue(0);
  const hideHeading = useSharedValue(1);
  const resultAnim = useSharedValue(1);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const isPremiumUser = useStore((state) => state.isPremiumUser);
  const offerTimeLeft = useStore((state) => state.offerTimeLeft);
  const [isKeyboardFocused, setIsKeyboardFocused] = useState(false);
  const [hasStoreReviewAction, setHasStoreReviewAction] = useState(false);
  const { t } = useTranslation("home");

  const { checkGrammar } = useGrammar();
  const { getColor } = useSystemColor();

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

  const showReviewAlert = () => {
    Alert.alert(
      "Are you enjoying our app?",
      "Your feedback help us improve. Let us know if you're enjoying our app!",
      [
        {
          text: "Not really",
          onPress: () => {
            // Linking.openURL("https://deployglobal.ee/support");
          },
        },
        {
          text: "Yes, I love it!",
          onPress: reviewApp,
        },
      ]
    );
  };

  const handleTrialPress = () => {
    const currentDate = new Date().getTime();

    const timePassed = offerTimeLeft ? currentDate - offerTimeLeft : 9999999900;

    if (timePassed > 2 * 60 * 1000) {
      navigation.navigate("Subscription");
    } else {
      const timePassedInSeconds = Math.floor(timePassed / 1000);
      const timeLeft = 120 - timePassedInSeconds;
      const increasedTimeLeft = timeLeft < 20 ? 20 : timeLeft;

      navigation.navigate("Offer", { timeLeft: increasedTimeLeft });
    }
  };

  const handleClear = () => {
    setText("");
    closeButtonOpacity.value = withTiming(0, { duration: 200 });
    setShowResult(false);
  };
  const handleCheck = async () => {
    if (text.length === 0) {
      return;
    }

    let checks: any = {};

    try {
      setIsLoading(true);

      if (!isPremiumUser) {
        const today = new Date().toDateString();
        const storedData = await AsyncStorage.getItem("grammarChecks");
        checks = storedData ? JSON.parse(storedData) : {};

        const todayChecks = checks[today] || 0;

        if (todayChecks === 3) {
          Alert.alert(t("limitReachedTitle"), t("limitReachedMessage"), [
            {
              text: t("upgradeToPro"),
              onPress: handleTrialPress,
              style: "default",
            },
            {
              text: t("close"),
              onPress: () => {},
            },
          ]);
          return setIsLoading(false);
        }

        checks[today] = todayChecks + 1;
        AsyncStorage.setItem("grammarChecks", JSON.stringify(checks));
      }

      inputRef?.current?.blur?.();
      Keyboard.dismiss();

      const result = await checkGrammar(text);
      setResult(result);
      setShowResult(true);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);

      setTimeout(async () => {
        const seenReviewCount = Number(
          (await AsyncStorage.getItem("seenReviewCount")) || "0"
        );

        if (seenReviewCount === 1) {
          showReviewAlert();
          AsyncStorage.setItem(
            "seenReviewCount",
            (seenReviewCount + 1).toString()
          );
        }
      }, 3000);
    }
  };

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(result);
      showMessage({
        message: t("copySuccess"),
        type: "success",
        duration: 2000,
        style: {
          backgroundColor: "#000",
        },
        titleStyle: {
          fontFamily: "Inter",
          fontWeight: "500",
        },
      });
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  useEffect(() => {
    if (showResult) {
      resultAnim.value = withTiming(0, { duration: 200 });
    } else {
      resultAnim.value = withTiming(1, { duration: 200 });
    }
  }, [showResult]);

  useEffect(() => {
    const hasStoreReviewAction = async () => {
      try {
        const hasAction = await StoreReview.hasAction();
        setHasStoreReviewAction(hasAction);
      } catch (error) {
        console.log(error);
      }
    };

    hasStoreReviewAction();
  }, []);

  const reviewApp = async () => {
    if (hasStoreReviewAction) {
      await StoreReview.requestReview();
    } else {
      Linking.openURL(
        "https://apps.apple.com/us/app/ai-rewrite-spell-checker/id6739363989?action=write-review"
      );
    }
  };

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
    <SafeAreaView
      style={[styles.container, { backgroundColor: getColor("background") }]}
    >
      <>
        <Header
          onMenuPress={() => setShowMoreModal(true)}
          onTrialPress={handleTrialPress}
        />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingView}
          >
            <View style={styles.content}>
              {!showResult && (
                <Animated.Text
                  style={[
                    styles.heading,
                    { color: getColor("lightInherit") },
                    headingAnimatedStyle,
                  ]}
                >
                  {t("checkGrammar")}
                </Animated.Text>
              )}
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
                    <Text
                      style={[
                        styles.pasteText,
                        { color: getColor("topIcons") },
                      ]}
                    >
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
                  <Pressable
                    onPress={handleClear}
                    style={styles.closeButtonContent}
                  >
                    <CloseIcon
                      color={getColor("topIcons")}
                      width={10.57}
                      height={10.57}
                    />
                  </Pressable>
                </Animated.View>
              </Animated.View>
              {/* result box */}
              {showResult && (
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
                          })
                            .then((res) => console.log(res))
                            .catch((error) => console.log(error));
                        }}
                      >
                        <ShareIcon
                          width={20}
                          height={20}
                          color={getColor("grayOpacity")}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.copyIconWrapper,
                          { backgroundColor: getColor("backOpacity2") },
                        ]}
                        onPress={handleCopy}
                      >
                        <CopyIcon
                          width={20}
                          height={20}
                          color={getColor("grayOpacity")}
                        />
                      </TouchableOpacity>
                    </>
                  )}
                </Animated.View>
              )}
              {showResult ? (
                <View style={styles.resultFooter}>
                  <TouchableOpacity
                    style={[
                      styles.trashButton,
                      { backgroundColor: getColor("backOpacity") },
                    ]}
                    onPress={handleClear}
                  >
                    <EditIcon
                      color={getColor("lightInherit")}
                      width={16.02}
                      height={14.02}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      handleCheck();
                    }}
                    disabled={isLoading}
                    style={{ flex: 1 }}
                  >
                    <LinearGradient
                      style={[
                        styles.againButton,
                        isLoading && styles.disabledButton,
                      ]}
                      colors={["rgba(109, 79, 142, 1)", "rgba(96, 67, 128, 1)"]}
                    >
                      <View style={styles.againContent}>
                        {isLoading ? (
                          <ActivityIndicator color="#fff" />
                        ) : (
                          <>
                            <RepeatIcon
                              width={16}
                              height={16}
                              color={getColor("white")}
                            />
                            <Text
                              style={[
                                styles.againText,
                                { color: getColor("white") },
                              ]}
                            >
                              {t("reCheck")}
                            </Text>
                          </>
                        )}
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={handleCheck} disabled={isLoading}>
                  <LinearGradient
                    style={[
                      styles.checkButton,
                      isLoading && styles.disabledButton,
                    ]}
                    colors={["rgba(109, 79, 142, 1)", "rgba(96, 67, 128, 1)"]}
                  >
                    {isLoading ? (
                      <ActivityIndicator color={getColor("primary")} />
                    ) : (
                      <Text
                        style={[
                          styles.checkButtonText,
                          { color: getColor("white") },
                        ]}
                      >
                        {t("check")}
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>

        <MoreModal
          visible={showMoreModal}
          onClose={() => setShowMoreModal(false)}
          navigation={navigation}
          onTrialPress={() => {
            setShowMoreModal(false);
            handleTrialPress();
          }}
          onRatePress={showReviewAlert}
          onSharePress={() => {
            Share.share({
              message: "AI Rewrite & Spell Checker app!",
              url: "https://apps.apple.com/app/id6739363989",
            }).catch((e) => console.log(e));
          }}
          onPrivacyPress={() => {
            Linking.openURL("https://deployglobal.ee/corrector/privacy");
          }}
          onSupportPress={() => {
            Linking.openURL("https://deployglobal.ee/support");
          }}
          onTermsPress={() => {
            Linking.openURL("https://deployglobal.ee/corrector/terms");
          }}
        />
      </>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: 187.77,
    height: 36,
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
  checkButton: {
    backgroundColor: "#000",
    borderRadius: 100,
    paddingVertical: 18,
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
    paddingBottom: 44,
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
  resultFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  trashButton: {
    width: 56,
    height: 56,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  againButton: {
    flex: 1,
    backgroundColor: "#000",
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
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default Home;
