import React from "react";
import numeral from "numeral";

numeral.nullFormat("---");

export const FormattedNumber = ({ children = null, value = 0, className = "", color = "cyan-light", size = "xs" }) => {
  return (
    <span className={`font-mono text-${size} text-${color} ${className}`}>
      {children || numeral(value).format("0,0.[00]")}
    </span>
  );
};
