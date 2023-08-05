import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Moralis from "moralis-v1";
import { useWeb3ExecuteFunction } from "react-moralis";
import numeral from "numeral";

import loading from "../../assets/images/loading.svg";
import { useGlobalState } from "../../App";
import { Button } from "../Button";
import { DisclosureText } from "../DisclosureText";
import { Modal } from "../Modal";

import * as awooContract from "../../contracts/awoo";

numeral.nullFormat("---");

export const Vault = () => {
  const [nfcBalance] = useGlobalState("nfcBalance");
  const [erc20Balance] = useGlobalState("erc20Balance");
  const [, setModal] = useGlobalState("modal");
  const [, setTransaction] = useGlobalState("transaction");
  const [, setTransactionMessage] = useGlobalState("transactionMessage");
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);

  // Withdraw
  //
  const withdrawFunction = useWeb3ExecuteFunction({
    contractAddress: awooContract.contractAddress,
    functionName: "withdraw",
    abi: awooContract.abi,
    params: {},
  });

  const submitWithdraw = async () => {
    withdrawFunction.fetch({ params: { params: { amount: Moralis.Units.Token(withdrawAmount, 18) } } });
  };

  useEffect(() => {
    if (withdrawFunction?.data && !withdrawFunction?.isFetching && !withdrawFunction?.isLoading) {
      setWithdrawAmount(0);
      setTransaction(withdrawFunction.data["hash"]);
      setTransactionMessage(
        "Your $AWOO withdrawal was successful and will be reflected in your ERC-20 Wallet balance shortly."
      );
      setModal("transaction");
    }
  }, [withdrawFunction.data, withdrawFunction.isFetching, withdrawFunction.isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Deposit
  //
  const depositFunction = useWeb3ExecuteFunction({
    contractAddress: awooContract.contractAddress,
    functionName: "deposit",
    abi: awooContract.abi,
    params: {},
  });

  const submitDeposit = async () => {
    depositFunction.fetch({ params: { params: { amount: Moralis.Units.Token(depositAmount, 18) } } });
  };

  useEffect(() => {
    if (depositFunction?.data && !depositFunction?.isFetching && !depositFunction?.isLoading) {
      setDepositAmount(0);
      setTransaction(depositFunction.data["hash"]);
      setTransactionMessage(
        "Your $AWOO deposit was successful and will be reflected in your NFC Wallet balance shortly."
      );
      setModal("transaction");
    }
  }, [depositFunction.data, depositFunction.isFetching, depositFunction.isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Modal title="Vault" modal="vault">
      <label htmlFor="deposit" className="ml-2 block text-left text-lg text-white">
        ERC-20 Wallet Balance:
        <span className="ml-2 font-mono text-xs">
          {erc20Balance < 1 ? erc20Balance : numeral(erc20Balance).format("0,0.[00]")}
        </span>
      </label>

      <div className="relative mt-1">
        <motion.p
          className="absolute inset-y-0 left-0 ml-6 mt-[0.35rem] flex cursor-pointer items-center font-mono text-white"
          onClick={() => setDepositAmount(erc20Balance)}
          whileTap={{
            scale: 0.95,
          }}
        >
          MAX
        </motion.p>
        <input
          id="deposit"
          name="deposit"
          type="number"
          value={depositAmount || ""}
          placeholder="0"
          onChange={e => {
            setDepositAmount(
              Number(e?.target?.value) > erc20Balance ? depositAmount : Number(Number(e?.target?.value || 0).toFixed(2))
            );
          }}
          className="focus:ring-border-purple-dark block w-full appearance-none rounded-xl border-[0.5vh] border-purple-dark bg-purple-light pl-[4.5rem] pr-4 pb-2 pt-4 text-right font-mono text-lg text-white placeholder-white focus:border-purple-dark focus:outline-none md:text-2xl"
        />
      </div>

      <div className="flex justify-center">
        <Button
          onClick={submitDeposit}
          disabled={Number(depositAmount) <= 0 || depositFunction.isFetching || depositFunction.isLoading}
          color="green"
        >
          {depositFunction.isFetching || depositFunction.isLoading ? (
            <img className="mx-auto h-8 w-8 text-black" src={loading} alt="Loading" />
          ) : (
            "Deposit to NFC Wallet"
          )}
        </Button>
      </div>

      <hr className="mx-4 my-12 h-[max(0.55vh,3px)] rounded-xxl border-slate-300 bg-slate-300 md:my-16" />

      <label htmlFor="withdraw" className="ml-2 block text-left text-lg text-white">
        NFC Wallet Balance:
        <span className="ml-2 font-mono text-xs">
          {nfcBalance < 1 ? nfcBalance : numeral(nfcBalance).format("0,0.[00]")}
        </span>
      </label>

      <div className="relative mt-1">
        <motion.p
          className="absolute inset-y-0 left-0 ml-6 mt-[0.35rem] flex cursor-pointer items-center font-mono text-white"
          onClick={() => setWithdrawAmount(nfcBalance)}
          whileTap={{
            scale: 0.95,
          }}
        >
          MAX
        </motion.p>
        <input
          id="withdraw"
          name="withdraw"
          type="number"
          value={withdrawAmount || ""}
          placeholder="0"
          onChange={e => {
            setWithdrawAmount(
              Number(e?.target?.value) > nfcBalance ? withdrawAmount : Number(Number(e?.target?.value || 0).toFixed(2))
            );
          }}
          className="focus:ring-border-purple-dark block w-full appearance-none rounded-xl border-[0.5vh] border-purple-dark bg-purple-light pl-[4.5rem] pr-4 pb-2 pt-4 text-right font-mono text-lg text-white placeholder-white focus:border-purple-dark focus:outline-none md:text-2xl"
        />
      </div>

      <div className="flex justify-center">
        <Button
          onClick={submitWithdraw}
          disabled={Number(withdrawAmount) <= 0 || withdrawFunction.isFetching || withdrawFunction.isLoading}
          color="red"
        >
          {withdrawFunction.isFetching || withdrawFunction.isLoading ? (
            <img className="mx-auto h-8 w-8 text-black" src={loading} alt="Loading" />
          ) : (
            "Withdraw to ERC-20 Wallet"
          )}
        </Button>
      </div>

      <DisclosureText className="mx-2">
        $AWOO is not a security — it was created to be used solely within the Awoo Studios ecosystem. It will not be
        purchasable on any platform related to Awoo Studios. No secondary marketplace will be provided for it.
      </DisclosureText>
    </Modal>
  );
};
