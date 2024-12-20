import React from "react";
import Icon from "./assets/trash.svg";
import { SvgProps } from "react-native-svg";

const TrashIcon = ({ color = "black", ...props }: SvgProps) => (
  <Icon color={color} {...props} />
);

export default TrashIcon;
