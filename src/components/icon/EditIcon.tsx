import React from "react";
import Icon from "./assets/edit.svg";
import { SvgProps } from "react-native-svg";

const EditIcon = ({ color = "black", ...props }: SvgProps) => (
  <Icon color={color} {...props} />
);

export default EditIcon;
