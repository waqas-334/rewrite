import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
  Image,
  ScrollView,
  Linking,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CloseIcon, InfoIcon } from "@/components/icon";
import { useStore } from "@/store/useStore";
import { adapty } from "react-native-adapty";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { showMessage } from "react-native-flash-message";
import { useTranslation } from "@/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckIcon from "@/components/icon/CheckIcon";

const { width } = Dimensions.get("window");
const starsHeight = width / (1152 / 600);

const Circles = ({ topOffset }: { topOffset: number }) => (
  <Image
    source={require("assets/circles.png")}
    style={{
      width: width - 92,
      height: width - 92,
      alignSelf: "center",
      position: "absolute",
      // backgroundColor: "red",
      top: "-50%",
      transform: [{ translateY: topOffset }],
    }}
  />
);

const SubscriptionScreen = () => {
  const navigation: any = useNavigation();
  const { products, setIsPremiumUser, isPremiumUser } = useStore();
  const [selectedPlan, setSelectedPlan] = useState<
    "weekly" | "monthly" | "yearly" | "annual_with_trial"
  >("yearly");
  const [trialEnabled, setTrialEnabled] = useState(false);
  const switchAnimation = useSharedValue(0);
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);
  const { t } = useTranslation("subscription");

  const toggleSwitch = () => {
    switchAnimation.value = withTiming(trialEnabled ? 0 : 1);
    const newTrialEnabled = !trialEnabled;
    setTrialEnabled(newTrialEnabled);

    // If enabling trial, force select weekly plan
    if (newTrialEnabled) {
      setSelectedPlan("annual_with_trial");
    } else {
      setSelectedPlan("yearly");
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: switchAnimation.value * 17,
        },
      ],
    };
  });

  const handlePurchase = async (
    productType: "weekly" | "monthly" | "yearly" | "annual_with_trial"
  ) => {
    setPurchaseLoading(productType);

    try {
      const product = products.find((p) => {
        // Match product based on vendor product ID
        return (
          (productType === "weekly" &&
            p.vendorProductId === "grammar.weekly.premium") ||
          (productType === "monthly" &&
            p.vendorProductId === "grammar.monthly.premium") ||
          (productType === "yearly" &&
            p.vendorProductId === "grammar.annual.premium") ||
          (productType === "annual_with_trial" &&
            p.vendorProductId === "grammar.annual.premium.with_trial")
        );
      });

      if (!product) {
        throw new Error(`No ${productType} product found`);
      }

      const purchaseResult = await adapty.makePurchase(product);

      if (purchaseResult?.accessLevels?.premium?.isActive) {
        setIsPremiumUser(true);
        navigation.navigate("Home");
        console.log(`Successfully purchased ${productType} plan`);
      } else {
        showMessage({
          message: t("purchaseFailed"),
          description: t("purchaseFailedMessage"),
          type: "danger",
        });
      }
    } catch (error: any) {
      console.error(`Purchase failed for ${productType}:`, error);
    } finally {
      setPurchaseLoading(null);
    }
  };

  const getProductPrice = (
    productType: "weekly" | "monthly" | "yearly" | "annual_with_trial"
  ) => {
    if (productType === "annual_with_trial") {
      const productId = "grammar.annual.premium.with_trial";
      return [
        products.find((p) => p.vendorProductId === productId)?.price?.amount,
        products.find((p) => p.vendorProductId === productId)?.price
          ?.currencySymbol,
      ];
    }

    const product = products.find(
      (p) =>
        p.vendorProductId ===
        `grammar.${productType === "yearly" ? "annual" : productType}.premium`
    );
    return [product?.price?.amount, product?.price?.currencySymbol];
  };

  // Helper function to check if plan should be disabled
  const isPlanDisabled = (
    planType: "weekly" | "monthly" | "yearly" | "annual_with_trial"
  ) => {
    return trialEnabled && planType !== "annual_with_trial";
  };

  const handleInfoPress = () => {
    showMessage({
      message: t("freeTrialInfo"),
      description: t("freeTrialDescription"),
      type: "info",
      duration: 4000,
      style: {
        backgroundColor: "#000",
      },
      titleStyle: {
        fontWeight: "600",
      },
    });
  };

  const handleRestore = async () => {
    try {
      const result = await adapty.restorePurchases();
      if (result?.accessLevels?.premium?.isActive) {
        setIsPremiumUser(true);
        showMessage({
          message: t("success"),
          description: t("premiumRestored"),
          type: "success",
        });
      } else {
        showMessage({
          message: t("noPurchases"),
          description: t("noPurchasesFound"),
          type: "info",
        });
      }
    } catch (error) {
      console.error("Restore failed:", error);
      showMessage({
        message: t("restoreFailed"),
        description: t("restoreFailedMessage"),
        type: "danger",
      });
    }
  };

  const calculateWeeklyPrice = (
    productType: "weekly" | "monthly" | "yearly" | "annual_with_trial"
  ) => {
    const [fullPrice, currencySymbol] = getProductPrice(productType);

    const fullPriceNumber = Number(fullPrice);

    if (isNaN(fullPriceNumber)) {
      return "";
    }

    // Extract number from price string (assuming format like "$11.99")

    let weeklyPrice;
    if (productType === "monthly") {
      weeklyPrice = fullPriceNumber * (7 / 30); // Assuming 4 weeks per month
    } else if (
      productType === "yearly" ||
      productType === "annual_with_trial"
    ) {
      weeklyPrice = fullPriceNumber * (7 / 365); // 52 weeks per year
    } else {
      weeklyPrice = fullPriceNumber; // Weekly price stays the same
    }

    // Format to 2 decimal places and add currency symbol
    return `${weeklyPrice.toFixed(2)}${currencySymbol}`;
  };

  const handleGoBack = async () => {
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Home");

    if (isPremiumUser) {
      return;
    }

    const hasViewedOffer = await AsyncStorage.getItem("hasViewedOffer");

    if (!hasViewedOffer) {
      navigation.navigate("Offer");
      AsyncStorage.setItem("hasViewedOffer", "true");
    }
  };

  const Feature = ({ text }: { text: string }) => (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: "rgba(117, 198, 137, 1)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CheckIcon width={11.15} height={8.57} />
      </View>

      <Text style={{ fontWeight: "500", fontSize: 16, color: "white" }}>
        {text}
      </Text>
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={{
        backgroundColor: "rgba(71, 40, 104, 1)",
        paddingBottom: 44,
      }}
      style={{ flex: 1, backgroundColor: "rgba(71, 40, 104, 1)" }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestore}
          >
            <Text style={styles.restoreText}>{t("restore")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleGoBack}
            style={{
              width: 29,
              height: 29,
              borderColor: "white",
              borderWidth: 2.5,
              borderRadius: 16,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CloseIcon width={11} height={11} color={"white"} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={[styles.imageContainer, { position: "relative" }]}>
            <Circles topOffset={starsHeight / 7} />
            <Image
              source={require("assets/stars.png")}
              style={{ width, height: starsHeight }}
            />
          </View>

          <Text style={styles.title}>{t("boostWritingSkills")}</Text>
          {/* <Text style={styles.subtitle}>{t("unlimitedGrammar")}</Text> */}
          <View style={{ alignSelf: "flex-start", gap: 12, top: -60 }}>
            <Feature text={t("feature1")} />
            <Feature text={t("feature2")} />
            <Feature text={t("feature3")} />
          </View>

          <View style={{ width: "100%", top: -33 }}>
            <View style={styles.trialContainer}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.trialText}>{t("freeTrial")}</Text>
                <View style={{ marginLeft: 8 }}>
                  <Pressable hitSlop={20} onPress={handleInfoPress}>
                    <InfoIcon width={14.33} height={14.33} color={"white"} />
                  </Pressable>
                </View>
              </View>
              <Pressable
                onPress={toggleSwitch}
                style={[
                  styles.trialSwitch,
                  trialEnabled && styles.trialSwitchActive,
                ]}
              >
                <Animated.View style={[styles.switchKnob, animatedStyle]} />
              </Pressable>
            </View>

            <View style={styles.plansContainer}>
              <Pressable
                style={[
                  styles.planOption,
                  selectedPlan === "weekly" && styles.selectedPlan,
                  purchaseLoading === "weekly" && styles.loadingPlan,
                  isPlanDisabled("weekly") && styles.disabledPlan,
                ]}
                onPress={() => setSelectedPlan("weekly")}
                disabled={!!purchaseLoading || isPlanDisabled("weekly")}
              >
                <View
                  style={[
                    styles.radioButton,
                    selectedPlan === "weekly" && styles.activeRadio,
                  ]}
                />
                <View style={styles.planInfo}>
                  <Text
                    style={[
                      styles.planText,
                      selectedPlan === "weekly" && {
                        color: "rgba(117, 198, 137, 1)",
                      },
                    ]}
                  >
                    {t("payWeekly")}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.planPrice,
                    {
                      color:
                        selectedPlan === "weekly"
                          ? "rgba(117, 198, 137, 1)"
                          : "white",
                    },
                  ]}
                >
                  {calculateWeeklyPrice("weekly")}
                  <Text
                    style={{
                      color:
                        selectedPlan === "weekly"
                          ? "rgba(117, 198, 137, 1)"
                          : "rgba(255, 255, 255, 0.64)",
                    }}
                  >
                    {t("per_week")}
                  </Text>
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.planOption,
                  selectedPlan === "monthly" && styles.selectedPlan,
                  purchaseLoading === "monthly" && styles.loadingPlan,
                  isPlanDisabled("monthly") && styles.disabledPlan,
                ]}
                onPress={() => setSelectedPlan("monthly")}
                disabled={!!purchaseLoading || isPlanDisabled("monthly")}
              >
                <View
                  style={[
                    styles.radioButton,
                    selectedPlan === "monthly" && styles.activeRadio,
                  ]}
                />
                <View style={styles.planInfo}>
                  <Text
                    style={[
                      styles.planText,
                      selectedPlan === "monthly" && {
                        color: "rgba(117, 198, 137, 1)",
                      },
                    ]}
                  >
                    {t("payMonthly")}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.planPrice,
                    {
                      color:
                        selectedPlan === "monthly"
                          ? "rgba(117, 198, 137, 1)"
                          : "white",
                    },
                  ]}
                >
                  {calculateWeeklyPrice("monthly")}
                  <Text
                    style={{
                      color:
                        selectedPlan === "monthly"
                          ? "rgba(117, 198, 137, 1)"
                          : "rgba(255, 255, 255, 0.64)",
                    }}
                  >
                    {t("per_week")}
                  </Text>
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.planOption,
                  (selectedPlan === "yearly" ||
                    selectedPlan === "annual_with_trial") &&
                    styles.selectedPlan,
                  (purchaseLoading === "yearly" ||
                    purchaseLoading === "annual_with_trial") &&
                    styles.loadingPlan,
                  isPlanDisabled(
                    trialEnabled ? "annual_with_trial" : "yearly"
                  ) && styles.disabledPlan,
                  // { width: 330 },
                ]}
                onPress={() =>
                  setSelectedPlan(trialEnabled ? "annual_with_trial" : "yearly")
                }
                disabled={
                  !!purchaseLoading ||
                  isPlanDisabled(trialEnabled ? "annual_with_trial" : "yearly")
                }
              >
                <View
                  style={[
                    styles.radioButton,
                    selectedPlan ===
                      (trialEnabled ? "annual_with_trial" : "yearly") &&
                      styles.activeRadio,
                  ]}
                />
                <View style={styles.planInfo}>
                  <Text
                    style={[
                      styles.planText,
                      (selectedPlan === "yearly" ||
                        selectedPlan === "annual_with_trial") && {
                        color: "rgba(117, 198, 137, 1)",
                      },
                    ]}
                  >
                    {t("payYearly")}
                  </Text>
                </View>
                <View style={styles.yearlyPriceContainer}>
                  <Text
                    style={[
                      styles.planPrice,
                      {
                        color:
                          selectedPlan === "yearly" ||
                          selectedPlan === "annual_with_trial"
                            ? "rgba(117, 198, 137, 1)"
                            : "white",
                      },
                    ]}
                  >
                    {calculateWeeklyPrice(
                      trialEnabled ? "annual_with_trial" : "yearly"
                    )}{" "}
                    <Text
                      style={{
                        color:
                          selectedPlan === "yearly" ||
                          selectedPlan === "annual_with_trial"
                            ? "rgba(117, 198, 137, 1)"
                            : "rgba(255, 255, 255, 0.64)",
                      }}
                    >
                      {t("per_week")}
                    </Text>
                  </Text>
                  {/* <Text style={styles.originalPrice}>$99.99</Text> */}
                </View>
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>{t("popular")}</Text>
                </View>
              </Pressable>
            </View>

            <TouchableOpacity
              style={styles.subscribeButton}
              onPress={() => !purchaseLoading && handlePurchase(selectedPlan)}
              disabled={!!purchaseLoading}
            >
              {purchaseLoading === selectedPlan ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.subscribeButtonText}>
                  {selectedPlan !== "annual_with_trial" && t("pay")}{" "}
                  {selectedPlan === "annual_with_trial"
                    ? t("freeTrial3Days")
                    : selectedPlan}{" "}
                  {getProductPrice(selectedPlan)}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL("https://deployglobal.ee/corrector/terms")
                }
              >
                <Text style={styles.footerLink}>{t("termsOfUse")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL("https://deployglobal.ee/corrector/privacy")
                }
              >
                <Text style={styles.footerLink}>{t("privacyPolicy")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(71, 40, 104, 1)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  closeButton: {
    fontSize: 24,
    color: "#000",
  },
  restoreButton: {
    padding: 4,
  },
  restoreText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5))",
    textDecorationLine: "underline",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  imageContainer: {
    marginBottom: 32,
  },
  illustrationPlaceholder: {
    width: 207,
    height: 207,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "rgba(255, 255, 255, 1)",
    marginBottom: 16,
    textAlign: "center",
    top: -72,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.5)",
    textAlign: "center",
    marginBottom: 32,
  },
  trialContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 24,
    gap: 8,
  },
  trialText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
  trialSwitch: {
    width: 41,
    height: 24,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 24,
    padding: 2,
    marginLeft: 8,
  },
  trialSwitchActive: {
    backgroundColor: "#000",
  },
  switchKnob: {
    width: 20,
    height: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  plansContainer: {
    width: "100%",
    gap: 12,
    marginBottom: 24,
  },
  planOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 12,
    borderWidth: 1,

    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  selectedPlan: {
    // borderColor: "#000",
    backgroundColor: "rgba(117, 198, 137, 0.12)",
    borderWidth: 2,
    borderColor: "rgba(117, 198, 137, 1)",
  },
  radioButton: {
    width: 16,
    height: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "white",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  activeRadio: {
    borderWidth: 4,
    borderColor: "rgba(117, 198, 137, 1)",
  },
  radioInnerSelected: {
    backgroundColor: "#000",
  },
  planInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  planText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  popularBadge: {
    backgroundColor: "rgba(117, 198, 137, 1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 40,
    position: "absolute",
    top: -8,
    right: 20,
  },
  popularText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  planPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  yearlyPriceContainer: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 16,
  },
  originalPrice: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.5)",
    textDecorationLine: "line-through",
  },
  subscribeButton: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  subscribeButtonText: {
    color: "rgba(55, 29, 82, 1)",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    gap: 24,
    marginTop: "auto",
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  footerLink: {
    color: "rgba(255, 255, 255, 0.5)",
    textDecorationLine: "underline",
  },
  loadingPlan: {
    opacity: 0.7,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
  },
  disabledPlan: {
    opacity: 0.5,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
});

export default SubscriptionScreen;
