import { useColorScheme } from "react-native";

const colors = {
  dark: {
    topIcons: "#fff",
    primary: "#161616",
    grayOpacity: "#fff",
    grayOpacity2: "rgba(255, 255, 255, 1)",
    lightGrayOpacity: "rgba(0, 0, 0, 0.05)",
    placeholder: "rgba(255, 255, 255, 0.5)",
    backOpacity: "rgba(255, 255, 255, 0.05)",
    backOpacity2: "rgba(255, 255, 255, 0.05)",
    trialButton: "rgba(186, 63, 151, 0.16)",
    darkInherit: "#000000",
    backOpacityRes: "rgba(255, 255, 255, 0.1)",
    lightInherit: "#FFFFFF",
    border: "rgba(255, 255, 255, 0.16)",
    resultBg: "rgba(255, 255, 255, 0.05)",
    resultBorder: "rgba(255, 255, 255, 0.16)",
    modalBg: "rgba(34, 34, 34, 1)",
    trialColor: "rgba(186, 63, 151, 1)",
    rightIcon: "rgba(255, 255, 255, 0.5)",
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
    background: "rgba(22, 22, 22, 1)",
    iconColor: "rgba(255, 255, 255, 1)",
    white: "#fff",
    trialDesc: "rgba(255, 255, 255, 0.5)",
  },
  light: {
    topIcons: "rgba(71, 40, 104, 1)",
    primary: "#FFFFFF",
    grayOpacity: "rgba(0, 0, 0, 0.5)",
    grayOpacity2: "rgba(255, 255, 255, 1)",
    lightGrayOpacity: "rgba(0, 0, 0, 0.05)",
    placeholder: "rgba(0, 0, 0, 0.5)",
    trialButton: "rgba(186, 63, 151, 1)",
    backOpacityRes: "rgba(255, 255, 255, 0.05)",
    backOpacity: "rgba(236, 230, 243, 1)",
    backOpacity2: "rgba(255, 255, 255, 1)",
    darkInherit: "#FFFFFF",
    lightInherit: "#000000",
    border: "rgba(0, 0, 0, 0.1)",
    resultBg: "rgba(0, 0, 0, 0.05)",
    resultBorder: "rgba(0, 0, 0, 0.1)",
    modalBg: "#ffffff",
    trialColor: "rgba(186, 63, 151, 1)",
    rightIcon: "rgba(0, 0, 0, 0.5)",
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
    background: "rgba(250, 246, 255, 1)",
    iconColor: "rgba(72, 41, 104, 1)",
    white: "#fff",
    trialDesc: "rgba(255, 255, 255, 0.5)",
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
