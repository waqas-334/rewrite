import React from "react";
import Icon from "./assets/right.svg";
import { SvgProps } from "react-native-svg";

const RightIcon = ({ color = "black", ...props }: SvgProps) => (
  <Icon color={color} {...props} />
);

export default RightIcon;
