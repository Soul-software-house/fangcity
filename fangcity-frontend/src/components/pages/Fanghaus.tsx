import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

import { useGlobalState } from "../../App";
import { Presence } from "../Presence";

import informationBoard from "../../assets/images/fanghaus/information-board-revealed.png";
import plant from "../../assets/images/fanghaus/plant.png";
import bench from "../../assets/images/fanghaus/bench.png";
import bench2 from "../../assets/images/fanghaus/bench2.png";
import window from "../../assets/images/fanghaus/window.png";
import revealed1 from "../../assets/images/fanghaus/revealed1.png";
import revealed2 from "../../assets/images/fanghaus/revealed2.png";
import revealed3 from "../../assets/images/fanghaus/revealed3.png";
import revealed4 from "../../assets/images/fanghaus/revealed4.png";
import revealed5 from "../../assets/images/fanghaus/revealed5.png";
import revealed6 from "../../assets/images/fanghaus/revealed6.png";
import revealed7 from "../../assets/images/fanghaus/revealed7.png";
import revealed8 from "../../assets/images/fanghaus/revealed8.png";
import revealed9 from "../../assets/images/fanghaus/revealed9.png";

export const Fanghaus = () => {
  const [, setBackgroundClass] = useGlobalState("backgroundClass");
  const [, setLocation] = useGlobalState("location");

  // scrolling
  const scrollTo = useRef(null);

  const scrollToBottom = () => {
    scrollTo.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setBackgroundClass("bg-fanghaus-background");
    setLocation("fanghaus");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 500);
  }, [scrollTo, setBackgroundClass]);

  return (
    <div className=" flex w-screen overflow-y-hidden">
      <div className="relative flex h-full min-w-screen shrink-0 flex-row items-center justify-center bg-fanghaus-background bg-tiling bg-repeat-x">
        <div className="relative z-50 ml-[7vh] flex h-full flex-row items-center">
          <img className="h-screen select-none" src={window} alt="" />
          <div className="absolute -ml-[7vh] flex aspect-[3/2] h-full flex-row">
            <img className="select-none" src={bench} alt="" />
            <img className="z-40 select-none" src={bench2} alt="" />
          </div>
          <img className="absolute ml-[7vh] h-screen select-none" src={plant} alt="" />
        </div>
        <img className="ml-[7vh] h-screen select-none" src={informationBoard} alt="" />
        <div className="relative z-50 flex h-full shrink-0 flex-row items-center justify-center">
          <motion.a
            whileTap={{
              scale: 0.95,
            }}
            exit={{ scale: 1 }}
            className="ml-[7vh]"
            href="https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/42703785527497049638486320068454497351751272036178952866403298552365229015069"
            target="_blank"
          >
            <img className="h-screen select-none" src={revealed1} alt="" />
          </motion.a>

          <motion.a
            whileTap={{
              scale: 0.95,
            }}
            exit={{ scale: 1 }}
            className="ml-[7vh]"
            href="https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/42703785527497049638486320068454497351751272036178952866403298553464740642839"
            target="_blank"
          >
            <img className="h-screen select-none" src={revealed2} alt="" />
          </motion.a>

          <motion.a
            whileTap={{
              scale: 0.95,
            }}
            exit={{ scale: 1 }}
            className="ml-[7vh]"
            href="https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/42703785527497049638486320068454497351751272036178952866403298554564252270650"
            target="_blank"
          >
            <img className="h-screen select-none" src={revealed3} alt="" />
          </motion.a>

          <div className="relative ml-[7vh] flex flex-col">
            <motion.a
              whileTap={{
                scale: 0.95,
              }}
              exit={{ scale: 1 }}
              href="https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/42703785527497049638486320068454497351751272036178952866403298555663763898390"
              target="_blank"
            >
              <img className="h-[50vh] select-none" src={revealed4} alt="" />
            </motion.a>

            <motion.a
              whileTap={{
                scale: 0.95,
              }}
              exit={{ scale: 1 }}
              href="https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/42703785527497049638486320068454497351751272036178952866403298556763275526169"
              target="_blank"
            >
              <img className="h-[50vh] select-none" src={revealed5} alt="" />
            </motion.a>
          </div>

          <motion.a
            whileTap={{
              scale: 0.95,
            }}
            exit={{ scale: 1 }}
            className="ml-[7vh]"
            href="https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/42703785527497049638486320068454497351751272036178952866403298557862787153963"
            target="_blank"
          >
            <img className="h-screen select-none" src={revealed6} alt="" />
          </motion.a>

          <div className="relative mx-[7vh] flex flex-col justify-center">
            <motion.a
              whileTap={{
                scale: 0.95,
              }}
              exit={{ scale: 1 }}
              className="mt-[3vh] w-full"
              href="https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/42703785527497049638486320068454497351751272036178952866403298558962298781714"
              target="_blank"
            >
              <img className="h-[12vh] w-full select-none" src={revealed7} alt="" />
            </motion.a>

            <motion.a
              whileTap={{
                scale: 0.95,
              }}
              exit={{ scale: 1 }}
              className="mt-[3vh] w-full"
              href="https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/42703785527497049638486320068454497351751272036178952866403298560061810409494"
              target="_blank"
            >
              <img className="h-[12vh] w-full select-none" src={revealed8} alt="" />
            </motion.a>

            <motion.a
              whileTap={{
                scale: 0.95,
              }}
              exit={{ scale: 1 }}
              className="mt-[3vh] w-full"
              href="https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/42703785527497049638486320068454497351751272036178952866403298561161322037272"
              target="_blank"
            >
              <img className="h-[12vh] w-full select-none" src={revealed9} alt="" />
            </motion.a>
          </div>
        </div>
        <Presence />
      </div>
    </div>
  );
};
