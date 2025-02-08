import { create } from "zustand";
import { AdaptyPaywallProduct, ProductReference } from "react-native-adapty";

interface Store {
  products: AdaptyPaywallProduct[];
  isPremiumUser: boolean;
  currentLanguage: string;
  setProducts: (products: AdaptyPaywallProduct[]) => void;
  setIsPremiumUser: (isPremium: boolean) => void;
  setCurrentLanguage: (language: string) => void;
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
  offerTimeLeft: number | null;
  setOfferTimeLeft: (timeLeft: number | null) => void;
  dailyFreeTries: number;
  setDailyFreeTries: (tries: number) => void;
  showOffer: boolean;
  setShowOffer: (show: boolean) => void;
  closeDuration: number;
  setCloseDuration: (duration: number) => void;
  showReviewPopup: boolean;
  setShowReviewPopup: (show: boolean) => void;
}

export const useStore = create<Store>((set) => ({
  products: [],
  isPremiumUser: false,
  currentLanguage: "en", // default language
  setProducts: (products: AdaptyPaywallProduct[]) => set({ products }),
  setIsPremiumUser: (isPremiumUser: boolean) => set({ isPremiumUser }),
  setCurrentLanguage: (currentLanguage: string) => set({ currentLanguage }),
  globalLoading: true,
  setGlobalLoading: (loading: boolean) => set({ globalLoading: loading }),
  offerTimeLeft: null,
  setOfferTimeLeft: (timeLeft: number | null) =>
    set({ offerTimeLeft: timeLeft }),
  dailyFreeTries: 0,
  setDailyFreeTries: (tries: number) => set({ dailyFreeTries: tries }),
  showOffer: false,
  setShowOffer: (show: boolean) => set({ showOffer: show }),
  closeDuration: 0,
  setCloseDuration: (duration: number) => set({ closeDuration: duration }),
  showReviewPopup: false,
  setShowReviewPopup: (show: boolean) => set({ showReviewPopup: show }),
}));
