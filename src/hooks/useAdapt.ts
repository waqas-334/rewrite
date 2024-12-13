import { useEffect, useState } from "react";
import { adapty, AdaptyProfile } from "react-native-adapty";
import { useStore } from "../store/useStore";
import { ADAPTY_PLACEMENT_ID, ADAPTY_PUBLIC_KEY } from "@env";

const useAdapt = () => {
  const [initLoading, setInitLoading] = useState(false);
  const [inited, setInited] = useState(false);
  const [storeKitError, setStoreKitError] = useState<string | null>(null);
  const { setProducts, setIsPremiumUser } = useStore();

  useEffect(() => {
    const fetchProducts = async () => {
      if (inited) return;

      setInitLoading(true);
      setInited(true);
      try {
        const locale = "en";

        if (!ADAPTY_PUBLIC_KEY || !ADAPTY_PLACEMENT_ID) {
          throw new Error("Missing Adapty configuration keys");
        }

        try {
          await adapty.activate(ADAPTY_PUBLIC_KEY);
        } catch (error) {
          console.error("Adapty activation failed");
          throw error;
        }

        let products = [];
        try {
          const paywall = await adapty.getPaywall(ADAPTY_PLACEMENT_ID, locale);

          if (!paywall) {
            console.warn("Paywall is null or undefined");
            return;
          }

          products = await adapty.getPaywallProducts(paywall);
          console.log({ products });

          if (products && products.length > 0) {
            console.log(`Successfully fetched ${products.length} products`);
            setProducts(products);
          } else {
            console.warn("No products found in paywall");
          }
        } catch (error: any) {
          console.error("Paywall or products fetch failed");
        }

        // Simplified premium status check
        try {
          const adaptyProfile = await adapty.getProfile();
          const isPremium = !!adaptyProfile?.accessLevels?.premium?.isActive;

          if (!isPremium) {
            try {
              console.log("Checking for previous purchases...");
              const restoreProfile = await adapty.restorePurchases();
              const isSubscribed =
                !!restoreProfile?.accessLevels?.premium?.isActive;

              if (isSubscribed) {
                console.log("Premium subscription restored");
                setIsPremiumUser(true);
              } else {
                console.log(
                  "No previous premium subscription found - this is normal for new users"
                );
                setIsPremiumUser(false);
              }
            } catch (restoreError: any) {
              // This is not necessarily an error - just means no purchases to restore
              console.log("No purchases to restore");
              setIsPremiumUser(false);
            }
          } else {
            console.log("Active premium subscription found");
            setIsPremiumUser(true);
          }
        } catch (profileError) {
          console.error("Profile check failed");
        }

        // Enhanced event listener
        adapty.addEventListener(
          "onLatestProfileLoad",
          (profile: AdaptyProfile) => {
            const isPremiumActive = !!profile?.accessLevels?.premium?.isActive;
            console.log(
              "Profile update received, premium status:",
              isPremiumActive
            );
            setIsPremiumUser(isPremiumActive);
          }
        );
      } catch (e) {
        console.error("Adapty initialization failed:", e);
      } finally {
        setInitLoading(false);
      }
    };

    fetchProducts();

    return () => adapty?.removeAllListeners();
  }, []);

  return { initLoading, storeKitError };
};

export default useAdapt;
