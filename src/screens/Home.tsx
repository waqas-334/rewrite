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
  ScrollView,
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

const Header = ({ onMenuPress }: { onMenuPress: () => void }) => {
  const navigation: any = useNavigation();
  const isPremiumUser = useStore((state) => state.isPremiumUser);

  return (
    <View style={styles.header}>
      <Text style={styles.title}>Home</Text>

      {!isPremiumUser && (
        <TouchableOpacity
          style={styles.trialButton}
          onPress={() => navigation.navigate("Subscription")}
        >
          <CrownIcon width={20} height={16} fill="#FF9200" />
          <Text style={styles.trialText}>Free Trial</Text>
          <RightIcon />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={styles.menuButtonContainer}
        onPress={onMenuPress}
      >
        <MenuIcon width={16} height={10} />
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
  const { t } = useTranslation("home");

  const { checkGrammar } = useGrammar();

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
    setShowResult(false);
  };
  const handleCheck = async () => {
    if (text.length === 0) {
      return;
    }

    try {
      if (!isPremiumUser) {
        const today = new Date().toDateString();
        const storedData = await AsyncStorage.getItem("grammarChecks");
        const checks = storedData ? JSON.parse(storedData) : {};

        const todayChecks = checks[today] || 0;

        if (todayChecks >= 3) {
          Alert.alert(t("dailyLimitTitle"), t("dailyLimitMessage"), [
            {
              text: t("upgrade"),
              onPress: () => navigation.navigate("Subscription"),
            },
            {
              text: t("cancel"),
              style: "cancel",
            },
          ]);
          return;
        }

        checks[today] = todayChecks + 1;
        await AsyncStorage.setItem("grammarChecks", JSON.stringify(checks));
      }

      setIsLoading(true);
      inputRef?.current?.blur?.();
      Keyboard.dismiss();

      const result = await checkGrammar(text);
      setResult(result);
      setShowResult(true);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
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
        <Header onMenuPress={() => setShowMoreModal(true)} />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingView}
          >
            <View style={styles.content}>
              {!showResult && (
                <Animated.Text style={[styles.heading, headingAnimatedStyle]}>
                  {t("checkGrammar")}
                </Animated.Text>
              )}
              <Animated.View
                style={[styles.inputContainer, resultAnimatedStyle]}
              >
                <TextInput
                  style={styles.input}
                  multiline
                  placeholder={t("enterText")}
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
                  ref={inputRef}
                />
                <Animated.View style={[styles.pasteButton]}>
                  <TouchableOpacity
                    onPress={handlePaste}
                    style={styles.pasteButtonContent}
                  >
                    <PasteIcon width={12.92} height={15.42} />
                    <Text style={styles.pasteText}>{t("paste")}</Text>
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
                    <Text style={styles.correctedText}>{result}</Text>
                  </ScrollView>
                  <TouchableOpacity
                    style={styles.shareIconWrapper}
                    onPress={() => {
                      Share.share({
                        message: result,
                      })
                        .then((res) => console.log(res))
                        .catch((error) => console.log(error));
                    }}
                  >
                    <ShareIcon
                      width={20}
                      height={20}
                      color="rgba(0, 0, 0, 0.5)"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.copyIconWrapper}
                    onPress={handleCopy}
                  >
                    <CopyIcon
                      width={20}
                      height={20}
                      color="rgba(0, 0, 0, 0.5)"
                    />
                  </TouchableOpacity>
                </Animated.View>
              )}
              {showResult ? (
                <View style={styles.resultFooter}>
                  <TouchableOpacity
                    style={styles.trashButton}
                    onPress={handleClear}
                  >
                    <EditIcon width={17.92} height={17.92} fill="#000" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.againButton,
                      isLoading && styles.disabledButton,
                    ]}
                    onPress={() => {
                      handleCheck();
                    }}
                    disabled={isLoading}
                  >
                    <View style={styles.againContent}>
                      {isLoading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <>
                          <RepeatIcon width={16} height={16} fill="#fff" />
                          <Text style={styles.againText}>{t("reCheck")}</Text>
                        </>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.checkButton,
                    isLoading && styles.disabledButton,
                  ]}
                  onPress={handleCheck}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.checkButtonText}>{t("check")}</Text>
                  )}
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
            navigation.navigate("Subscription");
          }}
          onRatePress={() => {
            // Handle rate press
          }}
          onSharePress={() => {
            Share.share({
              message: t("shareMessage"),
              url: "https://example.com", // Replace with your app's URL
              title: t("shareTitle"),
            })
              .then((_) => {})
              .catch((error) => console.log(error));
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
  resultFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  trashButton: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  againButton: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 100,
    height: 48,
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
