import React from "react";
import Icon from "./assets/close.svg";
import { SvgProps } from "react-native-svg";

const CloseIcon = ({ color = "black", ...props }: SvgProps) => (
  <Icon color={color} {...props} />
);

export default CloseIcon;
