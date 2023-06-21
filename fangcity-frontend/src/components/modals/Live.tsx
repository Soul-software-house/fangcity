import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useWindowSize } from "@reach/window-size";

import { useGlobalState } from "../../App";

export const Live = () => {
  const { width, height } = useWindowSize();
  const [modal, setModal] = useGlobalState("modal");

  return (
    <Transition appear show={modal === "live"} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-[1000] overflow-y-auto" onClose={() => setModal(null)}>
        <div className="h-full w-full p-4">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
          <div
            onClick={() => setModal(null)}
            className="relative z-[1000] flex h-full w-full items-center justify-center"
          >
            <iframe
              title="Fang Gang Live"
              src="https://www.youtube.com/embed/videoseries?list=PLTV4dLYNXu0EPVqkFovnbEXUAubzWLACK"
              allowFullScreen
              scrolling="no"
              frameBorder="0"
              className="z-[1000] rounded-[25px] shadow-nfc"
              style={{
                width: `min(100%, calc(calc(100vh - 2rem - ${width > height ? 0 : 1}px) * 1.77777778))`,
                height: `min(100%, calc(calc(100vw - 2rem - ${width > height ? 1 : 0}px) * 0.5625))`,
              }}
            ></iframe>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
