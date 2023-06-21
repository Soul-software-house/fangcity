import React, { useEffect } from "react";
import Moralis from "moralis-v1";
import { useMoralis, useChain } from "react-moralis";
import { motion } from "framer-motion";
import { LightningBoltIcon } from "@heroicons/react/outline";

import { useGlobalState } from "../../App";
import { DisclosureText } from "../DisclosureText";
import { Modal } from "../Modal";

const { REACT_APP_CHAIN, REACT_APP_COLLECTION_CONTRACT_ADDRESS, REACT_APP_OPENSEA_COLLECTION } = process.env;

export const Inventory = () => {
  const [modal, setModal] = useGlobalState("modal");
  const [, setApplyItem] = useGlobalState("applyItem");
  const [collectionItems, setCollectionItems] = useGlobalState("collectionItems");
  const { user, isAuthenticated } = useMoralis();
  const { chainId } = useChain();

  const fetchItems = async () => {
    try {
      const nfts = await Moralis.Web3API.account.getNFTsForContract({
        chain: REACT_APP_CHAIN === "rinkeby" ? "rinkeby" : "eth",
        address: user?.get("ethAddress"),
        token_address: REACT_APP_COLLECTION_CONTRACT_ADDRESS,
      });

      const i = [];
      nfts?.result?.forEach(r => {
        for (let x = 0; x < Number(r?.amount); x++) {
          const m = JSON.parse(r.metadata);
          const metadata = {
            ...m,
            ...{ tokenId: r.token_id, image: m?.image?.replace("ipfs://", "https://fanggang.mypinata.cloud/ipfs/") },
          };
          i.push(metadata);
        }
      });
      setCollectionItems(i);
    } catch (_) {
      setCollectionItems([]);
    }
  };

  useEffect(() => {
    if (modal === "inventory") {
      fetchItems();
    } else {
      setCollectionItems([]);
    }
  }, [modal]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isAuthenticated) {
      fetchItems();
    } else {
      setCollectionItems([]);
    }
  }, [isAuthenticated, user, chainId]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectItem = async itemId => {
    setModal("apply-item");
    setApplyItem(collectionItems.find(i => i.tokenId === itemId));
  };

  return (
    <Modal title="Inventory" modal="inventory">
      {collectionItems?.length > 0 ? (
        <div className="-mx-2 mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-4 md:grid-cols-4">
          {collectionItems.map((item, index) => (
            <label className="group m-2 cursor-pointer" key={index} htmlFor={`item-${index}`}>
              <motion.div
                className="relative overflow-hidden rounded-[min(7vh,35%)] border-[max(0.5vh,0.25rem)] border-purple-light bg-purple-light"
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
                <div className="absolute top-0 right-0 bottom-0 left-0 hidden bg-slate-900/75 group-hover:block">
                  <LightningBoltIcon className="m-4 text-green-light text-shadow-nfc" />
                </div>
                <img key={item.tokenId} className="h-full w-full select-none" src={item.image} alt={item.name} />
              </motion.div>
              <div className="mt-2 font-mono text-xxs text-white">
                <p className="group-hover:hidden">{item.name}</p>
                <p className="hidden text-green-light group-hover:block">Apply</p>
              </div>
              <input
                id={`item-${index}`}
                name={item?.tokenId}
                type="checkbox"
                onClick={() => selectItem(item.tokenId)}
                onChange={() => false}
                className="hidden h-4 w-4 rounded border-gray-300"
              />
            </label>
          ))}
        </div>
      ) : (
        <DisclosureText className="mx-2 text-center" color="white">
          <span className="mb-2 block text-center text-2xl font-bold text-slate-300">Empty</span>
          You don't have any items in your inventory. Purchase some in New Fang City or on{" "}
          <a href={`https://opensea.io/collection/${REACT_APP_OPENSEA_COLLECTION}`}>OpenSea</a>.
        </DisclosureText>
      )}
    </Modal>
  );
};
