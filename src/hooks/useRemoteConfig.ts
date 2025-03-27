import { useEffect } from "react";
import { getRemoteConfig } from "@react-native-firebase/remote-config";
import { useStore } from "@/store/useStore";

const remoteConfig = getRemoteConfig();

export default function useRemoteConfig() {
  const setShowOffer = useStore((state) => state.setShowOffer);
  const setCloseDuration = useStore((state) => state.setCloseDuration);
  const setShowReviewPopup = useStore((state) => state.setShowReviewPopup);
  const setDailyFreeTries = useStore((state) => state.setDailyFreeTries);
  const setApiKey = useStore((state) => state.setApiKey);
  useEffect(() => {
    remoteConfig
      .setConfigSettings({
        minimumFetchIntervalMillis: 0,
        fetchTimeMillis: 0,
      })
      .then(() =>
        remoteConfig.setDefaults({
          show_offer: false,
          close_duration: 18,
          show_review_popup: false,
          daily_free_tries: 1,
          api_key: "",
        })
      )
      .then(() => {
        return remoteConfig.fetch(0);
      })
      .then(() => remoteConfig.activate())
      .then(() => {
        const showOffer = remoteConfig.getBoolean("show_offer");
        const closeDuration = remoteConfig.getNumber("close_duration");
        const showReviewPopup = remoteConfig.getBoolean("show_review_popup");
        const dailyFreeTries = remoteConfig.getNumber("daily_free_tries");
        const apiKey = remoteConfig.getString("api_key");
        setShowOffer(showOffer);
        setCloseDuration(closeDuration);
        setShowReviewPopup(showReviewPopup);
        setDailyFreeTries(dailyFreeTries);
        setApiKey(apiKey);
      })
      .catch((error) => {});
  }, []);
}
