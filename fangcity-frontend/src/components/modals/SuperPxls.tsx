import React, { useEffect, useState } from "react";
import useInterval from "@jdthornton/useinterval";
import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon, ArrowRightIcon, ArrowLeftIcon, PlusIcon, MinusIcon } from "@heroicons/react/solid";
import { motion } from "framer-motion";
import Moralis from "moralis-v1";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";

import { useGlobalState } from "../../App";
import { COLORS } from "../Fangster";
import { Button } from "../Button";
import { DisclosureText } from "../DisclosureText";
import { FormattedNumber } from "../FormattedNumber";
import { ClaimSelection } from "../ClaimSelection";
import { Modal } from "../Modal";

import loading from "../../assets/images/loading.svg";
import chips from "../../assets/images/chips.gif";

import * as storeContract from "../../contracts/store";
import * as oldStoreContract from "../../contracts/store-old";
import { ERROR_MESSAGES } from "../../utils";

const ethers = Moralis.web3Library;

const { REACT_APP_CHAIN, REACT_APP_FANGGANG_CONTRACT_ADDRESS, REACT_APP_PXLFANGS_CONTRACT_ADDRESS } = process.env;
export const UPGRADE_COST = REACT_APP_CHAIN === "rinkeby" ? 10_000 : 40_000;
export const COLLECTION_ID = 1;
export const ITEM_ID = 1;
const TOTAL_SUPPLY = 8888;

const purchaseTypes = [
  { id: 1, title: "Mint as NFT", description: "Use later or sell on secondary" },
  { id: 2, title: "Apply to PxlFangster", description: "Buy and use in one transaction" },
];

