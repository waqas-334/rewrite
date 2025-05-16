import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Linking,
  Alert,
  Share,
} from "react-native";
import { PasteIcon, CloseIcon } from "@/components/icon";
import * as Clipboard from "expo-clipboard";
import Animated, {
  withTiming,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
} from "react-native-reanimated";
import useGrammar from "@/hooks/useGrammar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStore } from "@/store/useStore";
import { showMessage } from "react-native-flash-message";
import { useTranslation } from "@/i18n";
import { useSystemColor } from "@/hooks/useSystemColor";
import * as StoreReview from "expo-store-review";
import Header from "@/components/home/Header";
import ResultBox from "@/components/home/ResultBox";
import CheckButton from "@/components/home/CheckButton";
import ResultFooter from "@/components/home/ResultFooter";
import MoreModalContainer from "@/components/home/MoreModalContainer";
import InputContainer from "@/components/home/InputContainer";
import AnalyticsLogger from "@/hooks/logger/remoteLogger";
import { HOME_EVENTS, MORE_MODAL_EVENTS } from "../../utils/events/events";
import { useReviewAlert } from "@/components/ReviewAlert";

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
  const showOffer = useStore((state) => state.showOffer);
  const freeTries = useStore((state) => state.dailyFreeTries);
  const showReviewPopup = useStore((state) => state.showReviewPopup);
  const { t } = useTranslation("home");
  const { checkGrammar } = useGrammar();
  const { getColor } = useSystemColor();
  const { showReviewAlert } = useReviewAlert();

  const handleTrialPress = () => {
    const currentDate = new Date().getTime();

    AnalyticsLogger.logEvent(HOME_EVENTS.UPGRADE);

    const timePassed = offerTimeLeft ? currentDate - offerTimeLeft : 9999999900;

    if (timePassed > 2 * 60 * 1000 || !showOffer) {
      navigation.navigate("Subscription");
    } else {
      const timePassedInSeconds = Math.floor(timePassed / 1000);
      const timeLeft = 120 - timePassedInSeconds;
      const increasedTimeLeft = timeLeft < 20 ? 20 : timeLeft;

      navigation.navigate("Offer", { timeLeft: increasedTimeLeft });
    }
  };

  const handleClear = () => {
    AnalyticsLogger.logEvent(HOME_EVENTS.HANDLE_CLEAR);
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
        AnalyticsLogger.logEvent(HOME_EVENTS.HANDLE_CHECK_NO_PREMIUM);
        const today = new Date().toDateString();
        const storedData = await AsyncStorage.getItem("grammarChecks");
        checks = storedData ? JSON.parse(storedData) : {};

        const todayChecks = checks[today] || 0;

        if (todayChecks >= freeTries) {
          AnalyticsLogger.logEvent(HOME_EVENTS.HANDLE_CHECK_NO_MORE_TRIES);
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
      } else {
        AnalyticsLogger.logEvent(HOME_EVENTS.HANDLE_CHECK_PREMIUM);
      }

      inputRef?.current?.blur?.();
      Keyboard.dismiss();

      const result = await checkGrammar(text);
      AnalyticsLogger.logEvent(HOME_EVENTS.HANDLE_CHECK_SUCCESS);
      setResult(result);
      setShowResult(true);
    } catch (error) {
      AnalyticsLogger.logEvent(HOME_EVENTS.HANDLE_CHECK_ERROR);
      console.error("Error:", error);
    } finally {
      setIsLoading(false);

      setTimeout(async () => {
        if (!showReviewPopup) {
          return;
        }

        const seenReviewCount = Number(
          (await AsyncStorage.getItem("seenReviewCount")) || "0"
        );

        if (seenReviewCount === 2) {
          AnalyticsLogger.logEvent(HOME_EVENTS.REVIEW.SHOW);
          showReviewAlert();
        }

        AsyncStorage.setItem(
          "seenReviewCount",
          (seenReviewCount + 1).toString()
        );
      }, 3000);
    }
  };

  const handleCopy = async () => {
    AnalyticsLogger.logEvent(HOME_EVENTS.HANDLE_COPY);
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
      AnalyticsLogger.logEvent(HOME_EVENTS.HANDLE_COPY_FAILED);
      console.error("Failed to copy text:", error);
    }
  };

  const handleShare = async () => {
    AnalyticsLogger.logEvent(HOME_EVENTS.HANDLE_SHARE);
    try {
      await Share.share({
        url: "https://apps.apple.com/us/app/ai-rewrite-spell-checker/id6739363989",
        message: `${result}\n\nCheck out this awesome app.`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  useEffect(() => {
    if (showResult) {
      resultAnim.value = withTiming(0, { duration: 200 });
    } else {
      resultAnim.value = withTiming(1, { duration: 200 });
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
    <SafeAreaView
      style={[styles.container, { backgroundColor: getColor("background") }]}
    >
      <>
        <Header
          onMenuPress={() => {
            AnalyticsLogger.logEvent(HOME_EVENTS.OPEN_MORE_MODAL);
            setShowMoreModal(true);
          }}
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
              <InputContainer
                text={text}
                setText={setText}
                inputRef={inputRef}
                closeButtonOpacity={closeButtonOpacity}
                hideHeading={hideHeading}
                resultAnimatedStyle={resultAnimatedStyle}
                getColor={getColor}
                setIsKeyboardFocused={setIsKeyboardFocused}
                t={t}
              />
              {/* result box */}
              {showResult && (
                <ResultBox
                  result={result}
                  isKeyboardFocused={isKeyboardFocused}
                  animatedResultStyle={animatedResultStyle}
                  onCopy={handleCopy}
                  onShare={handleShare}
                />
              )}

              {showResult ? (
                <ResultFooter
                  onClear={handleClear}
                  onCheck={handleCheck}
                  isLoading={isLoading}
                />
              ) : (
                <CheckButton onPress={handleCheck} isLoading={isLoading} />
              )}
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>

        <MoreModalContainer
          visible={showMoreModal}
          onClose={() => setShowMoreModal(false)}
          navigation={navigation}
          handleTrialPress={handleTrialPress}
          showReviewAlert={() => {
            AnalyticsLogger.logEvent(MORE_MODAL_EVENTS.RATE);
            showReviewAlert();
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
