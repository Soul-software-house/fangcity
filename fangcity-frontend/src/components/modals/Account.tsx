import React from "react";
import { useMoralis, useEnsAddress } from "react-moralis";

import { formatENSName, formatWalletAddress } from "../../utils";
import { useGlobalState } from "../../App";
import { Button } from "../Button";
import { Modal } from "../Modal";

export const Account = () => {
  const { user, isAuthenticated, logout } = useMoralis();
  const [, setModal] = useGlobalState("modal");
  const { name } = useEnsAddress(user?.get("ethAddress"));

  return (
    <Modal title="Account" modal="account">
      <div className="select-none rounded-xl border-[0.5vh] border-purple-dark bg-purple-light px-4 pb-2 pt-4">
        <p className="font-mono text-lg text-white md:text-2xl">
          {name ? (
            <>
              {formatENSName(name)}
              <span>.eth</span>
            </>
          ) : (
            <>
              <span>0x</span>
              {formatWalletAddress(user?.get("ethAddress"), 6)}
            </>
          )}
        </p>
      </div>

      <Button
        text="Logout"
        color="red"
        disabled={!isAuthenticated}
        onClick={() => {
          logout();
          setModal(null);
        }}
      />
    </Modal>
  );
};