const title = {
  0: "Insufficient $AWOO",
  1: "Super PxlChip",
  2: "Choose PxlFangster",
  3: "Choose Claims",
  4: "Summary",
  null: "Super PxlChip",
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export const SuperPxls = () => {
  const { user, isAuthenticated, isWeb3Enabled, enableWeb3 } = useMoralis();
  const [modal] = useGlobalState("modal");
  const [userPxlFangsters] = useGlobalState("userPxlFangsters");
  const [nfcBalance] = useGlobalState("nfcBalance");
  const [unclaimedBalance] = useGlobalState("unclaimedBalance");
  const [pxlFangsters, setPxlFangsters] = useState([]);
  const [purchaseType, setPurchaseType] = useState(null);
  const [selectedPxlFangs, setSelectedPxlFangs] = useState(new Set());
  const [ready, setReady] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [amount, setAmount] = useState(null);
  const [claimSelected, setClaimSelected] = useState([]);
  const [claimTotal, setClaimTotal] = useState(0);
  const [claimAmountNeeded, setClaimAmountNeeded] = useState(0);
  const [step, setStep] = useState(null);
  const [, setTransaction] = useGlobalState("transaction");
  const [, setTransactionMessage] = useGlobalState("transactionMessage");
  const [, setModal] = useGlobalState("modal");
  const [errorMessage, setErrorMessage] = useState(null);
  const [upgraded, setUpgraded] = useState({});
  const [upgradedNew, setUpgradedNew] = useState({});
  const [upgradedOld, setUpgradedOld] = useState({});
  const [chipsAvailable, setChipsAvailable] = useState(0);

  const mintWithAwooFunction = useWeb3ExecuteFunction({
    contractAddress: storeContract.contractAddress,
    functionName: "mintWithAwoo",
    abi: storeContract.abi,
    params: {},
  });

  const purchaseAndApplyWithAwooFunction = useWeb3ExecuteFunction({
    contractAddress: storeContract.contractAddress,
    functionName: "purchaseAndApplyWithAwoo",
    abi: storeContract.abi,
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

  const availableQtyFunction = useWeb3ExecuteFunction({
    contractAddress: storeContract.contractAddress,
    functionName: "availableQty",
    abi: storeContract.abi,
    params: {},
  });

  useInterval(
    () => availableQtyFunction.fetch({ params: { params: { itemId: ITEM_ID } } }),
    isAuthenticated ? 30_000 : null
  );

  // Make sure Web3 is enabled before running the functions
  //
  useEffect(() => {
    if (!isWeb3Enabled) {
      enableWeb3();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (modal !== "superpxl") {
      setPurchaseType(null);
      setSelectedPxlFangs(new Set());
      setReady(false);
      setTotalCost(0);
      setAmount(null);
      setClaimSelected([]);
      setClaimTotal(0);
      setStep(null);
      setErrorMessage(null);
    } else {
      availableQtyFunction.fetch({ params: { params: { itemId: ITEM_ID } } });
    }
  }, [modal]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isAuthenticated) {
      if (nfcBalance + unclaimedBalance < UPGRADE_COST) {
        setStep(0);
      } else {
        setStep(step || 1);
      }
    } else {
      setStep(null);
    }
  }, [isAuthenticated, step, nfcBalance, unclaimedBalance]);

  useEffect(() => {
    setSelectedPxlFangs(new Set());
  }, [purchaseType]);

  useEffect(() => {
    setClaimTotal(claimSelected.reduce((acc, s) => Number(acc) + Number(s.amount), 0));
  }, [claimSelected]);

  useEffect(() => {
    setReady(totalCost > 0 && nfcBalance + claimTotal >= totalCost && !(purchaseType === 2 && !selectedPxlFangs));
  }, [purchaseType, selectedPxlFangs, nfcBalance, totalCost, claimTotal]);

  useEffect(() => {
    setPxlFangsters(
      userPxlFangsters.map(f => ({
        background: f?.get("background"),
        id: f.id,
        image: f?.get("image"),
        name: f?.get("name"),
        tokenId: f?.get("tokenId"),
        super: f?.get("super"),
        cost: UPGRADE_COST,
      }))
    );
  }, [userPxlFangsters]);

  useEffect(() => {
    setTotalCost(amount * UPGRADE_COST);
  }, [amount]);
  useEffect(() => {
    setClaimAmountNeeded(nfcBalance + claimTotal - totalCost);
  }, [totalCost, nfcBalance, claimTotal]);

  const processPurchase = async () => {
    const web3Provider = await Moralis.enableWeb3();
    const signer = web3Provider.getSigner();

    const checksummedAddress = ethers.utils.getAddress(user?.get("ethAddress"));
    const message = `As the owner of Ethereum address\r\n${checksummedAddress}\r\nI authorize the spending of ${totalCost} virtual $AWOO`;
    const hash = ethers.utils.hashMessage(message);
    let sig = await signer.signMessage(message);

    // adding a fix for ledgers:
    // https://ethereum.stackexchange.com/questions/103307/cannot-verifiy-a-signature-produced-by-ledger-in-solidity-using-ecrecover
    if (sig.slice(-2) === "01") {
      sig = sig.slice(0, -2) + "1C";
    } else if (sig.slice(-2) === "00") {
      sig = sig.slice(0, -2) + "1B";
    }

    const pxlClaims = claimSelected.filter(c => c.collection === "pxlFangster").map(c => c.tokenId);
    const fangClaims = claimSelected.filter(c => c.collection === "fangster").map(c => c.tokenId);

    let requestedClaims = [];
    if (pxlClaims.length) {
      requestedClaims.push({
        ContractAddress: REACT_APP_PXLFANGS_CONTRACT_ADDRESS,
        TokenIds: pxlClaims,
      });
    }
    if (fangClaims.length) {
      requestedClaims.push({
        ContractAddress: REACT_APP_FANGGANG_CONTRACT_ADDRESS,
        TokenIds: fangClaims,
      });
    }

    if (purchaseType === 1) {
      mintWithAwooFunction.fetch({
        params: {
          params: {
            itemId: ITEM_ID,
            qty: amount,
            approval: { Nonce: Math.floor(Math.random() * 10000000).toString(), Hash: hash, Sig: sig },
            requestedClaims,
          },
        },
      });
    } else if (purchaseType === 2) {
      const params = {
        itemId: ITEM_ID,
        applicationTokenIds: Array.from(selectedPxlFangs),
        approval: { Nonce: Math.floor(Math.random() * 10000000).toString(), Hash: hash, Sig: sig },
        requestedClaims,
      };
      await purchaseAndApplyWithAwooFunction.fetch({
        params: {
          params,
        },
      });
    }
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (mintWithAwooFunction?.error) {
      Object.keys(ERROR_MESSAGES).forEach(em => {
        if (mintWithAwooFunction?.error?.message?.includes(em)) {
          setErrorMessage(em);
        }
      });
    }
    if (mintWithAwooFunction?.data && !mintWithAwooFunction?.isFetching && !mintWithAwooFunction?.isLoading) {
      setTransaction(mintWithAwooFunction.data["hash"]);
      setTransactionMessage(`You bought ${amount} Super PxlChip${amount > 1 ? "s" : ""} for ${totalCost} $AWOO!`);
      setModal("transaction");
    }
  }, [mintWithAwooFunction.data, mintWithAwooFunction.isFetching, mintWithAwooFunction.isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (purchaseAndApplyWithAwooFunction?.error) {
      Object.keys(ERROR_MESSAGES).forEach(em => {
        if (purchaseAndApplyWithAwooFunction?.error?.message?.includes(em)) {
          setErrorMessage(ERROR_MESSAGES[em]);
        }
      });
    }
    if (
      purchaseAndApplyWithAwooFunction?.data &&
      !purchaseAndApplyWithAwooFunction?.isFetching &&
      !purchaseAndApplyWithAwooFunction?.isLoading
    ) {
      setTransaction(purchaseAndApplyWithAwooFunction.data["hash"]);
      setTransactionMessage(
        `You applied Super PxlChip${amount > 1 ? "s" : ""} to ${amount} PxlFangsters for ${totalCost} $AWOO!`
      );
      setModal("transaction");
    }
  }, [
    purchaseAndApplyWithAwooFunction.data,
    purchaseAndApplyWithAwooFunction.isFetching,
    purchaseAndApplyWithAwooFunction.isLoading,
  ]);

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
    if (step === 2) {
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
  }, [step === 2]);

  useEffect(() => {
    if (availableQtyFunction?.data && !availableQtyFunction?.isFetching && !availableQtyFunction?.isLoading) {
      setChipsAvailable(Number(availableQtyFunction?.data));
    }
  }, [availableQtyFunction.data, availableQtyFunction.isFetching, availableQtyFunction.isLoading]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <Modal title={title[step]} modal="superpxl">
      <div
        className="mx-auto max-h-[min(50vh,400px)] max-w-[min(50vh,400px)] overflow-hidden border-purple-light bg-purple-light"
        style={{
          borderRadius: "min(7vh, 35%)",
          borderWidth: "0.5vh",
        }}
      >
        <img
          className="h-full w-full select-none border-purple-light bg-purple-light"
          src={chips}
          alt="SuperPxl Chip"
        />
      </div>

      <p className="my-8 text-center text-xl font-bold text-white">
        Super PxlChips Available
        <span className={`mt-2 block text-2xl text-${chipsAvailable > 1 ? "green-light" : "red-light"}`}>
          <FormattedNumber
            color={`${chipsAvailable > 1 ? "green-light" : "red-light"}`}
            size="2xl"
            value={chipsAvailable}
          />{" "}
          /{" "}
          <FormattedNumber
            color={`${chipsAvailable > 1 ? "green-light" : "red-light"}`}
            size="2xl"
            value={TOTAL_SUPPLY}
          />
        </span>
      </p>

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
            <p className="mb-8 text-center text-lg font-bold text-white">
              $AWOO Balance
              <span className="mt-2 block text-2xl text-red-light">
                <FormattedNumber color="red-light" size="2xl" value={nfcBalance + unclaimedBalance} /> /{" "}
                <FormattedNumber color="red-light" size="2xl" value={UPGRADE_COST} />
              </span>
            </p>
            <span className="font-bold">It looks like you don't have enough $AWOO for a Super PxlChip.</span> Each Super
            PxlChip costs <FormattedNumber value={UPGRADE_COST} />. They are consumable ERC-1155 NFTs that can be used
            to upgrade PxlFangsters into Super PxlFangsters with higher levels of detail and enhanced functionality
            including higher per day $AWOO earning, upgraded Webb3 mechs, and more.
          </DisclosureText>
        </div>
      )}

      {step === 1 && (
        <>
          <div className="relative mt-8">
            <h3 className="ml-1 mr-2 flex justify-between text-left text-xl font-bold leading-6 text-white">
              Number of Super PxlChips
            </h3>

            <div className="flex justify-between">
              <Button
                standalone
                className="mt-2 mr-4"
                onClick={() => setAmount(amount > 1 ? amount - 1 : 0)}
                color="cyan"
                disabled={amount < 1}
              >
                <div className="mt-2 flex flex-nowrap whitespace-nowrap">
                  <MinusIcon className="mb-1 h-8 w-8" />
                </div>
              </Button>
              <input
                id="amount"
                name="amount"
                value={amount || ""}
                pattern="[0-9]*"
                placeholder="0"
                onChange={e => {
                  let a = Number(e?.target?.value) || 0;
                  a = a < 0 ? 0 : a;
                  a = a > chipsAvailable ? chipsAvailable : a;
                  a = a * UPGRADE_COST > nfcBalance + unclaimedBalance ? amount : a;

                  setAmount(a);
                }}
                className="mt-2 w-full appearance-none rounded-xl border-[0.5vh] border-purple-dark bg-purple-light pb-2 pt-4 text-center font-mono text-lg text-white placeholder-white focus:border-purple-dark focus:outline-none focus:ring-2 focus:ring-purple-light md:text-2xl"
              />
              <Button
                standalone
                className="mt-2 ml-4"
                onClick={() => setAmount(amount * UPGRADE_COST > nfcBalance + unclaimedBalance ? amount : amount + 1)}
                color="cyan"
                disabled={(amount + 1) * UPGRADE_COST > nfcBalance + unclaimedBalance}
              >
                <div className="flex flex-nowrap whitespace-nowrap">
                  <PlusIcon className="h-8 w-8" />
                </div>
              </Button>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="ml-1 mr-2 flex justify-between text-left text-xl font-bold leading-6 text-white">
              Type of Purchase
            </h3>
            <RadioGroup value={purchaseType} onChange={setPurchaseType}>
              <div className="mt-2 grid grid-cols-1 gap-y-6 text-left sm:grid-cols-2 sm:gap-x-4">
                {purchaseTypes.map(pType => (
                  <RadioGroup.Option
                    key={pType.id}
                    value={pType.id}
                    className={({ checked, active }) =>
                      classNames(
                        active || checked ? "ring-2 ring-purple-light" : "",
                        "relative flex cursor-pointer rounded-xl border-[0.5vh] border-purple-dark bg-purple-light p-4 px-4 py-[0.7rem] focus:outline-none"
                      )
                    }
                  >
                    {({ checked, active }) => (
                      <div className="flex w-full justify-between">
                        <div className="flex flex-col">
                          <RadioGroup.Label as="span" className="block font-medium text-white">
                            {pType.title}
                          </RadioGroup.Label>
                          <RadioGroup.Description as="span" className="mt-1 flex items-center text-sm text-white">
                            {pType.description}
                          </RadioGroup.Description>
                        </div>
                        <CheckCircleIcon
                          className={classNames(!checked ? "invisible" : "", "h-8 w-8 text-white")}
                          aria-hidden="true"
                        />
                        <div
                          className={classNames(
                            active || checked ? "border-purple-dark" : "border-transparent",
                            "pointer-events-none absolute -inset-px"
                          )}
                          aria-hidden="true"
                        />
                      </div>
                    )}
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="mt-4 flex justify-end">
            <div>
              <Button
                onClick={() => setStep(purchaseType === 1 ? (totalCost > nfcBalance ? 3 : 4) : 2)}
                color="green"
                disabled={!(purchaseType && amount > 0)}
              >
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
          <div className="mt-12">
            <h3 className="ml-1 mr-2 flex justify-between text-left text-xl font-bold leading-6 text-white">
              {`Choose PxlFangster${amount > 1 ? "s" : ""} To Upgrade`}
            </h3>

            <DisclosureText className="mx-1 mt-2 mb-8 text-left">
              When minting and applying your Super PxlChips in the same transaction, you must select which PxlFangsters
              to apply your Super PxlChips to.
            </DisclosureText>

            <div className="-mx-2 mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-4 md:grid-cols-4">
              {pxlFangsters.map(pxlFangster => (
                <label className="m-2" key={pxlFangster?.id} htmlFor={`pxlFangster-${pxlFangster?.id}`}>
                  <motion.div
                    className={`bg-${COLORS[pxlFangster.background] || "black"} border-${
                      COLORS[pxlFangster.background] || "black"
                    } ${selectedPxlFangs?.has(pxlFangster?.tokenId) ? "" : "saturate-0"} ${
                      upgraded[pxlFangster?.tokenId] || selectedPxlFangs?.size === amount ? "cursor-not-allowed" : ""
                    } overflow-hidden rounded-[min(7vh,35%)] border-[max(0.5vh,0.25rem)]`}
                    style={{
                      boxShadow: "-6px 4px 1px rgba(0, 0, 0, 0.15)",
                    }}
                    whileHover={
                      selectedPxlFangs?.size <= amount &&
                      !upgraded[pxlFangster?.tokenId] && {
                        scale: 1.05,
                        boxShadow: "-7px 5px 1px rgba(0, 0, 0, 0.15)",
                      }
                    }
                    whileTap={
                      selectedPxlFangs?.size <= amount &&
                      !upgraded[pxlFangster?.tokenId] && {
                        scale: 0.95,
                        boxShadow: "-3px 2px 1px rgba(0, 0, 0, 0.15)",
                      }
                    }
                  >
                    <img
                      key={pxlFangster.tokenId}
                      className={`h-full w-full cursor-pointer select-none ${
                        upgraded[pxlFangster?.tokenId] || selectedPxlFangs?.size === amount ? "cursor-not-allowed" : ""
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
                    checked={selectedPxlFangs?.has(pxlFangster?.tokenId)}
                    onClick={() =>
                      selectedPxlFangs?.size < amount &&
                      !selectedPxlFangs?.has(pxlFangster?.tokenId) &&
                      !upgraded[pxlFangster?.tokenId]
                        ? setSelectedPxlFangs(prev => new Set(prev.add(pxlFangster?.tokenId)))
                        : setSelectedPxlFangs((prev: any) => new Set([...prev].filter(x => x !== pxlFangster?.tokenId)))
                    }
                    onChange={() => false}
                    className="hidden h-4 w-4 rounded border-gray-300"
                  />
                </label>
              ))}
            </div>
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
                onClick={() => setStep(totalCost > nfcBalance ? 3 : 4)}
                color="green"
                disabled={!(purchaseType && amount > 0 && selectedPxlFangs?.size === amount)}
              >
                <div className="flex flex-nowrap whitespace-nowrap">
                  Next
                  <ArrowRightIcon className="ml-2 h-8 w-8" />
                </div>
              </Button>
            </div>
          </div>
        </>
      )}

      {step === 3 ? (
        <>
          <div className="relative mt-12">
            <h3 className="ml-1 mr-2 flex justify-between text-left text-xl font-bold leading-6 text-white">
              Choose which NFTs to Claim $AWOO From
            </h3>
            <DisclosureText className="mx-1 mt-2 mb-8 text-left">
              You've chosen to purchase <FormattedNumber value={amount} /> Super PxlChip
              {amount > 1 ? "s" : ""} for <FormattedNumber value={totalCost} /> $AWOO but you only have{" "}
              <FormattedNumber value={nfcBalance} /> $AWOO available in your NFC Wallet. Please select which Fangsters
              and PxlFangsters you'd like to claim the remaining balance from.
            </DisclosureText>
            <p className="mt-8 text-center text-lg font-bold text-white">
              Claim Balance
              <FormattedNumber
                size="2xl"
                color={claimAmountNeeded < 0 ? "red-light" : "green-light"}
                value={claimAmountNeeded}
                className="block"
              />
            </p>
            <ClaimSelection onSelect={selected => setClaimSelected(selected)} />
          </div>

          <div className="mt-4 flex justify-between">
            <div>
              <Button onClick={() => setStep(purchaseType === 1 ? 1 : 2)} color="cyan">
                <div className="flex flex-nowrap whitespace-nowrap">
                  <ArrowLeftIcon className="mr-2 h-8 w-8" />
                  Back
                </div>
              </Button>
            </div>
            <div>
              <Button onClick={() => setStep(4)} color="green" disabled={!(nfcBalance + claimTotal >= totalCost)}>
                <div className="flex flex-nowrap whitespace-nowrap">
                  Next
                  <ArrowRightIcon className="ml-2 h-8 w-8" />
                </div>
              </Button>
            </div>
          </div>
        </>
      ) : null}

      {step === 4 && (
        <>
          <div className="relative mt-12">
            <h3 className="ml-1 mr-2 flex justify-between text-left text-xl font-bold leading-6 text-white">
              Awoo! Here's what's going to happen…
            </h3>

            <ol className="ml-6 mr-2 list-decimal text-left text-lg text-white">
              <li className="my-4">
                You are purchasing <FormattedNumber value={amount} /> Super PxlChip
                {amount > 1 ? "s" : ""} for <FormattedNumber value={totalCost} /> $AWOO.
              </li>
              {claimSelected.length ? (
                <li className="my-4">
                  A total of <FormattedNumber value={claimTotal} /> $AWOO will be claimed from{" "}
                  <FormattedNumber value={claimSelected.length} /> Fangsters and/or PxlFangsters.
                </li>
              ) : null}
              <li className="my-4">
                A balance of <FormattedNumber value={totalCost} /> $AWOO will be deducted from your NFC Wallet.
              </li>
              <li>
                {purchaseType === 1 ? (
                  <p className="my-4">
                    A total of <FormattedNumber value={amount} /> Super PxlChip{amount > 1 ? "s" : ""} will be minted to
                    your wallet <span className="font-mono text-sm text-cyan-light">{user?.get("ethAddress")}</span>.
                  </p>
                ) : (
                  <>
                    <p className="my-4">
                      A total of <FormattedNumber value={amount} /> Super PxlChip{amount > 1 ? "s" : ""} will be
                      purchased and applied to the {amount > 1 ? "PxlFangsters" : "PxlFangster"} below.
                    </p>
                  </>
                )}
              </li>
              <li>
                A wallet prompt will ask you to sign a message confirming authorization to spend{" "}
                <FormattedNumber value={totalCost} /> $AWOO prior to approving the transaction.
              </li>
              {Array.from(selectedPxlFangs)?.length ? (
                <div className="-ml-8 -mr-4 mt-8 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-4 md:grid-cols-4">
                  {pxlFangsters
                    .filter(f => Array.from(selectedPxlFangs).includes(f.tokenId))
                    .map(pxlFangster => (
                      <div
                        key={pxlFangster.tokenId}
                        className={`bg-${COLORS[pxlFangster.background] || "black"} border-${
                          COLORS[pxlFangster.background] || "black"
                        }  m-2 overflow-hidden rounded-[min(7vh,35%)] border-[max(0.5vh,0.25rem)]`}
                        style={{
                          boxShadow: "-6px 4px 1px rgba(0, 0, 0, 0.15)",
                        }}
                      >
                        <img
                          key={pxlFangster.tokenId}
                          className="h-full w-full select-none"
                          src={pxlFangster.image}
                          alt={pxlFangster.name}
                        />
                      </div>
                    ))}
                </div>
              ) : (
                <></>
              )}
            </ol>
          </div>

          <div className="mt-4 flex justify-between">
            <div>
              <Button onClick={() => setStep(totalCost > nfcBalance ? 3 : purchaseType === 1 ? 1 : 2)} color="cyan">
                <div className="flex flex-nowrap whitespace-nowrap">
                  <ArrowLeftIcon className="mr-2 h-8 w-8" />
                  Back
                </div>
              </Button>
            </div>
            <div>
              <Button onClick={processPurchase} color="green" disabled={!ready}>
                {false ? (
                  <img className="mx-auto h-8 w-8 text-black" src={loading} alt="Loading" />
                ) : (
                  `${purchaseType === 1 ? "Mint" : "Apply"} ${amount > 0 ? amount : ""} Super PxlChip${
                    amount > 1 ? "s" : ""
                  }`
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
