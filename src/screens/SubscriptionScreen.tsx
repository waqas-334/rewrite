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
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CloseIcon, InfoIcon } from "@/components/icon";

const SubscriptionScreen = () => {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState<"weekly" | "yearly">(
    "yearly"
  );
  const [trialEnabled, setTrialEnabled] = useState(true);
  const switchAnimation = useRef(new Animated.Value(0)).current;

  const toggleSwitch = () => {
    const toValue = trialEnabled ? 0 : 1;
    Animated.spring(switchAnimation, {
      toValue,
      useNativeDriver: true,
      bounciness: 2,
    }).start();
    setTrialEnabled(!trialEnabled);
  };

  return (
    <ScrollView
      contentContainerStyle={{ backgroundColor: "rgba(222, 201, 244, 1)" }}
      style={{ flex: 1, backgroundColor: "rgba(222, 201, 244, 1)" }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.restoreButton}>
            <Text style={styles.restoreText}>Restore</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <CloseIcon width={11} height={11} color={"rgba(0, 0, 0, 0.05)"} />
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

          <Text style={styles.title}>Boost Your{"\n"}Writing Skills</Text>
          <Text style={styles.subtitle}>
            Unlimited grammar checks{"\n"}with 10+ language support.
          </Text>

          <View style={styles.trialContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.trialText}>14 Day Free Trial</Text>
              <View style={{ marginLeft: 8 }}>
                <InfoIcon width={14.33} height={14.33} />
              </View>
            </View>
            <Pressable
              onPress={toggleSwitch}
              style={[
                styles.trialSwitch,
                trialEnabled && styles.trialSwitchActive,
              ]}
            >
              <Animated.View
                style={[
                  styles.switchKnob,
                  {
                    transform: [
                      {
                        translateX: switchAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 17], // 41 - 20 - 4 (width - knob - padding*2)
                        }),
                      },
                    ],
                  },
                ]}
              />
            </Pressable>
          </View>

          <View style={styles.plansContainer}>
            <Pressable
              style={[
                styles.planOption,
                selectedPlan === "weekly" && styles.selectedPlan,
              ]}
              onPress={() => setSelectedPlan("weekly")}
            >
              <View
                style={[
                  styles.radioButton,
                  selectedPlan === "weekly" && styles.activeRadio,
                ]}
              />
              <View style={styles.planInfo}>
                <Text style={styles.planText}>Pay Weekly</Text>
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>POPULAR</Text>
                </View>
              </View>
              <Text style={styles.planPrice}>$4.99</Text>
            </Pressable>

            <Pressable
              style={[
                styles.planOption,
                selectedPlan === "yearly" && styles.selectedPlan,
              ]}
              onPress={() => setSelectedPlan("yearly")}
            >
              <View
                style={[
                  styles.radioButton,
                  selectedPlan === "yearly" && styles.activeRadio,
                ]}
              />
              <View style={styles.planInfo}>
                <Text style={styles.planText}>Pay Yearly</Text>
              </View>
              <View style={styles.yearlyPriceContainer}>
                <Text style={styles.planPrice}>$69.99</Text>
                <Text style={styles.originalPrice}>$99.99</Text>
              </View>
            </Pressable>
          </View>

          <TouchableOpacity style={styles.subscribeButton}>
            <Text style={styles.subscribeButtonText}>
              Pay {selectedPlan === "weekly" ? "Weekly" : "Yearly"}{" "}
              {selectedPlan === "weekly" ? "$4.99" : "$69.99"}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Terms of Use</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Privacy Policy</Text>
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
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  popularBadge: {
    backgroundColor: "#000",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  popularText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  planPrice: {
    fontSize: 16,
    fontWeight: "600",
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
});

export default SubscriptionScreen;
