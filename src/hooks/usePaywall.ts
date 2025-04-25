import { useStore } from "@/store/useStore";
import { useNavigation } from "@react-navigation/native";
import { adapty } from "react-native-adapty";
import { createPaywallView } from "react-native-adapty/dist/ui";

const usePaywall = () => {
  //   const navigation = useNavigation();
  const setIsPremiumUser = useStore((state) => state.setIsPremiumUser);

  const showPaywall = async () => {
    const paywall = await adapty.getPaywall("test-alpha", "en", {});
    const view = await createPaywallView(paywall);
    view.registerEventHandlers({
      onCloseButtonPress: () => {
        view.dismiss();
      },
      onProductSelected: (product) => {
        view.dismiss();
        setIsPremiumUser(true);
      },
    });
    view.present();
  };

  return { showPaywall };
};

export default usePaywall;
