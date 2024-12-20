import React from "react";
import Icon from "./assets/paste.svg";
import { SvgProps } from "react-native-svg";

const PasteIcon = ({ color = "black", ...props }: SvgProps) => (
  <Icon color={color} {...props} />
);

export default PasteIcon;
