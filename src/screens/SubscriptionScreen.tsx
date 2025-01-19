import React, { useState, useRef, useEffect } from "react";
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

import { showMessage } from "react-native-flash-message";
import { useTranslation } from "@/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckIcon from "@/components/icon/CheckIcon";
import { LinearGradient } from "expo-linear-gradient";
import CircularProgress from "react-native-circular-progress-indicator";

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
      top: "-50%",
      transform: [{ translateY: topOffset }],
    }}
  />
);

const SubscriptionScreen = () => {
  const navigation: any = useNavigation();
  const { products, setIsPremiumUser, isPremiumUser, setOfferTimeLeft } =
    useStore();
  const [selectedPlan, setSelectedPlan] = useState<
    "weekly" | "monthly" | "annual_with_trial"
  >("annual_with_trial");
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);
  const { t } = useTranslation("subscription");
  const [canClose, setCanClose] = useState(false);

  const handlePurchase = async (
    productType: "weekly" | "monthly" | "annual_with_trial"
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
    productType: "weekly" | "monthly" | "annual_with_trial"
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
      (p) => p.vendorProductId === `grammar.${productType}.premium`
    );
    return [product?.price?.amount, product?.price?.currencySymbol];
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
    productType: "weekly" | "monthly" | "annual_with_trial"
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
    } else if (productType === "annual_with_trial") {
      weeklyPrice = fullPriceNumber * (7 / 365); // 52 weeks per year
    } else {
      weeklyPrice = fullPriceNumber; // Weekly price stays the same
    }

    // Format to 2 decimal places and add currency symbol
    return `${weeklyPrice.toFixed(2)}${currencySymbol}`;
  };

  const handleGoBack = async () => {
    if (!canClose) return;

    navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Home");

    if (isPremiumUser) {
      return;
    }

    const today = new Date();
    const targetDate = new Date("2025-01-22");

    if (today < targetDate) {
      return;
    }

    const hasViewedOffer = await AsyncStorage.getItem("hasViewedOffer");

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    if (!hasViewedOffer || new Date(hasViewedOffer) < oneWeekAgo) {
      navigation.navigate("Offer", { timeLeft: 120 });
      const currentDate = new Date();

      setOfferTimeLeft(currentDate.getTime());

      const date = new Date().toISOString();
      AsyncStorage.setItem("hasViewedOffer", date);
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
      showsVerticalScrollIndicator={false}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestore}
          >
            <Text style={styles.restoreText}>{t("restore")}</Text>
          </TouchableOpacity>

          <Pressable
            style={styles.closeButton}
            onPress={() => canClose && handleGoBack()}
            disabled={!canClose}
          >
            <CircularProgress
              value={100}
              radius={16}
              duration={15000}
              progressValueColor={"transparent"}
              activeStrokeColor={"white"}
              inActiveStrokeColor={"rgba(255,255,255,0.3)"}
              inActiveStrokeWidth={2.5}
              activeStrokeWidth={2.5}
              onAnimationComplete={() => setCanClose(true)}
            />
            <CloseIcon
              style={{ position: "absolute" }}
              width={11}
              height={11}
              color={canClose ? "white" : "rgba(255,255,255,0.3)"}
            />
          </Pressable>
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
            <View style={styles.plansContainer}>
              <Pressable
                style={[
                  styles.planOption,
                  selectedPlan === "annual_with_trial" && styles.selectedPlan,
                  purchaseLoading === "annual_with_trial" && styles.loadingPlan,
                ]}
                onPress={() => setSelectedPlan("annual_with_trial")}
                disabled={!!purchaseLoading}
              >
                <View
                  style={[
                    styles.radioButton,
                    selectedPlan === "annual_with_trial" && styles.activeRadio,
                  ]}
                />
                <View style={styles.planInfo}>
                  <Text
                    style={[
                      styles.planText,
                      selectedPlan === "annual_with_trial" && {
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
                          selectedPlan === "annual_with_trial"
                            ? "rgba(117, 198, 137, 1)"
                            : "white",
                      },
                    ]}
                  >
                    {calculateWeeklyPrice("annual_with_trial")}{" "}
                    <Text
                      style={{
                        color:
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

              <Pressable
                style={[
                  styles.planOption,
                  selectedPlan === "monthly" && styles.selectedPlan,
                  purchaseLoading === "monthly" && styles.loadingPlan,
                ]}
                onPress={() => setSelectedPlan("monthly")}
                disabled={!!purchaseLoading}
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
                  selectedPlan === "weekly" && styles.selectedPlan,
                  purchaseLoading === "weekly" && styles.loadingPlan,
                ]}
                onPress={() => setSelectedPlan("weekly")}
                disabled={!!purchaseLoading}
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
            </View>

            {selectedPlan === "annual_with_trial" && (
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: 16,
                  fontWeight: "500",
                  marginBottom: 8,
                  textAlign: "center",
                }}
              >
                {t("freeTrial3Days")} {getProductPrice(selectedPlan).join("")}
              </Text>
            )}

            <TouchableOpacity
              onPress={() => !purchaseLoading && handlePurchase(selectedPlan)}
              disabled={!!purchaseLoading}
            >
              <LinearGradient
                style={styles.subscribeButton}
                colors={["rgba(250, 148, 55, 1)", "rgba(225, 220, 119, 1)"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
              >
                {purchaseLoading === selectedPlan ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.subscribeButtonText}>
                    {selectedPlan !== "annual_with_trial" &&
                      `${t("Pay")} ${selectedPlan} ${getProductPrice(
                        selectedPlan
                      ).join("")}`}{" "}
                    {selectedPlan === "annual_with_trial" &&
                      t("startFreeTrial")}
                  </Text>
                )}
              </LinearGradient>
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
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: 12,
    top: -24,
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
    gap: 9,
    marginBottom: 24,
  },
  planOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 18,
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
    color: "rgba(54, 28, 82, 1)",
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
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 24,
  },
  subscribeButtonText: {
    color: "rgba(55, 29, 82, 1)",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 20,
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
