import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Disclosure } from "@headlessui/react";
import { VolumeUpIcon, VolumeOffIcon } from "@heroicons/react/outline";
import { useWindowSize } from "@reach/window-size";
import useSound from "use-sound";

import { useGlobalState } from "../App";
import { Authentication } from "./Authentication";
import header from "../assets/images/header.png";
import headerMobile from "../assets/images/header-mobile.png";

import nfcFx from "../assets/sounds/nfcfx.mp3";

import { COLORS } from "./Fangster";

export const Navigation = () => {
  const { width } = useWindowSize();
  const [currentFangster] = useGlobalState("currentFangster");
  const [, setGlobalAudio] = useGlobalState("globalAudio");
  const [isPlaying, setIsPlaying] = useState(false);
  const [playNFC, nfcActions] = useSound(nfcFx, {
    loop: true,
    volume: 0.5,
    onplay: () => setIsPlaying(true),
    onend: () => setIsPlaying(false),
    onpause: () => setIsPlaying(false),
    onstop: () => setIsPlaying(false),
  });

  useEffect(() => {
    setGlobalAudio(nfcActions);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Disclosure as="nav" className="fixed right-0 left-0 z-[998] pb-[13vh] pt-[2vh]">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-32 items-start justify-between">
          <div className="flex items-center">
            <div className="shrink-0 text-left">
              <Link to="/">
                {width > 550 ? (
                  <img
                    className="mt-[0.5vh] h-16 w-64 object-contain sm:w-72 md:w-full"
                    src={header}
                    alt="New Fang City"
                    style={{ height: "min(10vh, 100px)" }}
                  />
                ) : (
                  <img
                    className="mt-[0.5vh] h-16"
                    src={headerMobile}
                    alt="New Fang City"
                    style={{ height: "min(10vh, 100px)" }}
                  />
                )}
                {/* {location.pathname !== "/" && "Back"} */}
              </Link>
            </div>
          </div>
          <div className="ml-4 flex shrink-0 items-center">
            <motion.div
              className={`mr-4 mt-2 h-8 w-8 select-none text-${
                COLORS[
                  `${currentFangster?.get("background")}${
                    currentFangster?.get("background") === "Purple" ? "Lightest" : "Light"
                  }`
                ] || "slate-300"
              }`}
              style={{
                filter: "drop-shadow(-3px 2px 0px rgb(0 0 0 / 0.15)",
              }}
              whileHover={{
                scale: 1.05,
                filter: "drop-shadow(-3px 3px 0px rgb(0 0 0 / 0.15)",
              }}
              whileTap={{
                scale: 0.95,
                filter: "drop-shadow(-2px 1px 0px rgb(0 0 0 / 0.15)",
              }}
              exit={{ scale: 1 }}
            >
              {isPlaying && <VolumeUpIcon onClick={() => nfcActions.pause()} aria-hidden="true" />}
              {!isPlaying && <VolumeOffIcon onClick={() => playNFC()} aria-hidden="true" />}
            </motion.div>
            <Authentication />
          </div>
        </div>
      </div>
    </Disclosure>
  );
};
