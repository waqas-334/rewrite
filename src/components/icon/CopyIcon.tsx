import React from "react";
import Icon from "./assets/copy.svg";
import { SvgProps } from "react-native-svg";

interface CopyIconProps extends SvgProps {
  color?: string;
}

const CopyIcon = ({
  color = "rgba(0, 0, 0, 0.5)",
  ...props
}: CopyIconProps) => <Icon color={color} {...props} />;

export default CopyIcon;
