import React, { useEffect } from "react";
import { motion } from "framer-motion";

import { useGlobalState } from "../../App";
import { Presence } from "../Presence";

import clothes from "../../assets/images/wldfngz/rack-tshirt.png";
import dcl from "../../assets/images/wldfngz/dcl.png";
import rack from "../../assets/images/wldfngz/rack.png";
import rackWall from "../../assets/images/wldfngz/rack-wall.png";
import shelves from "../../assets/images/wldfngz/shelves.png";
import store from "../../assets/images/wldfngz/store.png";

export const Wldfngz = () => {
  const [, setLocation] = useGlobalState("location");
  const [, setBackgroundClass] = useGlobalState("backgroundClass");
  const [, setModal] = useGlobalState("modal");

  useEffect(() => {
    setBackgroundClass("bg-wldfngz-background");
    setLocation("wldfngz");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className=" flex w-screen overflow-y-hidden">
      <div className="relative flex h-full min-w-screen shrink-0 flex-row items-center justify-center bg-wldfngz-background bg-tiling bg-repeat-x">
        <div className="relative z-[901] h-full shrink-0 items-center justify-center">
          <a
            href="https://market.decentraland.org/collections/0x8b76c0154f039b722e660bc0234b5724dc0c76c8"
            target="_blank"
            rel="noreferrer"
          >
            <motion.img
              className="absolute right-[16vh] h-screen cursor-pointer"
              src={dcl}
              alt=""
              whileTap={{
                scale: 0.95,
              }}
              exit={{ scale: 1 }}
            />
          </a>
          <img className="pointer-events-none h-screen select-none" src={shelves} alt="" />
        </div>
        <div className="relative z-40 -ml-[10vh] h-full shrink-0 items-center justify-center">
          <motion.img
            whileTap={{
              scale: 0.95,
            }}
            exit={{ scale: 1 }}
            onClick={() => setModal("wardrobe")}
            className="absolute h-screen cursor-pointer select-none"
            src={rack}
            alt=""
          />
          <img className="h-screen select-none" src={rackWall} alt="" />
        </div>
        <div className="relative z-10 -ml-[2vh] h-full shrink-0 items-center justify-center pr-4">
          <a href="https://wldfngz.io" target="_blank" rel="noreferrer">
            <motion.img
              className="h-[50vh] cursor-pointer"
              src={store}
              alt=""
              whileTap={{
                scale: 0.95,
              }}
              exit={{ scale: 1 }}
            />
          </a>

          <a href="https://wldfngz.io" target="_blank" rel="noreferrer">
          <motion.img
            className="h-[50vh] cursor-pointer select-none"
            src={clothes}
            alt=""
            whileTap={{
              scale: 0.95,
            }}
            exit={{ scale: 1 }}
           />
          </a>
        </div>
        <Presence />
      </div>
    </div>
  );
};
