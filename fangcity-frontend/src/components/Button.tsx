import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const Button = ({
  children = null,
  onClick = () => {},
  text = "",
  color,
  disabled = false,
  standalone = false,
  className = "",
}) => {
  const [colorClasses, setColorClasses] = useState("");

  useEffect(() => {
    switch (color) {
      case "green":
        if (disabled) {
          setColorClasses("border-green-dark bg-green-light text-green-darker saturate-[0.75]");
        } else {
          setColorClasses("border-green-dark bg-green-light text-black");
        }
        return;
      case "red":
        if (disabled) {
          setColorClasses("border-red-dark bg-red-light text-red-darker saturate-[0.75]");
        } else {
          setColorClasses("border-red-dark bg-red-light text-black");
        }
        return;
      case "cyan":
        if (disabled) {
          setColorClasses("border-cyan-dark bg-cyan-light text-cyan-darker saturate-[0.75]");
        } else {
          setColorClasses("border-cyan-dark bg-cyan-light text-black");
        }
        return;
      case "purple":
        if (disabled) {
          setColorClasses("border-purple-dark bg-purple-light text-purple-darker saturate-[0.75]");
        } else {
          setColorClasses("border-purple-dark bg-purple-light text-black");
        }
        return;
      case "magenta":
        if (disabled) {
          setColorClasses("border-magenta-dark bg-magenta-light text-magenta-darker saturate-[0.75]");
        } else {
          setColorClasses("border-magenta-dark bg-magenta-light text-black");
        }
        return;
      case "yellow":
        if (disabled) {
          setColorClasses("border-yellow-dark bg-yellow-light text-yellow-darker saturate-[0.75]");
        } else {
          setColorClasses("border-yellow-dark bg-yellow-light text-black");
        }
        return;
      case "darkpurple":
          if (disabled) {
            setColorClasses("border-none bg-yellow-light text-yellow-darker saturate-[0.75]");
          } else {
            setColorClasses("border-none bg-purple-darkest text-white");
          }
          return;
      default:
        if (disabled) {
          setColorClasses("border-purple-dark bg-purple-light text-purple-darker saturate-[0.75]");
        } else {
          setColorClasses("border-purple-dark bg-purple-light text-black");
        }
        return;
    }
  }, [color, disabled]);

  return (
    <motion.button
      type="button"
      className={`${
        standalone ? "" : "mb-2 mt-8 w-full"
      } select-none rounded-xl border-[0.5vh] px-4 py-[0.7rem] text-2xl font-medium ${colorClasses} ${className}`}
      onClick={() => {
        if (!disabled) {
          onClick();
        }
      }}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {children || text}
    </motion.button>
  );
};
