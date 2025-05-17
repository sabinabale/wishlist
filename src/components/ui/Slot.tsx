import React from "react";

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactElement;
}

export const Slot = ({ children, ...otherProps }: SlotProps) => {
  return React.cloneElement(children, otherProps);
};
