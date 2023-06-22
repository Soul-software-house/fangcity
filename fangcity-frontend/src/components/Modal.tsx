import React, { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { useGlobalState } from "../App";

export const Modal = ({ children = null, title, modal, onClose = null }) => {
  const [globalModal, setGlobalModal] = useGlobalState("modal");

  useEffect(() => {
    console.log('modal', globalModal)
  }, [globalModal])
  

  return (
    <Transition.Root show={globalModal === modal} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-[999] overflow-y-auto"
        onClose={() => {
          setGlobalModal(null);
          if (onClose) onClose();
        }}
      >
        <div className="m-2 flex min-h-[calc(100%-4rem)] items-center justify-center text-center">
          <Dialog.Overlay className="fixed inset-0" />
          <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
            &#8203;
          </span>
          <div className={`relative inline-block w-full select-none overflow-hidden  ${ modal === "traitstore" || "traitinventory" ? "bg-window-bg lg:max-w-[1232px] lg:h-full h-[100dvh] max-h-[calc(100vh-2rem)] rounded-[15px]" : "bg-primary bg-opacity-90 sm:max-w-2xl rounded-xxl border-[max(0.5vh,0.25rem)] border-black" }   text-left align-bottom transition-all sm:w-auto sm:p-6 sm:align-middle`} >
            <div className="absolute top-0 right-0 block pt-4 pr-4">
              <button
                type="button"
                className="rounded-md text-slate-300 hover:text-white focus:outline-none"
                onClick={() => setGlobalModal(null)}
              >
                <XIcon className="h-8 w-8" />
              </button>
            </div>
            <div className={` mt-4 ${modal === "traitstore" || "traitinventory" ? 'mb-8 mx-1 sm:mx-4 h-full flex flex-col' : "mx-4 mb-8" } mb-8 text-center`}>
              <Dialog.Title as="h3" className={`mx-2 ${modal === "traitstore" || "traitinventory" ? 'mb-8' : "mb-8" }  text-2xl font-bold leading-6 text-white md:text-3xl`}>
                {title}
              </Dialog.Title>

              <div className="pt-4 flex flex-col h-full">{children}</div>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
