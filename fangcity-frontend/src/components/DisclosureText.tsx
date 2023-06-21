import React from "react";

export const DisclosureText = ({ children = null, text = "", className = "", color = "slate-300" }) => {
  return <div className={`text-${color} ${className}`}>{children || text}</div>;
};
