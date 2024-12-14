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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CloseIcon } from "@/components/icon";
import { useStore } from "@/store/useStore";
import { adapty } from "react-native-adapty";
import { showMessage } from "react-native-flash-message";
import { useTranslation } from "@/i18n";
import { CircularProgress } from "react-native-circular-progress";

const Offer = () => {
  const navigation = useNavigation();
  const { products } = useStore();
  const product = products.find(
    (p) => p.vendorProductId === "grammar.annual.premium.with_offer"
  );
  console.log({ product });
  const [timeLeft, setTimeLeft] = useState(120);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const { t } = useTranslation("offer");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
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
    setPurchaseLoading(true);
    try {
      if (!product) {
        throw new Error("Product not found");
      }

      const purchaseResult = await adapty.makePurchase(product);

      if (purchaseResult?.accessLevels?.premium?.isActive) {
        navigation.goBack();
      }
    } catch (error: any) {
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

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#FEEACF" }}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.restoreText}>{t("restore")}</Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.closeButton}
          >
            <CircularProgress
              size={29}
              width={2.5}
              fill={(timeLeft / 120) * 100}
              tintColor="#000"
              backgroundColor="transparent"
              rotation={0}
              lineCap="round"
            >
              {() => <CloseIcon width={11} height={11} color="#000" />}
            </CircularProgress>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Image
            source={require("@a/sale.png")}
            style={styles.image}
            resizeMode="contain"
          />

          <Text style={styles.discountText}>{t("discount")}</Text>
          <Text style={styles.exclusiveText}>{t("exclusiveSale")}</Text>
          <Text style={styles.timerText}>
            {t("offerExpires")} {formatTime(timeLeft)}
          </Text>

          <View style={styles.featuresContainer}>
            <View style={styles.featureRow}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.featureText}>
                {t("features.unlimitedGrammar")}
              </Text>
            </View>
            <View style={styles.featureRow}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.featureText}>
                {t("features.languageSupport")}
              </Text>
            </View>
            <View style={styles.featureRow}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.featureText}>
                {t("features.instantFeedback")}
              </Text>
            </View>
            <View style={styles.featureRow}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.featureText}>
                {t("features.enhancedAccuracy")}
              </Text>
            </View>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>
              {t("pricePrefix")}{" "}
              <Text style={styles.strikethroughPrice}>$29.99</Text>
              {product?.price?.localizedString}
              {t("yearSuffix")}
            </Text>
            <Text style={styles.subscriptionText}>{t("autoRenewable")}</Text>
          </View>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handlePurchase}
            disabled={purchaseLoading}
          >
            {purchaseLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.continueButtonText}>{t("continue")}</Text>
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
    backgroundColor: "#FEEACF",
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
    color: "rgba(0, 0, 0, 0.5)",
    textDecorationLine: "underline",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  imageContainer: {
    marginBottom: 24,
    alignItems: "center",
  },
  image: {
    width: 216,
    height: 175,
    marginBottom: 8,
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
    fontSize: 48,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  exclusiveText: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(0, 0, 0, 0.5)",
    marginBottom: 8,
  },
  timerText: {
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.5)",
    marginBottom: 24,
  },
  featuresContainer: {
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkmark: {
    fontSize: 16,
    marginRight: 12,
    color: "#000",
  },
  featureText: {
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.7)",
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
    fontSize: 14,
  },
  strikethroughPrice: {
    textDecorationLine: "line-through",
  },
});

export default Offer;
