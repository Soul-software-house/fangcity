import React, { Fragment, useEffect, useState } from "react";
import { motion } from "framer-motion";
import useSound from "use-sound";
import { Dialog, Transition } from "@headlessui/react";
import { useWindowSize } from "@reach/window-size";

import { useGlobalState } from "../../App";
import { Presence } from "../Presence";

import clawMachine from "../../assets/images/arcade/claw-machine.png";
import gameCabinet from "../../assets/images/arcade/game-cabinet.png";
import kiosk from "../../assets/images/arcade/kiosk.png";
import grillzCabinet from "../../assets/images/arcade/grillz-cabinet.png";
import pinballMachines from "../../assets/images/arcade/pinball-machines.png";
import poster from "../../assets/images/arcade/poster.png";
import runnerCabinet from "../../assets/images/arcade/runner-cabinet.png";
import shelves from "../../assets/images/arcade/shelves.png";
import sign from "../../assets/images/arcade/sign.png";
import tri from "../../assets/images/arcade/tri.png";

import pinballFx from "../../assets/sounds/pinballfx.mp3";
import clawFx from "../../assets/sounds/clawfx.mp3";
import arcadeFx from "../../assets/sounds/arcadefx.mp3";
import runnerStartFx from "../../assets/sounds/runnerstartfx.mp3";
import kioskFx from "../../assets/sounds/kioskfx.mp3";

const getRandom = values => values[Math.floor(Math.random() * values.length)];

export const Arcade = () => {
  const { width, height } = useWindowSize();
  const [, setBackgroundClass] = useGlobalState("backgroundClass");
  const [, setLocation] = useGlobalState("location");
  const [globalAudio] = useGlobalState("globalAudio");
  const [modal, setModal] = useGlobalState("modal");

  useEffect(() => {
    console.log(modal)

  }, [modal])
  

  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
    setModal(null);
  }

  function openModal() {
    setIsOpen(true);
    setModal("arcade");
  }

  const [playArcade, arcadeActions] = useSound(arcadeFx, { loop: true, volume: 0.25 });

  useEffect(() => {
    setBackgroundClass("bg-arcade-background");
    setLocation("arcade");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // pinball sounds
  const [playPinball, pinballActions] = useSound(pinballFx, {
    sprite: {
      1: [0, 2000],
      2: [4200, 1800],
      3: [8000, 2500],
      4: [12000, 3000],
    },
    volume: 0.25,
  });

  const pinball = () => {
    pinballActions.stop();
    playPinball({ id: getRandom(["1", "2", "3", "4"]) });
  };

  // claw sounds
  const [playClaw, clawActions] = useSound(clawFx, {
    sprite: {
      1: [0, 750],
      2: [1000, 1160],
      3: [2500, 900],
    },
    volume: 0.25,
  });

  const claw = () => {
    clawActions.stop();
    playClaw({ id: getRandom(["1", "2", "3"]) });
  };

  // runner sounds
  const [playRunnerStart, runnerStartActions] = useSound(runnerStartFx, { volume: 0.5 });

  const runnerStart = () => {
    runnerStartActions.stop();
    playRunnerStart();
  };

  // kiosk sounds
  const [playKiosk, kioskActions] = useSound(kioskFx, { volume: 0.5 });
  const kioskSound = () => {
    kioskActions.stop();
    playKiosk();
  };

  return (
    <div className=" flex w-screen overflow-y-hidden">
      <div className="relative flex h-full min-w-screen shrink-0 flex-row items-center justify-center bg-arcade-background bg-tiling bg-repeat-x">
        <div className="z-30 h-full ml-p10 shrink-0 items-center justify-center">
          <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-[900] overflow-y-auto" onClose={closeModal}>
              <div className="h-full w-full p-4">
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
                <div onClick={closeModal} className="relative z-[888] flex h-full w-full items-center justify-center">
                  <iframe
                    title="game"
                    src="/fangrunnergame/"
                    className="z-[999] rounded-2xl shadow-nfc"
                    allow="fullscreen"
                    style={{
                      width: `min(100%, calc(calc(100vh - 2rem - ${width > height ? 0 : 1}px) * 1.77777778))`,
                      height: `min(100%, calc(calc(100vw - 2rem - ${width > height ? 1 : 0}px) * 0.5625))`,
                    }}
                  />
                </div>
              </div>
            </Dialog>
          </Transition>

          <motion.img
            className="h-screen cursor-pointer select-none"
            src={runnerCabinet}
            alt=""
            whileTap={{
              scale: 0.95,
            }}
            exit={{ scale: 1 }}
            onClick={() => {
              setModal("arcade");
              arcadeActions.stop();
              if (globalAudio) {
                globalAudio?.stop();
              }
              runnerStart();
              openModal();
            }}
            onMouseEnter={() => playArcade()}
            onMouseLeave={() => arcadeActions.stop()}
          />
        </div>
        <div
          className="z-20 h-full shrink-0 items-center justify-center"
          style={{ marginLeft: "calc(-1 * max(10vh, 10px)" }}
        >
          <motion.img
            className="h-screen select-none"
            src={grillzCabinet}
            alt=""
            whileTap={{
              scale: 0.95,
            }}
            exit={{ scale: 1 }}
          />
        </div>
        <div
          className="z-10 mr-32 h-full shrink-0 items-center justify-center"
          style={{ marginLeft: "calc(-1 * max(10vh, 10px)" }}
        >
          <motion.img
            className="h-screen select-none"
            src={gameCabinet}
            alt=""
            whileTap={{
              scale: 0.95,
            }}
            exit={{ scale: 1 }}
          />
        </div>
        <div className="relative z-40 ml-p0 h-full shrink-0 items-center justify-center">
          <motion.img
            className="absolute h-screen cursor-pointer select-none"
            src={clawMachine}
            alt=""
            onClick={() => setModal("claw")}
            onTapStart={claw}
            whileTap={{
              scale: 0.95,
            }}
            exit={{ scale: 1 }}
          />
          <img className="h-screen select-none" src={tri} alt="" />
        </div>
        <div className="relative z-10 h-full shrink-0 items-center justify-center">
          <a
            href="https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/63060116092774104490944459263395415467606267699879781141489408855984876552193"
            target="_blank"
            rel="noreferrer"
            className="z-800 absolute"
          >
            <motion.img
              className="h-screen cursor-pointer select-none"
              src={poster}
              alt=""
              whileTap={{
                scale: 0.95,
              }}
              exit={{ scale: 1 }}
            />
          </a>
          <img className="h-screen select-none" src={sign} alt="" />
        </div>
        <div className="relative z-40 h-full shrink-0 items-center justify-center">
          <motion.img
            className="h-screen cursor-pointer select-none"
            src={kiosk}
            onTapStart={kioskSound}
            alt=""
            onClick={() => setModal("superpxl")}
            whileTap={{
              scale: 0.95,
            }}
            exit={{ scale: 1 }}
          />
        </div>
        <div className="relative z-50 ml-p5 h-full shrink-0 items-center justify-center">
          <motion.img
            className="z-800 absolute h-screen cursor-pointer select-none"
            src={pinballMachines}
            alt=""
            onTapStart={pinball}
            onClick={() => setModal("traitstore")}
            whileTap={{
              scale: 0.95,
            }}
            exit={{ scale: 1 }}
          />
          <img className="h-screen" src={shelves} alt="" />
        </div>
        <Presence />
      </div>
    </div>
  );
};
