import React, { useEffect } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { ethers } from "ethers";

import { useGlobalState } from "../../App";
import { Button } from "../Button";
import { Presence } from "../Presence";

import * as marketplaceContract from "../../contracts/marketplace";
import * as claimingContract from "../../contracts/claiming";

// provider is read-only get a signer for on-chain transactions

export const CityHall = () => {
  const { user, isWeb3Enabled, enableWeb3, web3 } = useMoralis();
  const [, setBackgroundClass] = useGlobalState("backgroundClass");
  const [, setLocation] = useGlobalState("location");

  const purchaseFunction = useWeb3ExecuteFunction({
    contractAddress: marketplaceContract.contractAddress,
    functionName: "purchaseUpgrade",
    abi: marketplaceContract.abi,
    params: {},
  });

  const ratesFunction = useWeb3ExecuteFunction({
    contractAddress: claimingContract.contractAddress,
    functionName: "baseRateTokenOverride",
    abi: claimingContract.abi,
    params: {},
  });

  useEffect(() => {
    setBackgroundClass("bg-cityhall-background");
    setLocation("city-hall");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    enableWeb3();
    setBackgroundClass("bg-city-hall-background");

    console.log({
      params: { params: { address: process.env.REACT_APP_PXLFANGS_CONTRACT_ADDRESS, tokenId: 1 } },
    });

    ratesFunction.fetch({
      params: { params: { address: process.env.REACT_APP_PXLFANGS_CONTRACT_ADDRESS, tokenId: 1 } },
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isWeb3Enabled) {
      console.log("WEB3 ENABLED");
    }
  }, [isWeb3Enabled]);

  const makePurchase = async () => {
    const message = `As the owner of Ethereum address\r\n${user?.get(
      "ethAddress"
    )}\r\nI authorize the spending of 50 virtual $AWOO`;
    const signer = await web3.getSigner();
    console.log("SIGNER ADDRESS", await signer.getAddress());

    const p = {
      hash: "",
      sig: "",
      nonce: "0",
      itemName: "Item1",
      collectionAddress: process.env.REACT_APP_PXLFANGS_CONTRACT_ADDRESS,
      tokenId: 1,
    };
    const hash = ethers.utils.hashMessage(message);
    console.log("HASH", hash);
    let sig = await signer.signMessage(message);

    // adding a fix for ledgers:
    // https://ethereum.stackexchange.com/questions/103307/cannot-verifiy-a-signature-produced-by-ledger-in-solidity-using-ecrecover
    if (sig.slice(-2) === "01") {
      sig = sig.slice(0, -2) + "1C";
    } else if (sig.slice(-2) === "00") {
      sig = sig.slice(0, -2) + "1B";
    }

    p.hash = ethers.utils.hashMessage(message);
    p.sig = sig;

    console.log("PURCHASING");
    await purchaseFunction.fetch({ params: { params: p } });
    console.log("PURCHASED");
  };

  useEffect(() => {
    console.log(
      "PURCHASE",
      purchaseFunction.data,
      purchaseFunction.error,
      purchaseFunction.isFetching,
      purchaseFunction.isLoading
    );
  }, [purchaseFunction.data, purchaseFunction.error, purchaseFunction.isFetching, purchaseFunction.isLoading]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    console.log("RATES", ratesFunction.data, ratesFunction.isFetching, ratesFunction.isLoading);
  }, [ratesFunction.data, ratesFunction.isFetching, ratesFunction.isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className=" flex w-screen overflow-y-hidden">
      <div className="border-red-dark border-magenta-light border-magenta-dark border-red-light border-red-dark border-purple-light border-purple-dark border-cyan-light border-cyan-dark border-yellow-light border-yellow-dark bg-cyan-light bg-magenta-light bg-magenta-dark bg-red-light bg-red-dark bg-purple-light bg-purple-dark bg-cyan-dark bg-yellow-light bg-yellow-dark text-slate-300 text-magenta-light text-magenta-dark text-red-light text-red-dark text-purple-lightest text-purple-light text-purple-dark text-cyan-light text-cyan-dark text-yellow-light text-yellow-dark ring-red-light focus:border-red-light focus:border-red-light focus:border-purple-light focus:border-purple-light focus:border-cyan-light focus:ring-cyan-light focus:ring-yellow-light focus:ring-yellow-light focus:ring-magenta-light focus:ring-magenta-light" />
      <div className="bg-city-hall-background relative z-[999] flex h-full min-w-screen shrink-0 flex-row items-center justify-center bg-tiling bg-repeat-x pt-12">
        <div className="mx-auto">
          <Button color="cyan" text="Purchase" onClick={makePurchase} />
        </div>
        <Presence />
      </div>
    </div>
  );
};
