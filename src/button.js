import React from "react";
import { TouchableOpacity } from "react-native";
import { commonStyles } from "./common-styles";

export const Button = (props) => (
  <TouchableOpacity
    accessibilityRole="button"
    {...props}
    style={[{ opacity: props.disabled ? 0.5 : 1 }, props.style]}
  />
);

export const ShadowButton = (props) => (
  <Button {...props} style={[commonStyles.shadow, props.style]} />
);
