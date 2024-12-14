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
}));
