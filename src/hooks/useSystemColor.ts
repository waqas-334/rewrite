import { useColorScheme } from "react-native";

const colors = {
  dark: {
    primary: "#161616",
    grayOpacity: "rgba(0, 0, 0, 0.5)",
    lightGrayOpacity: "rgba(0, 0, 0, 0.05)",
    placeholder: "rgba(255, 255, 255, 0.5)",
    backOpacity: "rgba(255, 255, 255, 0.05)",
    trialButton: "rgba(255, 255, 255, 0.05)",
    darkInherit: "#000000",
    backOpacityRes: "rgba(255, 255, 255, 0.1)",
    lightInherit: "#FFFFFF",
    border: "rgba(255, 255, 255, 0.16)",
    resultBg: "rgba(255, 255, 255, 0.05)",
    resultBorder: "rgba(255, 255, 255, 0.16)",
    modalBg: "rgba(34, 34, 34, 1)",
    trialColor: "#FEEACF",
    rightIcon: "rgba(255, 255, 255, 0.5)",
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  light: {
    primary: "#FFFFFF",
    grayOpacity: "rgba(0, 0, 0, 0.5)",
    lightGrayOpacity: "rgba(0, 0, 0, 0.05)",
    placeholder: "rgba(0, 0, 0, 0.5)",
    trialButton: "rgba(254, 234, 207, 0.64)",
    backOpacityRes: "rgba(255, 255, 255, 0.05)",
    backOpacity: "rgba(0, 0, 0, 0.05)",
    darkInherit: "#FFFFFF",
    lightInherit: "#000000",
    border: "rgba(0, 0, 0, 0.1)",
    resultBg: "rgba(0, 0, 0, 0.05)",
    resultBorder: "rgba(0, 0, 0, 0.1)",
    modalBg: "#ffffff",
    trialColor: "#FEEACF",
    rightIcon: "rgba(0, 0, 0, 0.5)",
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
};

export const useSystemColor = () => {
  const colorScheme = useColorScheme();

  const getColor = (colorName: keyof typeof colors.light) => {
    if (!colorScheme) {
      return colors.light[colorName];
    }

    return colors[colorScheme][colorName];
  };

  return { getColor };
};
