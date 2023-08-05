import React, { Fragment, useEffect, useRef, useState } from "react";
import { useMoralis, useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import Moralis from "moralis-v1";
import Snowfall from "react-snowfall";
import { motion } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";

import fangstaClaus from "../assets/images/fangmas-fangsta-claus.png";
import header from "../assets/images/fangmas-header.png";
import openImg from "../assets/images/fangmas-open.png";
import openedImg from "../assets/images/fangmas-opened.png";
import secretImg from "../assets/images/wardrobe/Secret.gif";
import unopenedImg from "../assets/images/fangmas-unopened.png";

const Fangster = Moralis.Object.extend("Fangster");
const FangsterQuery = new Moralis.Query(Fangster);

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

const fetchFangsters = async (tokenIds: number[]) => {
  try {
    const fangsters = await FangsterQuery.containedIn("tokenId", tokenIds).find();

    return fangsters;
  } catch (e) {
    return [];
  }
};

const defaultDays = [];
for (let i = 12; i <= 23; i++) {
  defaultDays.push({
    claimed: false,
    imageUrl: unopenedImg,
    openSeaUrl: null,
    number: i,
    opened: false,
    today: false,
  });
}

export const Fangmas = () => {
  const { authenticate, user, isAuthenticated, isInitialized, logout, refetchUserData } = useMoralis();
  const Web3Api = useMoralisWeb3Api();
  const { fetch, data } = useMoralisWeb3ApiCall(Web3Api.account.getNFTsForContract, {
    chain: "eth",
    address: user?.get("ethAddress") || "0x0000000000000000000000000000000000000000",
    token_address: "0x9d418c2cae665d877f909a725402ebd3a0742844",
  });
  const [days, setDays] = useState(defaultDays);
  const [currentFangsterId, setCurrentFangsterId] = useState(user?.get("currentFangster") ?? null);
  const [currentFangster, setCurrentFangster] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [claimOpen, setClaimOpen] = useState(false);
  const [claimDay, setClaimDay] = useState(null);
  const [claimMessage, setClaimMessage] = useState("");
  const cancelButtonRef = useRef(null);

  const fetchDays = async () => {
    let days = defaultDays;

    try {
      days = await Moralis.Cloud.run("fetchFangmas");
    } catch (e) {
      // noopt
    } finally {
      setDays(days);
    }
  };

  useEffect(() => {
    const updateFangsters = async () => {
      const tokenIds = data?.result
        ? data.result
            .filter(t => t?.token_address === "0x9d418c2cae665d877f909a725402ebd3a0742844")
            .map(t => (t?.token_id ? Number(t.token_id) : null))
            .filter(t => t)
        : [];

      const fangsters = await fetchFangsters(tokenIds);
      const current = fangsters[Math.floor(Math.random() * fangsters.length)];
      setCurrentFangster(current);
    };

    updateFangsters();
  }, [currentFangsterId, isAuthenticated, user, data]);

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
    await setCurrentFangsterId(user?.get("currentFangster") ?? null);
  };

  const colorClass = (day): string => {
    switch (buttonText(day)) {
      case "Open":
        return "magenta";
      case "Opened":
        return "cyan";
      case "Unopened":
        return "purple";
      case "Expired":
        return "red";
      default:
        return "gray";
    }
  };

  const buttonText = (day): string => {
    if (day.opened) {
      if (day.today) {
        if (!day.claimed) {
          return "Open";
        } else {
          return "Opened";
        }
      } else {
        if (day.claimed) {
          return "Opened";
        } else {
          return "Expired";
        }
      }
    } else {
      return "Unopened";
    }
  };

  const saturationClass = (day): string => {
    const opened = days.some(day => day.claimed);

    switch (buttonText(day)) {
      case "Open":
        return opened || !currentFangster
          ? "group-hover:saturate-0 cursor-not-allowed group-focus:saturate-0"
          : "cursor-pointer";
      case "Expired":
        return "cursor-pointer";
      default:
        return "";
    }
  };

  const imageSrc = (day): string => {
    switch (buttonText(day)) {
      case "Open":
        return openImg;
      case "Opened":
        return !day?.today && day?.imageUrl?.startsWith("http") ? day.imageUrl : openedImg;
      case "Unopened":
        return unopenedImg;
      default:
        return day?.imageUrl?.startsWith("http") ? day.imageUrl : unopenedImg;
    }
  };

  const handleClick = async day => {
    if (day.opened && !day.today && day?.openSeaUrl?.length) {
      window.open(day.openSeaUrl);
    } else if (currentFangster && day.opened && day.today && !days.some(day => day.claimed)) {
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

  const claimFangmas = async () => {
    try {
      const result = await Moralis.Cloud.run("updateFangmas", { number: claimDay.number });

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
        <div className="mx-auto max-w-7xl p-0 md:p-8">
          <div className="mx-auto max-w-6xl">
            <div className="relative">
              <img
                src={header}
                alt="12 Days of Fangmas"
                className="relative z-0 min-h-150 w-full overflow-hidden border-0 object-cover md:rounded-t-xxl md:border-t-6 md:border-l-6 md:border-r-6"
                style={{
                  borderColor: COLORS["black"],
                  boxShadow: "-10px 8px 1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <div className="absolute top-0 left-0 flex h-full w-full items-center justify-end p-4 sm:p-6 md:p-8">
                <p className="md:text-md relative flex h-full w-2/5 flex-col justify-between text-right text-xxs leading-3 sm:text-sm sm:leading-none lg:text-lg">
                  <div className="mb-2 flex flex h-16 w-full items-center justify-end text-sm focus:outline-none focus:ring-0 focus:ring-offset-0 sm:mb-4 md:h-24 lg:mb-6">
                    {!isAuthenticated && (
                      <motion.div
                        className="select-none"
                        animate={{
                          x: [-25, 0, -25],
                          scale: [1, 1.1, 1],
                          transition: {
                            repeat: Infinity,
                            duration: 1,
                          },
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mt-2 mr-3 h-8 w-8 select-none sm:mr-4 sm:h-12 sm:w-12 md:mr-5 md:h-16 md:w-16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 5l7 7-7 7M5 5l7 7-7 7"
                          />
                        </svg>
                      </motion.div>
                    )}
                    <motion.img
                      className="h-16 w-16 cursor-pointer select-none rounded-xl border-4 sm:h-20 sm:w-20 md:h-24 md:w-24 md:rounded-xxl md:border-6"
                      style={{
                        backgroundColor:
                          COLORS[
                            currentFangster?.get("background")
                              ? `${currentFangster?.get("background")?.toLowerCase()}-dark`
                              : "black"
                          ],
                        borderColor:
                          COLORS[
                            currentFangster?.get("background")
                              ? `${currentFangster?.get("background")?.toLowerCase()}-dark`
                              : "black"
                          ],
                        boxShadow: "-6px 4px 1px rgba(0, 0, 0, 0.15)",
                      }}
                      src={
                        isAuthenticated && currentFangster?.get("image")?.length
                          ? currentFangster?.get("image")
                          : secretImg
                      }
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
                  <img src={fangstaClaus} alt="Fangsta Claus is coming!" />
                  <span className="block font-medium">
                    Every day is a new surprise. Choose wisely!&nbsp;
                    <br className="hidden sm:inline-block" />
                    You will only be able to open 1 of the 12 gifts.
                  </span>
                  <span className="block font-light italic">Exclusive to Fang Gang holders.</span>
                </p>
              </div>
            </div>
          </div>
          <div
            className="relative z-50 mx-auto max-w-6xl border-0 bg-yellow-light p-4 sm:p-6 md:rounded-b-xxl md:border-b-6 md:border-l-6 md:border-r-6 md:border-black lg:p-8"
            style={{
              boxShadow: "-10px 8px 1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {days.map((day, index) => (
                <motion.div
                  className={`group relative mb-8 inline-block w-full align-bottom lg:mb-10`}
                  whileHover={{
                    scale: 1.025,
                  }}
                  whileTap={{
                    scale: 0.975,
                  }}
                  onClick={() => handleClick(day)}
                >
                  <p
                    className={`absolute top-0 right-0 z-10 w-full p-6 text-right text-3xl font-extrabold ${saturationClass(
                      day
                    )}`}
                    style={{
                      color: COLORS[`${colorClass(day)}-dark`],
                    }}
                  >
                    {day.number}
                  </p>
                  {days.some(day => day.claimed) && day.today && (
                    <div className="pointer-events-none absolute z-10 flex h-full w-full items-center">
                      <p className="sm:text-md m-3 hidden rounded-xxl bg-black bg-opacity-50 p-3 text-center text-sm font-extrabold text-white text-shadow-nfc group-hover:block md:text-lg lg:text-xl">
                        {day.claimed
                          ? "Your gift will be revealed tomorrow."
                          : "Don't be naughty. You already opened your present!"}
                      </p>
                    </div>
                  )}
                  {!currentFangster && day.today && (
                    <div className="pointer-events-none absolute z-10 flex h-full w-full items-center">
                      <p className="sm:text-md m-3 hidden rounded-xxl bg-black bg-opacity-50 p-3 text-center text-sm font-extrabold text-white text-shadow-nfc group-hover:block md:text-lg lg:text-xl">
                        {isAuthenticated
                          ? "You must hold a Fangster to open a present!"
                          : "You must sign in to MetaMask to open a present!"}
                      </p>
                    </div>
                  )}
                  <motion.img
                    key={index}
                    className={`z-0 mx-auto shrink-0 select-none overflow-hidden rounded-xxl border-4 md:border-6 ${saturationClass(
                      day
                    )}`}
                    style={{
                      boxShadow: "-6px 4px 1px rgba(0, 0, 0, 0.15)",
                      borderColor: COLORS[`${colorClass(day)}-dark`],
                    }}
                    whileHover={{
                      boxShadow: "-8px 6px 1px rgba(0, 0, 0, 0.15)",
                    }}
                    whileTap={{
                      boxShadow: "-3px 2px 1px rgba(0, 0, 0, 0.15)",
                    }}
                    src={imageSrc(day)}
                    alt=""
                  />
                  <motion.button
                    type="button"
                    className={`md:text-md z-99 absolute -bottom-8 left-0 right-0 -mt-px w-full cursor-default select-none rounded-full border-4 py-2 text-center align-middle text-sm font-bold md:border-6 lg:-bottom-10 lg:text-lg ${saturationClass(
                      day
                    )}`}
                    style={{
                      boxShadow: "-6px 4px 1px rgba(0, 0, 0, 0.15)",
                      color: COLORS[`${colorClass(day)}-dark`],
                      backgroundColor: COLORS[`${colorClass(day)}-light`],
                      borderColor: COLORS[`${colorClass(day)}-dark`],
                    }}
                    whileHover={{
                      boxShadow: "-8px 6px 1px rgba(0, 0, 0, 0.15)",
                    }}
                    whileTap={{
                      boxShadow: "-3px 2px 1px rgba(0, 0, 0, 0.15)",
                    }}
                  >
                    {buttonText(day)}
                  </motion.button>
                </motion.div>
              ))}
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
              <div className="inline-block select-none overflow-hidden rounded-lg rounded-xxl border-4 border-black bg-primary bg-black bg-opacity-90 p-4 text-left align-bottom shadow-xl shadow-nfc transition-all sm:w-full sm:max-w-2xl sm:p-6 sm:align-middle md:border-6">
                <div className="text-center">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold leading-6 text-white text-shadow-nfc sm:text-xl md:text-2xl lg:text-3xl"
                  >
                    Account
                  </Dialog.Title>
                  <div className="my-4 md:my-6 lg:my-8">
                    <input
                      disabled
                      type="text"
                      className={`text-md w-full select-none rounded-full border-4 border-purple-dark bg-purple-light px-4 py-2 font-mono font-medium text-black shadow-nfc sm:text-lg md:border-6 md:text-xl lg:text-2xl`}
                      style={{
                        boxShadow: "-6px 4px 1px rgba(0, 0, 0, 0.15)",
                      }}
                      value={user?.get("ethAddress")}
                    />
                  </div>
                  <div className="mt-2 md:mt-4 lg:mt-6">
                    <motion.button
                      type="button"
                      className={`text-md select-none rounded-full border-4 border-red-dark bg-red-light px-4 py-2 font-medium text-black shadow-nfc focus:outline-none focus:ring-0 sm:text-lg md:border-6 md:text-xl lg:text-2xl`}
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
              <div className="inline-block select-none overflow-hidden rounded-lg rounded-xxl border-4 border-black bg-primary bg-black bg-opacity-90 p-4 text-left align-bottom shadow-xl shadow-nfc transition-all sm:w-full sm:max-w-2xl sm:p-6 sm:align-middle md:border-6">
                <div className="text-center">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold leading-6 text-white text-shadow-nfc sm:text-xl md:text-2xl lg:text-3xl"
                  >
                    Confirm Opening This Present?
                  </Dialog.Title>
                  <div className="my-4 md:my-6 lg:my-8">
                    <p className="leading-6 text-white">
                      <span className="sm:text-md text-sm text-shadow-nfc md:text-lg lg:text-xl">
                        Choose wisely!{" "}
                        <span className="font-extrabold">You will only be able to open 1 of the 12 gifts.</span>{" "}
                        Presents will be revealed on the following day.
                      </span>
                    </p>
                  </div>
                  <div className="mt-2 md:mt-4 lg:mt-6">
                    <motion.button
                      type="button"
                      className={`text-md mx-2 select-none rounded-full border-4 border-red-dark bg-red-light px-4 py-2 font-medium text-black shadow-nfc focus:outline-none focus:ring-0 sm:text-lg md:border-6 md:text-xl lg:text-2xl`}
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
                      className={`text-md mx-2 select-none rounded-full border-4 border-cyan-dark bg-cyan-light px-4 py-2 font-medium text-black shadow-nfc focus:outline-none focus:ring-0 sm:text-lg md:border-6 md:text-xl lg:text-2xl`}
                      style={{
                        boxShadow: "-6px 4px 1px rgba(0, 0, 0, 0.15)",
                      }}
                      onClick={() => claimFangmas()}
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
