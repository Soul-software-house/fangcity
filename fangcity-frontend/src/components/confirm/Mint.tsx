import React from "react";
import { useGlobalState } from "../../App";
import { Confirm } from "../Confirm";
import { placeholder } from "../../constants";
import silhouette from "../../assets/images/store/PxlSilhouette.svg";

const Mint = () => {
  const [confirm, setConfirm] = useGlobalState("confirm");
  const [globalTrait, ] = useGlobalState("selectedTrait")

  function onClickConfirm() {
    setConfirm(null)
  }

  const borderRarity = (item:any) => {
    // console.log(item.rarity)
    let rarity = (item && item.rarity) || ""
    switch (rarity.toLowerCase()) {
      case "common":
        return "border-[#FFA4EF]";
      case "uncommon":
        return "border-[#A9EFC6]";
      case "rare":
        return "border-[#76D8F9]";
      case "legendary":
        return "border-[#FFC657]";
      case "oneone":
        return "border-[#FF6363]";
      default: return "border-[#FFA4EF]";
    }
  } 

  return (
    <Confirm confirm="mint">
      <div className="sm:items-left mx-10 flex flex-col items-center justify-center gap-6 text-center sm:text-left">
        <div className="flex justify-center text-center flex-col gap-2">
          <h1 className="text-2xl font-bold uppercase text-white">ARE YOU SURE?</h1>
          <p className="text-white ">You’re about to mint <br/> the following trait as an NFT:</p>
          <div className={`flex relative h-[232px] w-[232px] bg-[#E1C9FF] flex-none flex-shrink-0 overflow-clip rounded-2xl border-8 ${borderRarity(globalTrait)}`} >
            <img src={silhouette} alt="mintImg" className={`top-0 z-0 `} />
            <img
                    src={globalTrait["img"]}
                    alt="traitImg"
                    className="absolute top-0 left-0 right-0 z-10 w-full "
                  />
          </div>
          <p className="text-white font-bold ">
            {globalTrait["name"]} 
          </p>
        </div>
      </div>
      <p className="my-4 text-xs text-white">
      If you want to apply this trait to a Super <br/> PxlFangster later, you need to burn the <br/> NFT from your Trait Inventory.
      </p>
      <div className="flex items-center justify-center mt-4 gap-4">
        <button
          onClick={() => setConfirm(null)}
          className="h-[44px] max-w-[132px] rounded-full bg-primary-btn py-2 px-8 text-sm font-bold uppercase text-black ease-linear hover:scale-105 active:scale-95"
        >
          cancel
        </button>
        <button onClick={() => onClickConfirm()} className="h-[44px] max-w-[132px] rounded-full bg-primary-btn py-2 px-8 text-sm font-bold uppercase text-black ease-linear hover:scale-105 active:scale-95">
          confirm
        </button>
      </div>
    </Confirm>
  );
};

export default Mint;
