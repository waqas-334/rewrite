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

const SubscriptionScreen = () => {
  const navigation: any = useNavigation();
  const { products, setIsPremiumUser } = useStore();
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
        console.log(`Successfully purchased ${productType} plan`);
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
    console.log(planType, trialEnabled && planType !== "annual_with_trial");

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

  return (
    <ScrollView
      contentContainerStyle={{
        backgroundColor: "rgba(222, 201, 244, 1)",
        paddingBottom: 44,
      }}
      style={{ flex: 1, backgroundColor: "rgba(222, 201, 244, 1)" }}
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
            onPress={() => {
              navigation.canGoBack()
                ? navigation.goBack()
                : navigation.navigate("Home");

              setTimeout(async () => {
                const hasViewedOffer = await AsyncStorage.getItem(
                  "hasViewedOffer"
                );

                if (!hasViewedOffer) {
                  navigation.navigate("Offer");
                  AsyncStorage.setItem("hasViewedOffer", "true");
                }
              }, 1000);
            }}
            style={{
              width: 29,
              height: 29,
              borderColor: "#000",
              borderWidth: 2.5,
              borderRadius: 16,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CloseIcon width={11} height={11} color={"#fff"} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.imageContainer}>
            {/* Replace with your actual image component */}
            <Image
              source={require("@a/docs.png")}
              style={styles.illustrationPlaceholder}
            />
          </View>

          <Text style={styles.title}>{t("boostWritingSkills")}</Text>
          <Text style={styles.subtitle}>{t("unlimitedGrammar")}</Text>

          <View style={styles.trialContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.trialText}>{t("freeTrial")}</Text>
              <View style={{ marginLeft: 8 }}>
                <Pressable hitSlop={20} onPress={handleInfoPress}>
                  <InfoIcon width={14.33} height={14.33} />
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
                <Text style={styles.planText}>{t("payWeekly")}</Text>
              </View>
              <Text style={styles.planPrice}>
                {calculateWeeklyPrice("weekly")}
                {t("per_week")}
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
                <Text style={styles.planText}>{t("payMonthly")}</Text>
              </View>
              <Text style={styles.planPrice}>
                {calculateWeeklyPrice("monthly")} {t("per_week")}
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
                isPlanDisabled(trialEnabled ? "annual_with_trial" : "yearly") &&
                  styles.disabledPlan,
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
                <Text style={styles.planText}>{t("payYearly")}</Text>
                {Dimensions.get("window").width > 385 && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>{t("popular")}</Text>
                  </View>
                )}
              </View>
              <View style={styles.yearlyPriceContainer}>
                <Text style={styles.planPrice}>
                  {calculateWeeklyPrice(
                    trialEnabled ? "annual_with_trial" : "yearly"
                  )}{" "}
                  {t("per_week")}
                </Text>
                {/* <Text style={styles.originalPrice}>$99.99</Text> */}
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
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(222, 201, 244, 1)",
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
    color: "rgba(0, 0, 0, 0.5)",
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
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    marginBottom: 16,
    textAlign: "center",
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
    color: "#000",
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

    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  selectedPlan: {
    // borderColor: "#000",
    backgroundColor: "#fff",
  },
  radioButton: {
    width: 16,
    height: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#000",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  activeRadio: {
    borderWidth: 4,
    // width: 12,
    // height: 12,
    // borderRadius: 6,
    // backgroundColor: "transparent",
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
    fontWeight: "500",
    color: "#000",
  },
  popularBadge: {
    backgroundColor: "#000",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 40,
  },
  popularText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  planPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
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
    backgroundColor: "#000",
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  subscribeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    gap: 24,
    marginTop: "auto",
    marginBottom: 24,
  },
  footerLink: {
    color: "rgba(0, 0, 0, 0.5)",
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
