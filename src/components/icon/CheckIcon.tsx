import React from "react";
import Icon from "./assets/check.svg";
import { SvgProps } from "react-native-svg";

const CheckIcon = ({ color = "black", ...props }: SvgProps) => (
  <Icon color={color} {...props} />
);

export default CheckIcon;
