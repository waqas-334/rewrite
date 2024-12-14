import { useEffect, useState } from "react";
import { adapty, AdaptyProfile } from "react-native-adapty";
import { useStore } from "../store/useStore";

const useAdapt = () => {
  const [initLoading, setInitLoading] = useState(false);
  const [inited, setInited] = useState(false);
  const { setProducts, setIsPremiumUser, setGlobalLoading } = useStore();

  useEffect(() => {
    const fetchProducts = async () => {
      if (inited) return;

      setInitLoading(true);
      setInited(true);
      try {
        const locale = "en";
        try {
          await adapty.activate("public_live_GTSAGdVj.BGgKoTo4Q88NKnjtMora");
        } catch (error) {
          console.error("Adapty activation failed");
          throw error;
        }

        let products = [];
        try {
          const paywall = await adapty.getPaywall(
            "grammar.standard.placement",
            locale
          );

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

        try {
          const adaptyProfile = await adapty.getProfile();
          const isPremium = !!adaptyProfile?.accessLevels?.premium?.isActive;

          if (!isPremium) {
            try {
              console.log("Checking for previous purchases...");
              adapty
                .restorePurchases()
                .then((profile) => {
                  const isSubscribed =
                    !!profile?.accessLevels?.premium?.isActive;

                  if (isSubscribed) {
                    console.log("Premium subscription restored");
                    setIsPremiumUser(true);
                  } else {
                    console.log(
                      "No previous premium subscription found - this is normal for new users"
                    );
                    setIsPremiumUser(false);
                  }
                })
                .catch((error) => {
                  console.error("Error restoring purchases:", error);
                });
            } catch (restoreError: any) {
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
        setGlobalLoading(false);
      }
    };

    fetchProducts();

    return () => adapty?.removeAllListeners();
  }, []);

  return { initLoading };
};

export default useAdapt;
