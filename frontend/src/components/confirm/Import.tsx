import React from "react";
import { useGlobalState } from "../../App";
import { Confirm } from "../Confirm";
import silhouette from "../../assets/images/store/PxlSilhouette.svg";

const Import = () => {
  const [, setConfirm] = useGlobalState("confirm");
  const [globalTrait, ] = useGlobalState("selectedTrait")

  function onClickConfirm() {
    setConfirm(null)
  }

  return (
    <Confirm confirm="import">
      <div className="sm:items-left flex flex-col items-center justify-center gap-6 text-center sm:flex-row sm:text-left">
        <div className="flex relative h-[232px] w-[232px] flex-none flex-shrink-0 overflow-clip rounded-2xl border-8 border-purple-light">
          <img src={silhouette} alt="mintImg" className={`top-0 z-0 `} />
          <img
                  src={globalTrait["img"]}
                  alt="traitImg"
                  className="absolute top-0 left-0 right-0 z-10 w-full "
                />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold uppercase text-white">ARE YOU SURE?</h1>
          <p className="text-white ">You’re about to burn the following trait off-chain</p>
          <ul className="text-white">
            <li>- {globalTrait["name"]} </li>
          </ul>
        </div>
      </div>
      <p className="my-4 text-xs font-bold text-white">
        Note: Gas fees may apply.
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

export default Import;
