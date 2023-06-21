import React from "react";
import { motion } from "framer-motion";

// prettier-ignore
const COLORS = {
  Red: "red-dark",
  RedLight: "red-light",
  Purple: "purple-dark",
  PurpleLight: "purple-light",
  PurpleLightest: "purple-lightest",
  Cyan: "cyan-dark",
  CyanLight: "cyan-light",
  Yellow: "yellow-dark",
  YellowLight: "yellow-light",
  Magenta: "magenta-dark",
  MagentaLight: "magenta-light",
};

interface Props {
  fangster: any;
  animated?: boolean;
  direction?: number;
}

const Fangster = (props: Props) => {
  const { animated, direction, fangster } = props;
  const color = COLORS[fangster?.get("background")] || "black";

  return (
    <>
      {fangster && animated ? (
        <motion.img
          key={fangster?.get("tokenId")}
          className={`w-0 select-none bg-${color} border-${color}`}
          style={{
            borderRadius: "min(7vh, 35%)",
            borderWidth: "0.5vh",
            width: "10vh",
          }}
          src={fangster?.get("image")}
          alt={fangster?.get("name")}
          initial={{
            y: 0,
            boxShadow: "-6px 4px 1px rgba(0, 0, 0, 0.15)",
          }}
          animate={{
            y: [0, -40, 0],
            scale: [1, 1.25, 1],
            boxShadow: [
              "-6px 4px 1px rgba(0, 0, 0, 0.15)",
              "-10px 8px 1px rgba(0, 0, 0, 0.1)",
              "-6px 4px 1px rgba(0, 0, 0, 0.15)",
            ],
            transition: {
              type: "spring",
              bounce: 1,
              damping: 2,
              repeat: Infinity,
              duration: 0.65,
              repeatDelay: Math.random() * 10 + 1,
            },
          }}
        />
      ) : (
        <div
          className={`bg-${color} border-${color} overflow-hidden`}
          style={{
            borderRadius: "min(7vh, 35%)",
            borderWidth: "0.5vh",
            boxShadow: "-6px 4px 1px rgba(0, 0, 0, 0.15)",
            width: "10vh",
            height: "10vh",
          }}
        >
          <img
            key={fangster?.get("tokenId")}
            className={`select-none bg-${color} border-${color} h-full w-full`}
            style={{ transform: `scaleX(${direction})` }}
            src={fangster?.get("image")}
            alt={fangster?.get("name")}
          />
        </div>
      )}
    </>
  );
};

export { COLORS, Fangster };
