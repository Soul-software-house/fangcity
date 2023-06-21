import React, { useEffect, useState, Fragment } from "react";
import { motion } from "framer-motion";
import numeral from "numeral";

import { useGlobalState } from "../App";
import { COLORS } from "./Fangster";
import { HorizontalRule } from "./HorizontalRule";

numeral.nullFormat("---");

export const ClaimSelection = ({ onSelect }) => {
  const [userFangsters] = useGlobalState("userFangsters");
  const [userPxlFangsters] = useGlobalState("userPxlFangsters");
  const [fangGangAccruals] = useGlobalState("fangGangAccruals");
  const [pxlFangAccruals] = useGlobalState("pxlFangAccruals");
  const [modal] = useGlobalState("modal");
  const [selectedFangGang, setSelectedFangGang] = useState({});
  const [selectedPxlFang, setSelectedPxlFang] = useState({});
  const [, setSelectedAmount] = useState(0);
  const [selected, setSelected] = useState([]);
  const [allFangGangSelected, setAllFangGangSelected] = useState(false);
  const [allPxlFangSelected, setAllPxlFangSelected] = useState(false);

  useEffect(() => {
    if (modal === null) {
      setSelectedFangGang({});
      setSelectedPxlFang({});
      setSelectedAmount(0);
      setSelected([]);
    }
  }, [modal]);

  useEffect(() => {
    const fangGangSelected = Object.keys(selectedFangGang)
      .map(tokenId => ({
        collection: "fangster",
        tokenId: Number(tokenId),
        selected: selectedFangGang[tokenId],
        amount: selectedFangGang[tokenId] ? Number(fangGangAccruals[tokenId]) : 0,
      }))
      .filter(s => s.selected);

    const pxlSelected = Object.keys(selectedPxlFang)
      .map(tokenId => ({
        collection: "pxlFangster",
        tokenId: Number(tokenId),
        selected: selectedPxlFang[tokenId],
        amount: selectedPxlFang[tokenId] ? Number(pxlFangAccruals[tokenId]) : 0,
      }))
      .filter(s => s.selected);

    setSelected(fangGangSelected.concat(pxlSelected));
  }, [selectedFangGang, selectedPxlFang, fangGangAccruals, pxlFangAccruals]);

  useEffect(() => {
    onSelect(selected);
    setSelectedAmount(Object.values(selected as object).reduce((acc, x) => Number(acc) + Number(x.amount), 0));
  }, [selected, onSelect]);

  useEffect(() => {
    setAllPxlFangSelected(
      Object.keys(selectedPxlFang).filter(k => selectedPxlFang[k]).length === Object.keys(pxlFangAccruals).length
    );
  }, [pxlFangAccruals, selectedPxlFang]);

  useEffect(() => {
    setAllFangGangSelected(
      Object.keys(selectedFangGang).filter(k => selectedFangGang[k]).length === Object.keys(fangGangAccruals).length
    );
  }, [fangGangAccruals, selectedFangGang]);

  const handleSelectPxlFang = event => {
    setSelectedPxlFang({ ...selectedPxlFang, [event.target.name]: event.target.checked });
  };
  const handleSelectAllPxlFang = () => {
    if (allPxlFangSelected) {
      setSelectedPxlFang(
        Object.keys(pxlFangAccruals).reduce((acc, a) => {
          acc[a] = false;
          return acc;
        }, {})
      );
    } else {
      setSelectedPxlFang(
        Object.keys(pxlFangAccruals).reduce((acc, a) => {
          acc[a] = true;
          return acc;
        }, {})
      );
    }
  };
  const handleSelectFangGang = event => {
    setSelectedFangGang({ ...selectedFangGang, [event.target.name]: event.target.checked });
  };
  const handleSelectAllFangGang = () => {
    if (allFangGangSelected) {
      setSelectedFangGang(
        Object.keys(fangGangAccruals).reduce((acc, a) => {
          acc[a] = false;
          return acc;
        }, {})
      );
    } else {
      setSelectedFangGang(
        Object.keys(fangGangAccruals).reduce((acc, a) => {
          acc[a] = true;
          return acc;
        }, {})
      );
    }
  };

  return (
    <>
      {!userFangsters.length && !userPxlFangsters.length ? (
        <h3 className="text-xl font-bold leading-6 text-white">
          No Fangsters or PxlFangsters found. Check out the{" "}
          <a href="https://opensea.io/collection/fanggangnft">Fang Gang</a> and{" "}
          <a href="https://opensea.io/collection/pxlfangs">PxlFangs</a> collections on OpenSea to join the gang!
        </h3>
      ) : (
        <>
          {userFangsters?.length ? (
            <div className="mt-4">
              <h3 className="ml-1 mr-2 flex justify-between text-left text-xl font-bold leading-6 text-white">
                <span>Fangsters</span>
                <span onClick={handleSelectAllFangGang} className="text-base text-cyan-light">
                  {allFangGangSelected ? "Deselect" : "Select"} All
                </span>
              </h3>

              <div className="-mx-2 mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-4 md:grid-cols-4">
                {userFangsters.map(fangster => (
                  <label className="m-2" key={fangster?.id} htmlFor={`fangster-${fangster?.id}`}>
                    <motion.img
                      key={fangster?.get("tokenId")}
                      className={`inline-block w-[max(8vh,6.5rem)] select-none rounded-[min(7vh,35%)] border-[max(0.5vh,0.25rem)]
                            ${
                              selected?.find(s => s.collection === "fangster" && s.tokenId === fangster?.get("tokenId"))
                                ?.selected
                                ? `border-${COLORS[fangster?.get("background")] || "black"} bg-${
                                    COLORS[fangster?.get("background")] || "black"
                                  }`
                                : `
                                border-slate-400 bg-slate-300 saturate-0`
                            }`}
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
                    />
                    <div className="mt-2 font-mono text-xxs text-white">
                      <p>
                        {numeral(fangGangAccruals[fangster?.get("tokenId")]).format(
                          fangGangAccruals[fangster?.get("tokenId")] >= 10_000_000 ? "0,0" : "0,0.[00]"
                        )}
                      </p>
                    </div>
                    <input
                      id={`fangster-${fangster?.id}`}
                      name={fangster?.get("tokenId")}
                      type="checkbox"
                      checked={selectedFangGang[fangster?.get("tokenId")]}
                      onClick={handleSelectFangGang}
                      onChange={() => false}
                      className="hidden h-4 w-4 rounded border-gray-300"
                    />
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          {userFangsters?.length && userPxlFangsters.length ? <HorizontalRule /> : null}

          {userPxlFangsters?.length ? (
            <div className="mt-4">
              <h3 className="ml-1 mr-2 flex justify-between text-left text-xl font-bold leading-6 text-white">
                <span>PxlFangsters</span>
                <span onClick={handleSelectAllPxlFang} className="text-base text-cyan-light">
                  {allPxlFangSelected ? "Deselect" : "Select"} All
                </span>
              </h3>
              <div className="-mx-2 mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-4 md:grid-cols-4">
                {userPxlFangsters.map(pxlFangster => (
                  <label className="m-2" key={pxlFangster?.id} htmlFor={`pxlFangster-${pxlFangster?.id}`}>
                    <motion.img
                      key={pxlFangster?.get("tokenId")}
                      className={`inline-block w-[max(8vh,6.5rem)] select-none rounded-[min(7vh,35%)] border-[max(0.5vh,0.25rem)]
                          ${
                            selected?.find(
                              s => s.collection === "pxlFangster" && s.tokenId === pxlFangster?.get("tokenId")
                            )?.selected
                              ? `border-${COLORS[pxlFangster?.get("background")] || "black"} bg-${
                                  COLORS[pxlFangster?.get("background")] || "black"
                                }`
                              : `
                              border-slate-400 bg-slate-300 saturate-0`
                          }`}
                      style={{
                        boxShadow: "-6px 4px 1px rgba(0, 0, 0, 0.15)",
                      }}
                      src={pxlFangster?.get("image")}
                      alt={pxlFangster?.get("name")}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "-7px 5px 1px rgba(0, 0, 0, 0.15)",
                      }}
                      whileTap={{
                        scale: 0.95,
                        boxShadow: "-3px 2px 1px rgba(0, 0, 0, 0.15)",
                      }}
                    />
                    <div className="mt-2 font-mono text-xxs text-white">
                      <p>
                        {numeral(pxlFangAccruals[pxlFangster?.get("tokenId")]).format(
                          pxlFangAccruals[pxlFangster?.get("tokenId")] >= 10_000_000 ? "0,0" : "0,0.[00]"
                        )}
                      </p>
                    </div>
                    <input
                      id={`pxlFangster-${pxlFangster?.id}`}
                      name={pxlFangster?.get("tokenId")}
                      type="checkbox"
                      checked={selectedPxlFang[pxlFangster?.get("tokenId")]}
                      onClick={handleSelectPxlFang}
                      onChange={() => false}
                      className="hidden h-4 w-4 rounded border-gray-300"
                    />
                  </label>
                ))}
              </div>
            </div>
          ) : null}
        </>
      )}
    </>
  );
};
