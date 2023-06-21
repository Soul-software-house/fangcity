import React, { useEffect } from "react";
import { motion } from "framer-motion";

import { useGlobalState } from "../App";
import { Presence } from "./Presence";

import chair from "../assets/images/bank/chair.png";
import desk from "../assets/images/bank/desk.png";
import plaque from "../assets/images/bank/plaque.png";
import vault from "../assets/images/bank/vault.png";
import vaultLight from "../assets/images/bank/vault-light.png";

export const Bank = () => {
  const [, setBackgroundClass] = useGlobalState("backgroundClass");
  const [, setModal] = useGlobalState("modal");

  useEffect(() => {
    setBackgroundClass("bg-bank-background");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="flex w-screen overflow-y-hidden">
        <div className="relative flex h-full min-w-screen shrink-0 flex-row items-center justify-center bg-bank-background bg-tiling bg-repeat-x px-8">
          <div className="relative z-40 ml-[2.5vh] h-full shrink-0 items-center justify-center">
            <img className="pointer-events-none absolute z-50 h-screen select-none" src={chair} alt="" />
            <motion.img
              className="z-40 h-screen cursor-pointer select-none"
              src={desk}
              alt=""
              onClick={() => setModal("claim")}
              whileTap={{
                scale: 0.95,
              }}
              exit={{ scale: 1 }}
            />
          </div>
          <div className="relative h-full shrink-0 items-center justify-center">
            <img className="h-screen select-none" src={plaque} alt="" />
          </div>
          <div className="relative z-40 mr-[5vh] h-full shrink-0 items-center justify-center">
            <motion.img
              className="absolute h-screen cursor-pointer select-none"
              src={vault}
              alt=""
              onClick={() => setModal("vault")}
              whileTap={{
                scale: 0.95,
              }}
              exit={{ scale: 1 }}
            />
            <img className="h-screen select-none" src={vaultLight} alt="" />
          </div>
          <Presence />
        </div>
      </div>
    </>
  );
};
