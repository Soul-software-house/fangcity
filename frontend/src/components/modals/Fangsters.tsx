import React from "react";
import { motion } from "framer-motion";
import Moralis from "moralis-v1";
import { useMoralis } from "react-moralis";

import { useGlobalState } from "../../App";
import { COLORS } from "../Fangster";
import { Modal } from "../Modal";

export const Fangsters = () => {
  const { isAuthenticated, refetchUserData } = useMoralis();
  const [userFangsters] = useGlobalState("userFangsters");
  const [, setCurrentFangster] = useGlobalState("currentFangster");

  const selectFangster = async (fangsterId: number, event: React.FormEvent) => {
    await setCurrentFangster(userFangsters.find(f => Number(f.get("tokenId")) === Number(fangsterId)));
    await updateUser(event, fangsterId);
  };

  const updateUser = async (event: React.FormEvent, fangsterId = null) => {
    event.preventDefault();

    try {
      await Moralis.Cloud.run("updateCurrentFangster", { tokenId: fangsterId.toString() });
      if (isAuthenticated) {
        await refetchUserData();
      }
    } catch (e) {
      console.log("Could not update current Fangster", e);
    }
  };

  return (
    <Modal title="Select Your Fangster" modal="fangsters">
      <div className="-mx-2 mt-2 flex flex-row flex-wrap items-center justify-between">
        {!userFangsters.length ? (
          <h3 className="text-xl font-bold leading-6 text-white">
            No Fangsters found. Check out the{" "}
            <a
              className="border-b-2 border-purple-light hover:border-white"
              href="https://opensea.io/collection/fanggangnft"
            >
              Fang Gang
            </a>{" "}
            collection on OpenSea to join the gang!
          </h3>
        ) : (
          <>
            {userFangsters.map(fangster => (
              <motion.img
                key={fangster?.get("tokenId")}
                className={`m-2 inline-block h-[max(6vh,5rem)] w-[max(6vh,5rem)] select-none rounded-[min(7vh,35%)] border-[max(0.5vh,0.25rem)] md:h-[max(8vh,5rem)] md:w-[max(8vh,5rem)]
                        ${`border-${COLORS[fangster?.get("background")] || "black"} bg-${
                          COLORS[fangster?.get("background")] || "black"
                        }`}`}
                style={{
                  boxShadow: "-6px 4px 1px rgba(0, 0, 0, 0.15)",
                }}
                src={fangster?.get("image")}
                alt={fangster?.get("name")}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "-7px 5px 1px rgba(0, 0, 0, 0.15)",
                }}
                whileTap={{
                  scale: 0.95,
                  boxShadow: "-3px 2px 1px rgba(0, 0, 0, 0.15)",
                }}
                onClick={e => selectFangster(fangster?.get("tokenId"), e)}
              />
            ))}
          </>
        )}
      </div>
    </Modal>
  );
};
