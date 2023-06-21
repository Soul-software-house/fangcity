import React, { useEffect, useState } from "react";
import useInterval from "@jdthornton/useinterval";

import { useGlobalState } from "../../App";
import { Modal } from "../Modal";
import { Button } from "../Button";

import awoo from "../../assets/images/awoo.gif";
import success from "../../assets/images/success.png";
import failure from "../../assets/images/failure.png";

const { REACT_APP_CHAIN, REACT_APP_SPEEDY_NODE_URL } = process.env;

export const Transaction = () => {
  const [transaction, setTransaction] = useGlobalState("transaction");
  const [transactionMessage, setTransactionMessage] = useGlobalState("transactionMessage");
  const [transactionResult, setTransactionResult] = useState(null);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("cyan");

  useInterval(
    async () => {
      const payload = {
        jsonrpc: "2.0",
        method: "eth_getTransactionReceipt",
        params: [transaction],
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
      setTransactionResult(responseJson?.result?.status);
    },
    transaction?.length && !transactionResult ? 5_000 : null
  );

  useEffect(() => {
    if (transactionResult === "0x1") {
      setTitle("Transaction Successful");
      setImage(success);
      setMessage(
        transactionMessage || "The transaction was successful and should be reflected in your balances shortly."
      );
      setColor("green");
    } else if (transactionResult) {
      setTitle("Transaction Failed");
      setImage(failure);
      setMessage("Check the transaction and try again.");
      setColor("red");
    } else {
      setTitle("Processing Transaction");
      setImage(awoo);
      setMessage("Take a moment to sharpen your fangs.");
      setColor("cyan");
    }
  }, [transactionResult, transactionMessage]);

  return (
    <Modal
      modal="transaction"
      title={title}
      onClose={() => {
        setTransaction(null);
        setTransactionResult(null);
        setTransactionMessage("");
      }}
    >
      <div className="flex flex-col justify-center px-8">
        <img alt="" src={image} className="mx-auto mb-12 h-1/2 w-1/2 md:h-2/5 md:w-2/5" />
        <p className="text-lg text-white">{message}</p>
        <Button
          color={color}
          text="View on Etherscan"
          onClick={() =>
            window.open(
              `https://${REACT_APP_CHAIN === "rinkeby" ? "rinkeby." : ""}etherscan.io/tx/${transaction}`,
              "_blank",
              "noopener,noreferrer"
            )
          }
        />
      </div>
    </Modal>
  );
};
