import React from "react";
import Icon from "./assets/menu.svg";
import { SvgProps } from "react-native-svg";

const MenuIcon = ({ color = "black", ...props }: SvgProps) => (
  <Icon color={color} {...props} />
);

export default MenuIcon;
