import React, { useEffect, useState } from "react";
import { useMoralisQuery } from "react-moralis";
import { useGlobalState } from "../../App";

import { Modal } from "../Modal";
import { COLORS } from "../Fangster";

export const Claw = () => {
  const [modal] = useGlobalState("modal");
  const [fangsterId, setFangsterId] = useState(Math.floor(Math.random() * 8888 + 1));
  const [attributes, setAttributes] = useState([]);

  const { data } = useMoralisQuery("Fangster", query => query.equalTo("tokenId", fangsterId).limit(1), [fangsterId]);

  useEffect(() => {
    if (modal === "claw") {
      setFangsterId(Math.floor(Math.random() * 8888 + 1));
    } else {
      setFangsterId(null);
    }
  }, [modal]);

  useEffect(() => {
    if (data?.length) {
      const attrs = Object.keys(data[0]?.attributes)
        .filter(k =>
          ["background", "body", "collab", "face", "fur", "head", "secret", "special", "team", "rarity"].includes(k)
        )
        .filter(k => data[0]?.get(k) !== null && data[0]?.get(k) !== "")
        .map(k => ({ key: k.charAt(0).toUpperCase() + k.slice(1), value: data[0]?.get(k) }));

      setAttributes(attrs);
    } else {
      setAttributes([]);
    }
  }, [data]);

  return (
    <Modal title="The Claw" modal="claw">
      {data?.length ? (
        <>
          <h3 className="ml-1 mr-2 text-center text-xl font-bold leading-6 text-white">
            <p>The claw chooses {data[0]?.get("name")}!</p>
            <p>
              Check it out on{" "}
              <a
                className="border-b-2 border-purple-light hover:border-white"
                href={`https://opensea.io/assets/0x9d418c2cae665d877f909a725402ebd3a0742844/${data[0]?.get("tokenId")}`}
                target="_blank"
                rel="noreferrer"
              >
                OpenSea
              </a>{" "}
              or{" "}
              <a
                className="border-b-2 border-purple-light hover:border-white"
                href={`https://looksrare.org/collections/0x9d418C2Cae665D877F909a725402EbD3A0742844/${data[0]?.get(
                  "tokenId"
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                LooksRare
              </a>
              .
            </p>
          </h3>

          <div
            className={`mx-auto mt-8 max-h-[50vh] max-w-[50vh] bg-${COLORS[data[0]?.get("background")]} border-${
              COLORS[data[0]?.get("background")]
            } overflow-hidden`}
            style={{
              borderRadius: "min(7vh, 35%)",
              borderWidth: "0.5vh",
            }}
          >
            <img
              className={`select-none bg-${COLORS[data[0]?.get("background")]} border-${
                COLORS[data[0]?.get("background")]
              } h-full w-full`}
              src={data[0]?.get("image")}
              alt={data[0]?.get("name")}
            />
          </div>

          <ul className="mt-8 flex flex-wrap justify-center">
            {attributes.map(attribute => (
              <li key={attribute.key} className="m-2 flex rounded-md shadow-sm">
                <div
                  className={`bg-${COLORS[`${data[0]?.get("background")}Light`] || "black"} border-${
                    COLORS[`${data[0]?.get("background")}`] || "black"
                  }
                    flex items-center justify-center rounded-l-md border-2 border-purple-dark px-4 font-medium text-black`}
                >
                  {attribute.key}
                </div>
                <div
                  className={`flex flex-1 items-center justify-between truncate rounded-r-md border-t-2 border-r-2 border-b-2 bg-white px-4 py-2 border-${
                    COLORS[`${data[0]?.get("background")}`] || "black"
                  }`}
                >
                  <p className="font-medium text-black">{attribute.value}</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <h3 className="ml-1 mr-2 text-center text-xl font-bold leading-6 text-white">
          <p>Loading</p>
        </h3>
      )}
    </Modal>
  );
};
