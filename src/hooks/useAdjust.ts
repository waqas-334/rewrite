import { useEffect } from "react";
import { Adjust, AdjustConfig, AdjustEvent } from "react-native-adjust";

export default function useAdjust() {
  useEffect(() => {
    const adjustConfig = new AdjustConfig(
      process.env.ADJUST_TOKEN,
      process.env.ENV === "development"
        ? AdjustConfig.EnvironmentSandbox
        : AdjustConfig.EnvironmentProduction
    );

    Adjust.initSdk(adjustConfig);

    const adjustEvent = new AdjustEvent("APP_OPEN");
    Adjust.trackEvent(adjustEvent);

    return () => {
      Adjust.componentWillUnmount();
    };
  }, []);
}
