import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  ActivityIndicator,
  Dimensions,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CloseIcon } from "@/components/icon";
import { useStore } from "@/store/useStore";
import { adapty } from "react-native-adapty";
import { showMessage } from "react-native-flash-message";
import { useTranslation } from "@/i18n";
import CheckIcon from "@/components/icon/CheckIcon";
import { LinearGradient } from "expo-linear-gradient";
import AnalyticsLogger from "@/hooks/logger/remoteLogger";

const Offer = ({ route }: { route: any }) => {
  const navigation = useNavigation();
  const { products } = useStore();
  const product = products.find(
    (p) => p.vendorProductId === "grammar.annual.premium.with_offer"
  );

  const _timeLeft = Number(route.params?.timeLeft || 120);
  const [timeLeft, setTimeLeft] = useState(_timeLeft);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const { t } = useTranslation("offer");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigation.goBack();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigation]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handlePurchase = async () => {
    AnalyticsLogger.logEvent("offer_handlePurchase");
    setPurchaseLoading(true);
    try {
      if (!product) {
        throw new Error("Product not found");
      }

      const purchaseResult = await adapty.makePurchase(product);

      if (purchaseResult?.accessLevels?.premium?.isActive) {
        AnalyticsLogger.logEvent("offer_handlePurchase_success");
        navigation.goBack();
      }
    } catch (error: any) {
      AnalyticsLogger.logEvent("offer_handlePurchase_error");
      console.error("Purchase failed:", error);
      showMessage({
        message: "Purchase Failed",
        description: error?.message || "Please try again later",
        type: "danger",
      });
    } finally {
      setPurchaseLoading(false);
    }
  };

  const handleGoBack = () => {
    AnalyticsLogger.logEvent("offer_handleGoBack");
    Alert.alert("Sure closing? 💔", "It's our biggest discount ever.", [
      {
        text: "Close the discount",
        style: "destructive",
        onPress: () => navigation.goBack(),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "rgba(138, 29, 106, 1)" }}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <SafeAreaView style={styles.container}>
        <Image
          source={require("@a/gift.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.header}>
          <Text style={styles.restoreText}>{t("restore")}</Text>
          <TouchableOpacity onPress={handleGoBack} style={styles.closeButton}>
            <View style={styles.circularBorder}>
              <CloseIcon width={11} height={11} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.discountText}>{t("limitedOffer")}</Text>
          <Text style={styles.exclusiveText}>{t("offerDescription")}</Text>
          <Text style={styles.timeLeft}>{formatTime(timeLeft)}</Text>

          <View style={styles.offerCard}>
            <View style={styles.saleTag}>
              <Text style={styles.saleTagText}>33% SALE</Text>
            </View>
            <Text style={styles.yearlyText}>{t("yearly")}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.oldPrice}>$29.99</Text>
              <Text style={styles.currentPrice}>
                {product?.price?.localizedString}
              </Text>
            </View>
          </View>

          <View style={styles.featuresContainer}>
            <View style={styles.featureRow}>
              <View style={styles.checkmarkContainer}>
                <CheckIcon
                  width={11.15}
                  height={8.57}
                  color="rgba(108, 17, 82, 1)"
                />
              </View>
              <Text style={styles.featureText}>
                {t("features.unlimitedAccess")}
              </Text>
            </View>
            <View style={styles.featureRow}>
              <View style={styles.checkmarkContainer}>
                <CheckIcon
                  width={11.15}
                  height={8.57}
                  color="rgba(108, 17, 82, 1)"
                />
              </View>
              <Text style={styles.featureText}>
                {t("features.fasterResults")}
              </Text>
            </View>
            <View style={styles.featureRow}>
              <View style={styles.checkmarkContainer}>
                <CheckIcon
                  width={11.15}
                  height={8.57}
                  color="rgba(108, 17, 82, 1)"
                />
              </View>
              <Text style={styles.featureText}>{t("features.advancedAI")}</Text>
            </View>
          </View>

          <Text
            style={{
              fontWeight: "500",
              fontSize: 16,
              color: "#fff",
              marginBottom: 16,
            }}
          >
            Secured by Apple. Cancel anytime
          </Text>

          <TouchableOpacity
            style={{ width: "100%" }}
            onPress={handlePurchase}
            disabled={purchaseLoading}
          >
            <LinearGradient
              colors={["rgba(255, 220, 119, 1)", "rgba(250, 149, 55, 1)"]}
              style={styles.continueButton}
            >
              {purchaseLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.continueButtonText}>{t("continue")}</Text>
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
      </SafeAreaView>
    </ScrollView>
  );
};

const width = Dimensions.get("window").width;
const imageWidth = width - 90;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(138, 29, 106, 1)",
  },
  timeLeft: {
    fontSize: 20,
    fontWeight: "900",
    color: "#fff",
    alignSelf: "flex-start",
    marginBlock: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  closeButton: {
    width: 29,
    height: 29,
    justifyContent: "center",
    alignItems: "center",
  },
  restoreText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    textDecorationLine: "underline",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    marginTop: imageWidth * 0.5,
  },
  imageContainer: {
    marginBottom: 24,
    alignItems: "center",
  },
  image: {
    width: imageWidth,
    height: imageWidth,
    position: "absolute",
    alignSelf: "center",
    top: 34,
  },
  imageDimensions: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  dimensionsText: {
    color: "#fff",
    fontSize: 12,
  },
  discountText: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 8,
  },
  exclusiveText: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: 8,
    textAlign: "center",
    width: 251,
  },
  timerText: {
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.5)",
    marginBottom: 24,
  },
  featuresContainer: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    gap: 12,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    // marginBottom: 12,
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: 100,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkmark: {
    fontSize: 16,
    marginRight: 12,
    color: "rgba(108, 17, 82, 1)",
  },
  featureText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  priceContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 8,
  },
  subscriptionText: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.5)",
  },
  continueButton: {
    width: "100%",
    backgroundColor: "#000",
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  continueButtonText: {
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
  },
  footerLink: {
    color: "rgba(255, 255, 255, 0.5)",
    textDecorationLine: "underline",
    fontSize: 14,
  },
  strikethroughPrice: {
    textDecorationLine: "line-through",
  },
  offerCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    width: "100%",
    height: 56,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#fff",
    paddingHorizontal: 24,
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    marginBottom: 16,
  },
  saleTag: {
    position: "absolute",
    top: -10,
    right: 31.5,
    borderRadius: 40,
    backgroundColor: "#fff",
    width: 88,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  saleTagText: {
    color: "rgba(108, 17, 82, 1)",
    fontWeight: "900",
    fontSize: 10,
  },
  yearlyText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  priceRow: {
    flexDirection: "row",
    gap: 8,
  },
  oldPrice: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
    fontWeight: "400",
    textDecorationLine: "line-through",
  },
  currentPrice: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  circularBorder: {
    width: 29,
    height: 29,
    borderWidth: 2.5,
    borderColor: "#fff",
    borderRadius: 29 / 2,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Offer;
