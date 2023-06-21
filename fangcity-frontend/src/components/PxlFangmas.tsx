import React, { Fragment, useEffect, useRef, useState } from "react";
import { useMoralis, useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import Moralis from "moralis-v1";
import Snowfall from "react-snowfall";
import { motion } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";

import openImg from "../assets/images/pxl-fangmas-open.png";
import openedImg from "../assets/images/pxl-fangmas-opened.gif";
import secretImg from "../assets/images/pxl-fangmas-secret.gif";
import unopenedImg from "../assets/images/pxl-fangmas-unopened.gif";
import unopenedActiveImg from "../assets/images/pxl-fangmas-unopened-active.gif";

const COLORS = {
  "black": "#262022",
  "primary": "#6950d0",
  "red-dark": "#b06f7c",
  "red-light": "#ee94a3",
  "purple-dark": "#816db0",
  "purple-light": "#a994ee",
  "cyan-dark": "#75b1aa",
  "cyan-light": "#94eee5",
  "gray-dark": "#605e63",
  "gray-light": "#aaa7b0",
  "yellow-dark": "#b2b072",
  "yellow-light": "#eeeb9f",
  "magenta-dark": "#a66cb0",
  "magenta-light": "#e094ee",
};

const defaultDay = {
  claimed: false,
  imageUrl: unopenedImg,
  openSeaUrl: null,
  opened: false,
  today: false,
};

export const PxlFangmas = () => {
  const { authenticate, user, isAuthenticated, isInitialized, logout, refetchUserData } = useMoralis();
  const Web3Api = useMoralisWeb3Api();
  const { fetch, data } = useMoralisWeb3ApiCall(Web3Api.account.getNFTsForContract, {
    chain: "eth",
    address: user?.get("ethAddress") || "0x0000000000000000000000000000000000000000",
    token_address: "0x30917a657ae7d1132bdca40187d781fa3b60002f",
  });
  const [day, setDay] = useState(defaultDay);
  const [image, setImage] = useState(unopenedImg);
  const [currentPxlFangsterId, setCurrentPxlFangsterId] = useState(user?.get("currentPxlFangster") ?? null);
  const [currentPxlFangster, setCurrentPxlFangster] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [claimOpen, setClaimOpen] = useState(false);
  const [claimDay, setClaimDay] = useState(null);
  const [claimMessage, setClaimMessage] = useState("");
  const cancelButtonRef = useRef(null);

  const fetchDays = async () => {
    let day = defaultDay;

    try {
      day = await Moralis.Cloud.run("fetchPxlFangmas");
    } catch (e) {
      // noopt
    } finally {
      setDay(day);
    }
  };

  useEffect(() => {
    const updatePxlFangsters = async () => {
      const tokens = data?.result
        ? data.result
            .filter(t => t?.token_address === "0x30917a657ae7d1132bdca40187d781fa3b60002f")
            .map(t => {
              const metadata = JSON.parse(t?.metadata);
              console.log("METADATA", metadata);
              const attributes = metadata?.attributes?.reduce((acc, m) => {
                acc[m?.trait_type?.toLowerCase()] = m?.value;
                return acc;
              }, {});

              return { ...metadata, ...attributes };
            })
        : [];

      const current = tokens[Math.floor(Math.random() * tokens.length)];
      setCurrentPxlFangster(current);
    };

    updatePxlFangsters();
  }, [currentPxlFangsterId, isAuthenticated, user, data]);

  useEffect(() => {
    if (isInitialized) {
      fetchDays();
    }
  }, [isInitialized]);

  useEffect(() => {
    const updateUserData = async () => {
      if (isAuthenticated) {
        await refetchUserData();
      }
    };

    updateUserData();
    fetch();
  }, [isAuthenticated, refetchUserData, fetch]);

  const authenticateUser = async () => {
    await authenticate({ signingMessage: "Fang Gang Authentication" });
    await setCurrentPxlFangsterId(user?.get("currentFangster") ?? null);
  };

  useEffect(() => {
    if (day.opened) {
      setImage(openImg);
    } else if (isAuthenticated && day.claimed) {
      setImage(openedImg);
    } else {
      setImage(unopenedImg);
    }
  }, [day, isAuthenticated, currentPxlFangster]);

  const handleClick = async day => {
    if (!day.opened && currentPxlFangster && !day.claimed) {
      toggleClaimModal(day);
    }
  };

  const logoutUser = async () => {
    setAuthOpen(false);
    await logout();
  };

  const toggleAuthModal = async () => {
    setAuthOpen(!authOpen);
  };

  const toggleClaimModal = async (day = null) => {
    setClaimOpen(!claimOpen);
    setClaimDay(day);
  };

  const claimPxlFangmas = async () => {
    try {
      const result = await Moralis.Cloud.run("updatePxlFangmas", { number: claimDay.number });

      if (result) {
        await fetchDays();
        toggleClaimModal();
      } else {
        setClaimMessage("There was a problem claiming this present!");
      }
    } catch (e) {
      setClaimMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <>
      <div className="relative">
        <div className="pointer-events-none absolute z-[999] w-screen" style={{ height: "max(100vh, 100%)" }}>
          <Snowfall wind={[-1, 3]} />
        </div>
        <div className="p-2 sm:p-4 md:p-8">
          <div className="relative mx-auto max-w-7xl">
            <div className="absolute z-[900] mb-2 flex flex h-16 w-full items-center justify-end text-sm focus:outline-none focus:ring-0 focus:ring-offset-0 sm:mb-4 md:h-24 lg:mb-6">
              <motion.img
                className="h-16 w-16 cursor-pointer select-none border-4 sm:h-20 sm:w-20 md:h-24 md:w-24 md:border-6"
                style={{
                  backgroundColor:
                    COLORS[
                      currentPxlFangster?.background ? `${currentPxlFangster?.background?.toLowerCase()}-dark` : "black"
                    ],
                  borderColor:
                    COLORS[
                      currentPxlFangster?.background ? `${currentPxlFangster?.background?.toLowerCase()}-dark` : "black"
                    ],
                  boxShadow: "-6px 4px 1px rgba(0, 0, 0, 0.15)",
                }}
                src={isAuthenticated && currentPxlFangster?.image?.length ? currentPxlFangster?.image : secretImg}
                alt="Fangster"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "-8px 6px 1px rgba(0, 0, 0, 0.15)",
                }}
                whileTap={{
                  scale: 0.95,
                  boxShadow: "-3px 2px 1px rgba(0, 0, 0, 0.15)",
                }}
                onClick={() => (isAuthenticated ? toggleAuthModal() : authenticateUser())}
              />
            </div>
            <div className="flex w-full items-center justify-center">
              <div className="group relative" onClick={() => handleClick(day)}>
                {day.opened && (
                  <div className="absolute left-0 right-0 z-10" style={{ top: "15%" }}>
                    <video className="block w-full border-4 border-black bg-black shadow-nfc md:border-8" loop controls>
                      <source src="/PxlFangmas.mp4" type="video/mp4" />
                    </video>
                    {day.openSeaUrl && (
                      <p className="mt-12 text-center font-mono text-lg md:text-2xl">
                        <a className="text-white" href={day.openSeaUrl}>
                          Check out PxlFangmas on OpenSea
                        </a>
                      </p>
                    )}
                  </div>
                )}
                {!currentPxlFangster && !day.opened && (
                  <div className="pointer-events-none absolute z-10 flex h-full w-full items-center">
                    <p className="sm:text-md m-3 hidden w-full bg-black bg-opacity-50 px-3 pt-5 pb-3 text-center font-mono text-sm text-white text-shadow-nfc group-hover:block md:text-lg lg:text-xl">
                      {isAuthenticated ? "You must hold a Fangster to open!" : "You must sign in to MetaMask to open!"}
                    </p>
                  </div>
                )}
                <img
                  className="z-0 cursor-pointer select-none"
                  style={{ height: "calc(100vh - 4rem)" }}
                  src={image}
                  onMouseOver={() =>
                    !day.opened && !(isAuthenticated && day.claimed) ? setImage(unopenedActiveImg) : false
                  }
                  onMouseOut={() => (!day.opened && !(isAuthenticated && day.claimed) ? setImage(unopenedImg) : false)}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Transition.Root show={authOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-[900] overflow-y-auto"
          onClose={toggleAuthModal}
          initialFocus={cancelButtonRef}
        >
          <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <Dialog.Overlay className="fixed inset-0 bg-gray-900 bg-opacity-0 transition-opacity" />

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block select-none overflow-hidden border-4 border-black bg-primary bg-black bg-opacity-90 p-4 text-left align-bottom shadow-xl shadow-nfc transition-all sm:w-full sm:max-w-2xl sm:p-6 sm:align-middle md:border-8">
                <div className="text-center">
                  <Dialog.Title
                    as="h3"
                    className="font-mono text-lg text-white text-shadow-nfc sm:text-xl md:text-2xl lg:text-3xl"
                  >
                    Account
                  </Dialog.Title>
                  <div className="my-4 md:my-6 lg:my-8">
                    <input
                      disabled
                      type="text"
                      className={`text-md w-full select-none border-4 border-purple-dark bg-purple-light px-4 pt-3 pb-2 font-mono text-black shadow-nfc sm:pt-4 sm:text-lg md:border-6 md:text-xl lg:text-2xl`}
                      style={{
                        boxShadow: "-6px 4px 1px rgba(0, 0, 0, 0.15)",
                      }}
                      value={user?.get("ethAddress")}
                    />
                  </div>
                  <div className="mt-2 md:mt-4 lg:mt-6">
                    <motion.button
                      type="button"
                      className={`text-md select-none border-4 border-red-dark bg-red-light px-4 pt-3 pb-2 font-mono text-black shadow-nfc focus:outline-none focus:ring-0 sm:pt-4 sm:text-lg md:border-6 md:text-xl lg:text-2xl`}
                      style={{
                        boxShadow: "-6px 4px 1px rgba(0, 0, 0, 0.15)",
                      }}
                      onClick={() => logoutUser()}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "-7px 5px 1px rgba(0, 0, 0, 0.15)",
                      }}
                      whileTap={{
                        scale: 0.95,
                        boxShadow: "-3px 2px 1px rgba(0, 0, 0, 0.15)",
                      }}
                    >
                      Logout
                    </motion.button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <Transition.Root show={claimOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-[900] overflow-y-auto"
          onClose={toggleClaimModal}
          initialFocus={cancelButtonRef}
        >
          <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <Dialog.Overlay className="fixed inset-0 bg-gray-900 bg-opacity-0 transition-opacity" />

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block select-none overflow-hidden border-4 border-black bg-primary bg-black bg-opacity-90 p-4 text-left align-bottom shadow-xl shadow-nfc transition-all sm:w-full sm:max-w-2xl sm:p-6 sm:align-middle md:border-8">
                <div className="text-center">
                  <Dialog.Title
                    as="h3"
                    className="font-mono text-lg text-white text-shadow-nfc sm:text-xl md:text-2xl lg:text-3xl"
                  >
                    Open This Present?
                  </Dialog.Title>
                  <div className="my-4 md:my-6 lg:my-8">
                    <p className="font-mono leading-6 text-white">
                      <span className="sm:text-md text-sm text-shadow-nfc md:text-lg lg:text-xl">
                        Gift will be revealed soon.
                      </span>
                    </p>
                  </div>
                  <div className="mt-2 md:mt-4 lg:mt-6">
                    <motion.button
                      type="button"
                      className={`text-md mx-2 select-none border-4 border-red-dark bg-red-light px-4 pt-3 pb-2 font-mono text-black shadow-nfc focus:outline-none focus:ring-0 sm:pt-4 sm:text-lg md:border-6 md:text-xl lg:text-2xl`}
                      style={{
                        boxShadow: "-6px 4px 1px rgba(0, 0, 0, 0.15)",
                      }}
                      onClick={() => toggleClaimModal(null)}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "-7px 5px 1px rgba(0, 0, 0, 0.15)",
                      }}
                      whileTap={{
                        scale: 0.95,
                        boxShadow: "-3px 2px 1px rgba(0, 0, 0, 0.15)",
                      }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="button"
                      className={`text-md mx-2 select-none border-4 border-cyan-dark bg-cyan-light px-4 pt-3 pb-2 font-mono text-black shadow-nfc focus:outline-none focus:ring-0 sm:pt-4 sm:text-lg md:border-6 md:text-xl lg:text-2xl`}
                      style={{
                        boxShadow: "-6px 4px 1px rgba(0, 0, 0, 0.15)",
                      }}
                      onClick={() => claimPxlFangmas()}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "-7px 5px 1px rgba(0, 0, 0, 0.15)",
                      }}
                      whileTap={{
                        scale: 0.95,
                        boxShadow: "-3px 2px 1px rgba(0, 0, 0, 0.15)",
                      }}
                    >
                      Confirm
                    </motion.button>
                  </div>
                  {claimMessage && claimMessage.length && (
                    <div className="my-6 mb-4">
                      <p className="font-medium leading-6 text-red-light">
                        <span className="sm:text-md text-sm text-shadow-nfc md:text-lg lg:text-xl">{claimMessage}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};
