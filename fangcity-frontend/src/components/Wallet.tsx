import React, { useEffect, useState } from "react";
import useInterval from "@jdthornton/useinterval";
import { Popover } from "@headlessui/react";
import { useMoralis, useChain, useWeb3ExecuteFunction } from "react-moralis";
import { Link } from "react-router-dom";
import numeral from "numeral";
import { motion } from "framer-motion";

import { useGlobalState } from "../App";
import { COLORS } from "./Fangster";
import { IAccruals, parseAccruals, weiToNumber } from "../utils";

import * as awooContract from "../contracts/awoo";
import * as claimingContract from "../contracts/claiming";

const { REACT_APP_FANGGANG_CONTRACT_ADDRESS, REACT_APP_PXLFANGS_CONTRACT_ADDRESS } = process.env;

numeral.nullFormat("---");

export const Wallet = () => {
  const { enableWeb3, isAuthenticated, isWeb3Enabled, user } = useMoralis();
  const { chainId } = useChain();
  const [currentFangster] = useGlobalState("currentFangster");
  const [unclaimedBalance, setunclaimedBalance] = useGlobalState("unclaimedBalance");
  const [, setERC20Balance] = useGlobalState("erc20Balance");
  const [nfcBalance, setNFCBalance] = useGlobalState("nfcBalance");
  const [, setFangGangAccruals] = useGlobalState("fangGangAccruals");
  const [, setPxlFangAccruals] = useGlobalState("pxlFangAccruals");
  const [open, setOpen] = useState(false);

  const unclaimed = useWeb3ExecuteFunction({
    abi: claimingContract.abi,
    contractAddress: claimingContract.contractAddress,
    functionName: "getTotalAccruals",
    params: {
      owner: user?.get("ethAddress"),
    },
  });

  const nfc = useWeb3ExecuteFunction({
    abi: awooContract.abi,
    contractAddress: awooContract.contractAddress,
    functionName: "balanceOfVirtual",
    params: {
      account: user?.get("ethAddress"),
    },
  });

  const erc20 = useWeb3ExecuteFunction({
    abi: awooContract.abi,
    contractAddress: awooContract.contractAddress,
    functionName: "balanceOf",
    params: {
      account: user?.get("ethAddress"),
    },
  });

  useEffect(() => {
    if (unclaimed?.data && unclaimed?.data[1]) {
      setunclaimedBalance(weiToNumber(unclaimed?.data[1] as string));
      const x = parseAccruals(unclaimed.data as IAccruals, REACT_APP_FANGGANG_CONTRACT_ADDRESS) as any;
      setFangGangAccruals(x);
      const y = parseAccruals(unclaimed.data as IAccruals, REACT_APP_PXLFANGS_CONTRACT_ADDRESS) as any;
      setPxlFangAccruals(y);
    }
  }, [unclaimed.data]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (erc20?.data) {
      setERC20Balance(weiToNumber(erc20.data as string));
    }
  }, [erc20.data]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (nfc?.data) {
      setNFCBalance(weiToNumber(nfc.data as string));
    }
  }, [nfc.data]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isWeb3Enabled) {
      enableWeb3();
    } else if (isAuthenticated) {
      unclaimed.fetch();
      erc20.fetch();
      nfc.fetch();
    }
  }, [isAuthenticated, isWeb3Enabled, enableWeb3, chainId]); // eslint-disable-line react-hooks/exhaustive-deps

  useInterval(
    () => {
      unclaimed.fetch();
      nfc.fetch();
      erc20.fetch();
    },
    isAuthenticated && isWeb3Enabled ? 30_000 : null
  );

  return (
    <div className="relative">
      <Popover>
        <Popover.Button
          onMouseEnter={() => setOpen(true)}
          onMouseOver={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <span className="block text-shadow-nfc">
            {numeral(unclaimedBalance + nfcBalance).format("0,0.[00]")}{" "}
            <span
              className={`text-${
                COLORS[
                  `${currentFangster?.get("background")}${
                    currentFangster?.get("background") === "Purple" ? "Lightest" : "Light"
                  }`
                ] || "slate-300"
              }`}
            >
              <Link to="/bank">AWOO</Link>
            </span>
          </span>
        </Popover.Button>
        {open && (
          <Popover.Panel static className="">
            <motion.div
              className={`absolute right-0 my-2 rounded-xl border-[0.5vh] px-4 py-2 font-sans text-lg font-medium text-black text-shadow-none border-${
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
            >
              <div className="flex flex-col pt-[0.43rem]">
                <div className="flex w-full flex-row justify-between">
                  <div className="mr-4 whitespace-nowrap text-sm font-medium text-white">NFC Wallet</div>
                  <div className="-mt-[0.215rem] whitespace-nowrap font-mono text-xxs text-black">
                    {numeral(nfcBalance).format("0,0.[00]")}
                  </div>
                </div>
                <div className="flex w-full flex-row justify-between">
                  <div className="mr-4 whitespace-nowrap text-sm font-medium text-white">Unclaimed Balance</div>
                  <div className="-mt-[0.215rem] whitespace-nowrap font-mono text-xxs text-black">
                    {numeral(unclaimedBalance).format("0,0.[00]")}
                  </div>
                </div>
              </div>
            </motion.div>
          </Popover.Panel>
        )}
      </Popover>
    </div>
  );
};
