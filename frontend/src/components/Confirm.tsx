import React, { Fragment, } from "react";
import { useGlobalState } from "../App";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";

export const Confirm = ({ children = null, confirm, onClose = null }) => {
  const [globalConfirm, setGlobalConfirm] = useGlobalState("confirm");
  // console.log(globalConfirm)

  return (
    <Transition.Root show={globalConfirm === confirm} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-[999] overflow-y-auto bg-[rgba(38,32,2,0.6)]"
        onClose={() => {
          setGlobalConfirm(null);
          if (onClose) onClose();
        }}
      >
        <div className="m-2 flex min-h-[calc(100%-4rem)] items-center justify-center text-center">
          <Dialog.Overlay className="fixed inset-0" />
          
          <div
            className={`relative inline-block w-full select-none overflow-hidden rounded-[15px] bg-window-bg  text-left align-bottom transition-all sm:w-auto  sm:p-6 sm:align-middle`}
          >
            <div className={`${ globalConfirm === "cart" || "apply" ? "flex" : "hidden"} absolute top-0 right-0 block pt-4 pr-4`}>
              <button
                type="button"
                className={` rounded-md text-slate-300 hover:text-white focus:outline-none `}
                onClick={() => setGlobalConfirm(null)}
              >
                <XIcon className="h-8 w-8" />
              </button>
            </div>
            <div className={` ${ globalConfirm === "cart" || "selection" ? "mt-8" : "mt-4"} mb-8 text-center ${globalConfirm === "selectFangsterPanel" ? "flex justify-center" : ""}`}>
              <div className="pt-4">{children}</div>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
