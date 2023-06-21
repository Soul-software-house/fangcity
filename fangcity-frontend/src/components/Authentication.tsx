import React, { Fragment, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useMoralis, useChain, useEnsAddress } from "react-moralis";
import Moralis from "moralis-v1";
import { motion } from "framer-motion";

import { formatENSName, formatWalletAddress } from "../utils";
import { useGlobalState } from "../App";
import { Wallet } from "./Wallet";
import { COLORS } from "./Fangster";

import secret from "../assets/images/wardrobe/Secret.gif";

const FangsterQuery = new Moralis.Query("Fangster");
const PxlFangsterQuery = new Moralis.Query("PxlFangster");

const { REACT_APP_CHAIN, REACT_APP_FANGGANG_CONTRACT_ADDRESS, REACT_APP_PXLFANGS_CONTRACT_ADDRESS } = process.env;

export const Authentication = () => {
  const { enableWeb3, isWeb3Enabled, authenticate, user, isAuthenticated, refetchUserData } = useMoralis();
  const { switchNetwork, chainId, chain } = useChain();
  const { name } = useEnsAddress(user?.get("ethAddress"));
  const [currentFangster, setCurrentFangster] = useGlobalState("currentFangster");
  const [userFangsters, setUserFangsters] = useGlobalState("userFangsters");
  const [, setUserPxlFangsters] = useGlobalState("userPxlFangsters");
  const [, setModal] = useGlobalState("modal");

  // Make sure Web3 is enabled before running the functions
  //
  useEffect(() => {
    if (!isWeb3Enabled) {
      enableWeb3();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch user Fangsters and set current Fangster values
  //
  const fetchUserFangsters = async () => {
    try {
      const nfts = await Moralis.Web3API.account.getNFTsForContract({
        chain: REACT_APP_CHAIN === "rinkeby" ? "rinkeby" : "eth",
        address: user?.get("ethAddress"),
        token_address: REACT_APP_FANGGANG_CONTRACT_ADDRESS,
      });

      const tokenIds = nfts?.result?.length
        ? nfts.result.map(t => (t?.token_id ? Number(t.token_id) : null)).filter(t => t || t === 0)
        : [];

      const fangsters = await FangsterQuery.containedIn(
        "tokenId",
        tokenIds.map(t => Number(t))
      ).find();

      setUserFangsters(fangsters);
    } catch (_) {
      setUserFangsters([]);
    }
  };
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserFangsters();
    } else {
      setUserFangsters([]);
    }
  }, [isAuthenticated, user, chainId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUserPxlFangsters = async () => {
    try {
      const nfts = await Moralis.Web3API.account.getNFTsForContract({
        chain: REACT_APP_CHAIN === "rinkeby" ? "rinkeby" : "eth",
        address: user?.get("ethAddress"),
        token_address: REACT_APP_PXLFANGS_CONTRACT_ADDRESS,
      });

      const tokenIds = nfts?.result?.length
        ? nfts.result.map(t => (t?.token_id ? Number(t.token_id) : null)).filter(t => t || t === 0)
        : [];

      const pxlFangs = await PxlFangsterQuery.containedIn(
        "tokenId",
        tokenIds.map(t => Number(t))
      ).find();

      setUserPxlFangsters(pxlFangs);
    } catch (_) {
      setUserPxlFangsters([]);
    }
  };
  // Fetch user Fangsters and set current Fangster values
  //
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserPxlFangsters();
    } else {
      setUserFangsters([]);
    }
  }, [isAuthenticated, user, chainId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isAuthenticated) {
      setCurrentFangster(userFangsters.find(f => Number(f.get("tokenId")) === Number(user?.get("currentFangster"))));
    } else {
      setCurrentFangster(null);
    }
  }, [isAuthenticated, userFangsters, user, chainId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isAuthenticated) {
      refetchUserData();
    }
  }, [isAuthenticated, user, refetchUserData, chainId]);

  // expects wallet type string "MetaMask" or "WalletConnect"
  // and opens that selected wallet type
  const selectWallet = wallet => {
    if (wallet === "MetaMask") {
      authenticate({ signingMessage: "New Fang City Authentication" });
    } else if (wallet === "WalletConnect") {
      authenticate({ signingMessage: "New Fang City Authentication", provider: "walletconnect" });
    }
  };

  return (
    <div className="inset-0 flex items-center justify-center">
      <Menu as="div" className="relative inline-block text-left">
        <div className="inline-flex w-full items-center justify-center focus:outline-none">
          <div className="mr-4 mt-3 select-none text-right">
            <div className="font-mono text-xxs leading-4 text-white text-shadow-nfc sm:text-xs sm:leading-6">
              {isAuthenticated ? (
                <>
                  {chain?.networkId === (REACT_APP_CHAIN === "rinkeby" ? 4 : 1) ? (
                    <>
                      {name ? (
                        <>
                          {formatENSName(name)}
                          <span
                            className={`text-${
                              COLORS[
                                `${currentFangster?.get("background")}${
                                  currentFangster?.get("background") === "Purple" ? "Lightest" : "Light"
                                }`
                              ] || "slate-300"
                            }`}
                          >
                            .eth
                          </span>
                        </>
                      ) : (
                        <>
                          <span
                            className={`text-${
                              COLORS[
                                `${currentFangster?.get("background")}${
                                  currentFangster?.get("background") === "Purple" ? "Lightest" : "Light"
                                }`
                              ] || "slate-300"
                            }`}
                          >
                            0x
                          </span>
                          {formatWalletAddress(user?.get("ethAddress"), 6)}
                        </>
                      )}
                      <Wallet />
                    </>
                  ) : (
                    <span
                      className="cursor-pointer"
                      onClick={() => switchNetwork(REACT_APP_CHAIN === "rinkeby" ? "0x4" : "0x1")}
                    >
                      Switch to {REACT_APP_CHAIN === "rinkeby" ? "Rinkeby" : "Ethereum"}
                    </span>
                  )}
                </>
              ) : (
                <button
                  className="cursor-pointer"
                  onClick={() => authenticate({ signingMessage: "New Fang City Authentication" })}
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
          <Menu.Button className="flex max-w-xs items-center justify-end text-sm focus:outline-none focus:ring-0 focus:ring-offset-0">
            <motion.img
              className={`select-none border-${COLORS[currentFangster?.get("background")] || "black"} bg-${
                COLORS[currentFangster?.get("background")] || "black"
              }`}
              style={{
                borderRadius: "min(7vh, 35%)",
                borderWidth: "min(0.5vh, 6px)",
                boxShadow: "-6px 4px 1px rgba(0, 0, 0, 0.15)",
                height: "min(10vh, 100px)",
              }}
              src={isAuthenticated && currentFangster?.get("image")?.length ? currentFangster?.get("image") : secret}
              alt="Fangster"
              whileHover={{
                scale: 1.05,
                boxShadow: "-7px 5px 1px rgba(0, 0, 0, 0.15)",
              }}
              whileTap={{
                scale: 0.95,
                boxShadow: "-3px 2px 1px rgba(0, 0, 0, 0.15)",
              }}
            />
          </Menu.Button>
        </div>
        {isAuthenticated ? (
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items static className="absolute right-0 mt-2 origin-top-right focus:outline-none">
              <div className="flex flex-col text-right">
                <Menu.Item>
                  <motion.button
                    className={`my-2 rounded-xl border-[max(0.5vh,0.25rem)] px-4 py-2 text-lg font-medium text-black border-${
                      COLORS[currentFangster?.get("background")] || "purple-dark"
                    } bg-${COLORS[`${currentFangster?.get("background")}Light`] || "purple-light"}`}
                    style={{
                      boxShadow: "-6px 4px 1px rgba(0, 0, 0, 0.15)",
                    }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "-7px 5px 1px rgba(0, 0, 0, 0.15)",
                    }}
                    whileTap={{
                      scale: 0.95,
                      boxShadow: "-3px 2px 1px rgba(0, 0, 0, 0.15)",
                    }}
                    onClick={() => setModal("account")}
                  >
                    Account
                  </motion.button>
                </Menu.Item>
                <Menu.Item>
                  <motion.button
                    className={`my-2 rounded-xl border-[0.5vh] px-4 py-2 text-lg font-medium text-black border-${
                      COLORS[currentFangster?.get("background")] || "purple-dark"
                    } bg-${COLORS[`${currentFangster?.get("background")}Light`] || "purple-light"}`}
                    style={{
                      boxShadow: "-6px 4px 1px rgba(0, 0, 0, 0.15)",
                    }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "-7px 5px 1px rgba(0, 0, 0, 0.15)",
                    }}
                    whileTap={{
                      scale: 0.95,
                      boxShadow: "-3px 2px 1px rgba(0, 0, 0, 0.15)",
                    }}
                    onClick={() => setModal("fangsters")}
                  >
                    Fangsters
                  </motion.button>
                </Menu.Item>
                <Menu.Item>
                  <motion.button
                    className={`my-2 rounded-xl border-[0.5vh] px-4 py-2 text-lg font-medium text-black border-${
                      COLORS[currentFangster?.get("background")] || "purple-dark"
                    } bg-${COLORS[`${currentFangster?.get("background")}Light`] || "purple-light"}`}
                    style={{
                      boxShadow: "-6px 4px 1px rgba(0, 0, 0, 0.15)",
                    }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "-7px 5px 1px rgba(0, 0, 0, 0.15)",
                    }}
                    whileTap={{
                      scale: 0.95,
                      boxShadow: "-3px 2px 1px rgba(0, 0, 0, 0.15)",
                    }}
                    onClick={() => setModal("inventory")}
                  >
                    Inventory
                  </motion.button>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        ) : (
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items static className="absolute right-0 mt-2 origin-top-right focus:outline-none">
              <div className="flex flex-col text-right">
                <Menu.Item>
                  <motion.button
                    className={`my-2 rounded-xl border-[max(0.5vh,0.25rem)] px-4 py-2 text-lg font-medium text-black border-${
                      COLORS[currentFangster?.get("background")] || "purple-dark"
                    } bg-${COLORS[`${currentFangster?.get("background")}Light`] || "purple-light"}`}
                    style={{
                      boxShadow: "-6px 4px 1px rgba(0, 0, 0, 0.15)",
                    }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "-7px 5px 1px rgba(0, 0, 0, 0.15)",
                    }}
                    whileTap={{
                      scale: 0.95,
                      boxShadow: "-3px 2px 1px rgba(0, 0, 0, 0.15)",
                    }}
                    onClick={() => selectWallet("MetaMask")}
                  >
                    MetaMask
                  </motion.button>
                </Menu.Item>
                <Menu.Item>
                  <motion.button
                    className={`my-2 rounded-xl border-[0.5vh] px-4 py-2 text-lg font-medium text-black border-${
                      COLORS[currentFangster?.get("background")] || "purple-dark"
                    } bg-${COLORS[`${currentFangster?.get("background")}Light`] || "purple-light"}`}
                    style={{
                      boxShadow: "-6px 4px 1px rgba(0, 0, 0, 0.15)",
                    }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "-7px 5px 1px rgba(0, 0, 0, 0.15)",
                    }}
                    whileTap={{
                      scale: 0.95,
                      boxShadow: "-3px 2px 1px rgba(0, 0, 0, 0.15)",
                    }}
                    onClick={() => selectWallet("WalletConnect")}
                  >
                    WalletConnect
                  </motion.button>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        )}
      </Menu>
    </div>
  );
};
