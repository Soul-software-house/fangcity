import React, { useEffect, useState } from "react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/solid";
import useInterval from "@jdthornton/useinterval";
import { motion } from "framer-motion";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";

import { useGlobalState } from "../../App";
import { COLORS } from "../Fangster";
import { Button } from "../Button";
import { DisclosureText } from "../DisclosureText";
import { FormattedNumber } from "../FormattedNumber";
import { Modal } from "../Modal";
import { UPGRADE_COST, COLLECTION_ID, ITEM_ID } from "./SuperPxls";

import * as collectionContract from "../../contracts/collection";
import * as storeContract from "../../contracts/store";
import * as oldStoreContract from "../../contracts/store-old";

import { ERROR_MESSAGES } from "../../utils";
import loading from "../../assets/images/loading.svg";

const { REACT_APP_SPEEDY_NODE_URL } = process.env;

export const ApplyItem = () => {
  const { user, isAuthenticated, isWeb3Enabled, enableWeb3 } = useMoralis();
  const [modal] = useGlobalState("modal");
  const [userPxlFangsters] = useGlobalState("userPxlFangsters");
  const [applyItem, setApplyItem] = useGlobalState("applyItem");
  const [, setTransaction] = useGlobalState("transaction");
  const [, setTransactionMessage] = useGlobalState("transactionMessage");
  const [collectionItems] = useGlobalState("collectionItems");
  const [, setModal] = useGlobalState("modal");
  const [pxlFangsters, setPxlFangsters] = useState([]);
  const [selectedPxlFang, setSelectedPxlFang] = useState(null);
  const [step, setStep] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [upgraded, setUpgraded] = useState({});
  const [upgradedNew, setUpgradedNew] = useState({});
  const [upgradedOld, setUpgradedOld] = useState({});
  const [approvalTransaction, setApprovalTransaction] = useState("");
  const [approvalTransactionResult, setApprovalTransactionResult] = useState(null);

  const applyMintedItemFunction = useWeb3ExecuteFunction({
    contractAddress: storeContract.contractAddress,
    functionName: "applyMintedItem",
    abi: storeContract.abi,
    params: {},
  });

  const isApprovedForAllFunction = useWeb3ExecuteFunction({
    contractAddress: collectionContract.contractAddress,
    functionName: "isApprovedForAll",
    abi: collectionContract.abi,
    params: {},
  });

  const setApprovalForAllFunction = useWeb3ExecuteFunction({
    contractAddress: collectionContract.contractAddress,
    functionName: "setApprovalForAll",
    abi: collectionContract.abi,
    params: {},
  });

  const checkItemTokenApplicationStatusFunction = useWeb3ExecuteFunction({
    contractAddress: storeContract.contractAddress,
    functionName: "checkItemTokenApplicationStatus",
    abi: storeContract.abi,
    params: {},
  });
  const checkItemTokenApplicationStatusFunctionOld = useWeb3ExecuteFunction({
    contractAddress: oldStoreContract.contractAddress,
    functionName: "checkItemTokenApplicationStatus",
    abi: oldStoreContract.abi,
    params: {},
  });

  // Make sure Web3 is enabled before running the functions
  //
  useEffect(() => {
    if (!isWeb3Enabled) {
      enableWeb3();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const refetchItems = modal !== "apply-item";
  const fetchApproved = () => {
    isApprovedForAllFunction.fetch({
      params: {
        params: {
          operator: storeContract.contractAddress,
          account: user?.get("ethAddress"),
        },
      },
    });
  };

  useEffect(() => {
    fetchApproved();
  }, [refetchItems]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (
      isApprovedForAllFunction?.data &&
      !isApprovedForAllFunction?.isFetching &&
      !isApprovedForAllFunction?.isLoading
    ) {
      setIsApproved(!!isApprovedForAllFunction.data);
    }
  }, [isApprovedForAllFunction.data, isApprovedForAllFunction.isFetching, isApprovedForAllFunction.isLoading]);

  useEffect(() => {
    if (modal === null) {
      setSelectedPxlFang(null);
      setApplyItem(null);
      setStep(null);
      setErrorMessage(null);
    }
  }, [modal]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isAuthenticated) {
      setStep(step || 1);
    } else {
      setStep(null);
    }

    setErrorMessage(null);
  }, [isAuthenticated, step]);

  useEffect(() => {
    setPxlFangsters(
      userPxlFangsters.map(f => ({
        background: f?.get("background"),
        id: f.id,
        image: f?.get("image"),
        name: f?.get("name"),
        tokenId: f?.get("tokenId"),
        super: f?.get("super"),
      }))
    );
  }, [userPxlFangsters]);

  useEffect(() => {
    if (collectionItems?.length) {
      // noopt
    } else {
      setStep(0);
    }
  }, [collectionItems?.length]);

  const processApply = async () => {
    if (!isApproved) {
      await setApprovalForAllFunction.fetch({
        params: {
          params: {
            operator: storeContract.contractAddress,
            approved: true,
          },
        },
      });
    } else {
      callApplyItem();
    }
  };

  const callApplyItem = async () => {
    applyMintedItemFunction.fetch({
      params: {
        params: {
          itemId: applyItem.tokenId,
          applicationTokenIds: [selectedPxlFang?.tokenId],
        },
      },
    });
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (applyMintedItemFunction?.error) {
      Object.keys(ERROR_MESSAGES).forEach(em => {
        if (applyMintedItemFunction?.error?.message?.includes(em)) {
          setErrorMessage(ERROR_MESSAGES[em]);
        }
      });
    }
    if (applyMintedItemFunction?.data && !applyMintedItemFunction?.isFetching && !applyMintedItemFunction?.isLoading) {
      setTransaction(applyMintedItemFunction.data["hash"]);
      setTransactionMessage(`You applied a ${applyItem?.name} to PxlFangster ${selectedPxlFang.tokenId}!`);
      setModal("transaction");
    }
  }, [applyMintedItemFunction.data, applyMintedItemFunction.isFetching, applyMintedItemFunction.isLoading]);

  useEffect(() => {
    if (checkItemTokenApplicationStatusFunction?.error) {
      Object.keys(ERROR_MESSAGES).forEach(em => {
        if (checkItemTokenApplicationStatusFunction?.error?.message?.includes(em)) {
          setErrorMessage(ERROR_MESSAGES[em]);
        }
      });
    }
    if (checkItemTokenApplicationStatusFunctionOld?.error) {
      Object.keys(ERROR_MESSAGES).forEach(em => {
        if (checkItemTokenApplicationStatusFunctionOld?.error?.message?.includes(em)) {
          setErrorMessage(ERROR_MESSAGES[em]);
        }
      });
    }
    if (
      checkItemTokenApplicationStatusFunction?.data &&
      !checkItemTokenApplicationStatusFunction?.isFetching &&
      !checkItemTokenApplicationStatusFunction?.isLoading
    ) {
      const x = (checkItemTokenApplicationStatusFunction?.data?.[0] || []).reduce((acc, item, index) => {
        acc[item] = checkItemTokenApplicationStatusFunction?.data?.[1]?.[index]?.toNumber() > 0;
        return acc;
      }, {});

      setUpgradedNew(x);
    }
    if (
      checkItemTokenApplicationStatusFunctionOld?.data &&
      !checkItemTokenApplicationStatusFunctionOld?.isFetching &&
      !checkItemTokenApplicationStatusFunctionOld?.isLoading
    ) {
      const x = (checkItemTokenApplicationStatusFunctionOld?.data?.[0] || []).reduce((acc, item, index) => {
        acc[item] = checkItemTokenApplicationStatusFunctionOld?.data?.[1]?.[index]?.toNumber() > 0;
        return acc;
      }, {});

      setUpgradedOld(x);
    }
  }, [
    checkItemTokenApplicationStatusFunction.data,
    checkItemTokenApplicationStatusFunction.isFetching,
    checkItemTokenApplicationStatusFunction.isLoading,
    checkItemTokenApplicationStatusFunctionOld.data,
    checkItemTokenApplicationStatusFunctionOld.isFetching,
    checkItemTokenApplicationStatusFunctionOld.isLoading,
  ]);

  useEffect(() => {
    const combined = {};

    Object.keys(upgradedNew).forEach(key => {
      combined[key] = upgradedNew[key];
    });
    Object.keys(upgradedOld).forEach(key => {
      if (combined[key] !== undefined) {
        combined[key] = combined[key] || upgradedOld[key];
      } else {
        combined[key] = upgradedOld[key];
      }
    });

    setUpgraded(combined);
  }, [upgradedNew, upgradedOld]);

  useEffect(() => {
    if (setApprovalForAllFunction?.error) {
      Object.keys(ERROR_MESSAGES).forEach(em => {
        if (setApprovalForAllFunction?.error?.message?.includes(em)) {
          setErrorMessage(ERROR_MESSAGES[em]);
        }
      });
    }
    if (
      setApprovalForAllFunction?.data &&
      !setApprovalForAllFunction?.isFetching &&
      !setApprovalForAllFunction?.isLoading
    ) {
      setApprovalTransaction(setApprovalForAllFunction?.data["hash"]);
    }
  }, [setApprovalForAllFunction.data, setApprovalForAllFunction.isFetching, setApprovalForAllFunction.isLoading]);

  useInterval(
    async () => {
      const payload = {
        jsonrpc: "2.0",
        method: "eth_getTransactionReceipt",
        params: [approvalTransaction],
        id: 1,
      };

      const response = await fetch(REACT_APP_SPEEDY_NODE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseJson = await response.json();
      setApprovalTransactionResult(responseJson?.result?.status);

      if (responseJson?.result?.status) {
        await fetchApproved();
        callApplyItem();
      }
    },
    approvalTransaction?.length && !approvalTransactionResult ? 5_000 : null
  );

  useEffect(() => {
    if (modal === "apply-item") {
      checkItemTokenApplicationStatusFunction.fetch({
        params: {
          params: {
            collectionId: COLLECTION_ID,
            itemId: ITEM_ID,
            tokenIds: userPxlFangsters.map(f => f.get("tokenId")),
          },
        },
      });
      checkItemTokenApplicationStatusFunctionOld.fetch({
        params: {
          params: {
            collectionId: COLLECTION_ID,
            itemId: ITEM_ID,
            tokenIds: userPxlFangsters.map(f => f.get("tokenId")),
          },
        },
      });
    }
  }, [modal === "apply-item"]);
  /* eslint-enable react-hooks/exhaustive-deps */

  useInterval(() => fetchApproved(), isAuthenticated && !isApproved ? 30_000 : null);

  return (
    <Modal title={applyItem?.name} modal="apply-item">
      <div
        className="mx-auto max-h-[min(50vh,400px)] max-w-[min(50vh,400px)] overflow-hidden border-purple-light bg-purple-light"
        style={{
          borderRadius: "min(7vh, 35%)",
          borderWidth: "0.5vh",
        }}
      >
        <img
          className="h-full w-full select-none border-purple-light bg-purple-light"
          src={applyItem?.image}
          alt="SuperPxl Chip"
        />
      </div>

      {step === null && (
        <div className="mt-12">
          <DisclosureText className="mx-2 text-left" color="white">
            Super PxlChips are consumable ERC-1155 NFTs that can be used to upgrade PxlFangsters into Super PxlFangsters
            with higher levels of detail and enhanced functionality including higher per day $AWOO earning, upgraded
            Webb3 mechs, and more.
          </DisclosureText>
        </div>
      )}

      {step === 0 && (
        <div className="mt-12">
          <DisclosureText className="mx-2 text-left" color="white">
            <span className="font-bold">It looks like you don't have any items to apply.</span> Purchasing a Super
            PxlChip costs <FormattedNumber value={UPGRADE_COST} />. They are consumable ERC-1155 NFTs that can be used
            to upgrade PxlFangsters into Super PxlFangsters with higher levels of detail and enhanced functionality
            including higher per day $AWOO earning, upgraded Webb3 mechs, and more.
          </DisclosureText>
        </div>
      )}

      {step === 1 && (
        <>
          <div className="mt-12">
            <h3 className="ml-1 mr-2 flex justify-between text-left text-xl font-bold leading-6 text-white">
              Choose PxlFangster To Upgrade
            </h3>

            <DisclosureText className="mx-1 mt-2 mb-8 text-left">
              You must select which PxlFangsters to apply your {applyItem?.name} to.
            </DisclosureText>

            <div className="-mx-2 mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-4 md:grid-cols-4">
              {pxlFangsters.map(pxlFangster => (
                <label className="m-2" key={pxlFangster?.id} htmlFor={`pxlFangster-${pxlFangster?.id}`}>
                  <motion.div
                    className={`bg-${COLORS[pxlFangster.background] || "black"} border-${
                      COLORS[pxlFangster.background] || "black"
                    } ${selectedPxlFang?.tokenId === pxlFangster?.tokenId ? "" : "saturate-0"} ${
                      upgraded[pxlFangster?.tokenId] ? "cursor-not-allowed" : ""
                    } overflow-hidden rounded-[min(7vh,35%)] border-[max(0.5vh,0.25rem)]`}
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
                    <img
                      key={pxlFangster.tokenId}
                      className={`h-full w-full cursor-pointer select-none ${
                        upgraded[pxlFangster?.tokenId] ? "cursor-not-allowed" : ""
                      }`}
                      src={pxlFangster.image}
                      alt={pxlFangster.name}
                    />
                  </motion.div>
                  <div className="mt-2 font-mono text-xxs text-white">
                    {upgraded[pxlFangster?.tokenId] ? (
                      <p className="text-slate-300">Upgraded</p>
                    ) : (
                      <p className="text-green-light">Available</p>
                    )}
                  </div>
                  <input
                    id={`pxlFangster-${pxlFangster.id}`}
                    name={pxlFangster?.tokenId}
                    type="checkbox"
                    checked={selectedPxlFang?.tokenId === pxlFangster?.tokenId}
                    onClick={() =>
                      selectedPxlFang?.tokenId === pxlFangster?.tokenId
                        ? setSelectedPxlFang(null)
                        : setSelectedPxlFang(pxlFangster)
                    }
                    onChange={() => false}
                    className="hidden h-4 w-4 rounded border-gray-300"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <div>
              <Button onClick={() => setStep(2)} color="green" disabled={!selectedPxlFang}>
                <div className="flex flex-nowrap whitespace-nowrap">
                  Next
                  <ArrowRightIcon className="ml-2 h-8 w-8" />
                </div>
              </Button>
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="relative mt-12">
            <h3 className="ml-1 mr-2 flex justify-between text-left text-xl font-bold leading-6 text-white">
              Awoo! Here's what's going to happen…
            </h3>

            <ol className="ml-6 mr-2 list-decimal text-left text-lg text-white">
              <li className="my-4">
                You are applying <FormattedNumber value={1} /> {applyItem?.name} to PxlFangster{" "}
                <FormattedNumber>{selectedPxlFang?.tokenId}</FormattedNumber> and burning <FormattedNumber value={1} />{" "}
                {applyItem?.name} afterwards.
              </li>
              {!isApproved ? (
                <li className="my-4">
                  A wallet prompt will ask for your permission to manage your Awoo Items. This is needed to burn the NFT
                  after applying.
                </li>
              ) : (
                ""
              )}
              <li className="my-4">
                A wallet prompt will ask for permission to apply the item to the selected PxlFangster.
              </li>
              <li className="my-4">
                PxlFangster <FormattedNumber>{selectedPxlFang?.tokenId}</FormattedNumber> will be upgraded to a Super
                PxlFangster.
              </li>
            </ol>
          </div>

          <div className="mt-4 flex justify-between">
            <div>
              <Button onClick={() => setStep(1)} color="cyan">
                <div className="flex flex-nowrap whitespace-nowrap">
                  <ArrowLeftIcon className="mr-2 h-8 w-8" />
                  Back
                </div>
              </Button>
            </div>
            <div>
              <Button
                onClick={processApply}
                disabled={
                  (approvalTransaction && !approvalTransactionResult) ||
                  applyMintedItemFunction?.isFetching ||
                  applyMintedItemFunction?.isLoading
                }
                color="green"
              >
                {(approvalTransaction && !approvalTransactionResult) ||
                applyMintedItemFunction?.isFetching ||
                applyMintedItemFunction?.isLoading ? (
                  <img className="mx-auto h-8 w-8 text-black" src={loading} alt="Loading" />
                ) : (
                  <>Apply {applyItem?.name}</>
                )}
              </Button>
            </div>
          </div>
          {errorMessage ? <p className="mt-4 text-red-light">{errorMessage}</p> : ""}
        </>
      )}
    </Modal>
  );
};
