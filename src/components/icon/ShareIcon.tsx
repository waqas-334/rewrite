import React from "react";
import Icon from "./assets/share.svg";
import { SvgProps } from "react-native-svg";

const ShareIcon = ({ color = "black", ...props }: SvgProps) => (
  <Icon color={color} {...props} />
);

export default ShareIcon;
