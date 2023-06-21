import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import Moralis from "moralis-v1";

import { Button } from "../Button";
import { DisclosureText } from "../DisclosureText";
import { Modal } from "../Modal";

import { useGlobalState } from "../../App";

import tshirt from "../../assets/images/tshirt.gif";

const COPIED_TEXT = "Copied!";

export const Shirt = () => {
  const { isWeb3Enabled, enableWeb3 } = useMoralis();
  const [, setErrorMessage] = useState(null);
  const [modal] = useGlobalState("modal");
  const [shirtClaim, setShirtClaim] = useState(null);
  const [shirtCode, setShirtCode] = useState("");

  useEffect(() => {
    if (modal === "shirt") {
      if (!isWeb3Enabled) {
        enableWeb3();
      } else {
        checkShirtClaim();
      }
    }
  }, [modal, isWeb3Enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (modal !== "shirt") {
      setErrorMessage(null);
    }
  }, [modal]); // eslint-disable-line react-hooks/exhaustive-deps

  const checkShirtClaim = async () => {
    try {
      const claim = await Moralis.Cloud.run("checkShirtClaim");
      setShirtClaim(claim);

      if (claim?.get("code")?.length) {
        setShirtCode(claim?.get("code"));
      } else {
        setShirtCode("");
      }
    } catch (_) {
      setShirtClaim(null);
      setShirtCode("");
    }
  };

  return (
    <Modal title="WLDFNGZ Classics T-Shirt" modal="shirt">
      <div
        className="mx-auto max-h-[min(50vh,400px)] max-w-[min(50vh,400px)] overflow-hidden border-purple-light bg-purple-light"
        style={{
          borderRadius: "min(7vh, 35%)",
          borderWidth: "0.5vh",
        }}
      >
        <img className="h-full w-full select-none border-purple-light bg-purple-light" src={tshirt} alt="T-Shirt" />
      </div>
      <div className="mt-8">
        <DisclosureText className="mx-2 text-left" color="white">
          <span className="mt-4 block">
            The OG WLDFNGZ t-shirt, worn by Fangsters. The first physical item claimable with $AWOO. History in the
            making, limited to 100pcs.
          </span>
          <span className="mt-4 block text-xl font-bold">The time to claim has ended.</span>
        </DisclosureText>
        {!!shirtClaim ? (
          <DisclosureText className="text-left text-xl" color="white mt-4">
            Congrats on claiming your WLDFNGZ Classic T-Shirt!<span className="block">Your discount code is:</span>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(shirtClaim?.get("code"));
                const code = shirtClaim?.get("code");
                setShirtCode(COPIED_TEXT);
                setTimeout(() => setShirtCode(code), 1_500);
              }}
              standalone
              color="green"
              className="mx-auto mt-8 block select-auto"
              disabled={shirtCode === COPIED_TEXT}
            >
              {shirtCode}
            </Button>
          </DisclosureText>
        ) : null}
      </div>
    </Modal>
  );
};
