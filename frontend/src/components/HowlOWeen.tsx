import React, { useState } from "react";
import Moralis from "moralis-v1";
import mergeImages from "merge-images";
import { MultiSelect } from "react-multi-select-component";
import { useDebouncedCallback } from "use-debounce";

import howlOWeen from "../assets/images/wardrobe/Howl-O-Ween.png";
import secret from "../assets/images/wardrobe/Secret.gif";

import bat from "../assets/images/wardrobe/Bat_Decoration.png";
import bloodyHoodie from "../assets/images/wardrobe/Bloody_Hoodie.png";
import bloodyTshirt from "../assets/images/wardrobe/Bloody_Tshirt.png";
import broom from "../assets/images/wardrobe/Broom.png";
import candyCorn from "../assets/images/wardrobe/Candycorn_Decoration.png";
import candyCornHoodie from "../assets/images/wardrobe/Candycorn_Hoodie.png";
import candyCornTshirt from "../assets/images/wardrobe/Candycorn_Tshirt.png";
import clownFace from "../assets/images/wardrobe/Clown_Face.png";
import ghostfaceMask from "../assets/images/wardrobe/Ghostface_Mask.png";
import ghosts from "../assets/images/wardrobe/Ghosts_Decoration.png";
import evilPumpkinHead from "../assets/images/wardrobe/Pumpkin_Head_Evil.png";
import pumpkinHead from "../assets/images/wardrobe/Pumpkin_Head_Neutral.png";
import pumpkinShirt from "../assets/images/wardrobe/Pumpkin_Shirt.png";
import scratchedHoodie from "../assets/images/wardrobe/Scratched_Hoodie.png";
import scythe from "../assets/images/wardrobe/Scythe.png";
import skeletonShirt from "../assets/images/wardrobe/Skeleton_Shirt.png";
import skeletonTshirt from "../assets/images/wardrobe/Skeleton_Tshirt.png";
import skullMask from "../assets/images/wardrobe/Skull_Mask.png";
import slimeHoodie from "../assets/images/wardrobe/Slime_Hoodie.png";
import spiderOutfit from "../assets/images/wardrobe/Spider_Outfit.png";
import spiders from "../assets/images/wardrobe/Spiders_Decoration.png";
import witchNose from "../assets/images/wardrobe/Witch_Nose.png";

import Collab4 from "../assets/images/wardrobe/Collab4.png";
import Collab5 from "../assets/images/wardrobe/Collab5.png";
import Collab6 from "../assets/images/wardrobe/Collab6.png";
import Collab7 from "../assets/images/wardrobe/Collab7.png";
import Collab8 from "../assets/images/wardrobe/Collab8.png";
import Collab9 from "../assets/images/wardrobe/Collab9.png";
import Collab10 from "../assets/images/wardrobe/Collab10.png";
import Collab11 from "../assets/images/wardrobe/Collab11.png";
import Collab12 from "../assets/images/wardrobe/Collab12.png";
import Collab13 from "../assets/images/wardrobe/Collab13.png";

// prettier-ignore
const COLLABS = {
  "4": Collab4,
  "5": Collab5,
  "6": Collab6,
  "7": Collab7,
  "8": Collab8,
  "9": Collab9,
  "10": Collab10,
  "11": Collab11,
  "12": Collab12,
  "13": Collab13,
};

const Fangster = Moralis.Object.extend("Fangster");
const Query = new Moralis.Query(Fangster);

const getBase64FromUrl = async url => {
  const data = await fetch(url);
  const blob = await data.blob();
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
  });
};

export const HowlOWeen = () => {
  const [items] = React.useState([
    { label: "Bat", value: "bat", src: bat },
    { label: "Bloody Hoodie", value: "bloody-hoodie", src: bloodyHoodie },
    { label: "Bloody T-Shirt", value: "bloody-tshirt", src: bloodyTshirt },
    { label: "Broom", value: "broom", src: broom },
    { label: "Candy Corn", value: "candy-corn", src: candyCorn },
    { label: "Candy Corn Hoodie", value: "candy-corn-hoodie", src: candyCornHoodie },
    { label: "Candy Corn T-Shirt", value: "candy-corn-tshirt", src: candyCornTshirt },
    { label: "Clown Face", value: "clown-face", src: clownFace },
    { label: "Ghostface Mask", value: "ghostface-mask", src: ghostfaceMask },
    { label: "Ghosts", value: "ghosts", src: ghosts },
    { label: "Evil Pumpkin Head", value: "evil-pumpkin-head", src: evilPumpkinHead },
    { label: "Pumpkin Head", value: "pumpkin-head", src: pumpkinHead },
    { label: "Pumpkin Shirt", value: "pumpkin-shirt", src: pumpkinShirt },
    { label: "Scratched Hoodie", value: "scratched-hoodie", src: scratchedHoodie },
    { label: "Scythe", value: "scythe", src: scythe },
    { label: "Skeleton Shirt", value: "skeleton-shirt", src: skeletonShirt },
    { label: "Skeleton T-Shirt", value: "skeleton-tshirt", src: skeletonTshirt },
    { label: "Skull Mask", value: "skull-mask", src: skullMask },
    { label: "Slime Hoodie", value: "slime-hoodie", src: slimeHoodie },
    { label: "Spider Outfit", value: "spider-outfit", src: spiderOutfit },
    { label: "Spiders", value: "spiders", src: spiders },
    { label: "Witch Nose", value: "witch-nose", src: witchNose },
  ]);

  const [fangsterImageSrc, setFangsterImageSrc] = useState(secret);
  const [imageSrc, setImageSrc] = useState(secret);
  const [selected, setSelected] = useState([]);

  const updateFangsterId = useDebouncedCallback(async id => {
    const invalid = id === "";

    if (invalid) {
      setSelected([]);
      setImageSrc(secret);
      setFangsterImageSrc(secret);
    } else if (COLLABS[id]) {
      setFangsterImageSrc(COLLABS[id]);
      mergeImages([COLLABS[id]].concat(selected.map(s => s.src)).filter(x => x)).then(b64 => setImageSrc(b64));
    } else {
      Query.equalTo("tokenId", Number(id));

      const fangsters = await Query.find();
      const image = fangsters[0]?.attributes?.image || secret;

      getBase64FromUrl(image).then((data: string) => {
        setFangsterImageSrc(data);
        mergeImages([data].concat(selected.map(s => s.src)).filter(x => x)).then(b64 => setImageSrc(b64));
      });
    }
  }, 250);

  const updateItems = async s => {
    setSelected(s);
    mergeImages([fangsterImageSrc].concat(s.map(s => s.src)).filter(x => x)).then(b64 => setImageSrc(b64));
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8">
      <img id="title" className="mb-16 w-full max-w-2xl select-none" src={howlOWeen} alt="Howl-O-Ween" />
      <div className="flex max-w-sm flex-col items-center justify-center">
        <img
          id="image"
          className="mb-8 w-full select-none rounded-md border-8 border-black bg-black shadow-nfc"
          src={imageSrc}
          alt="Fangster"
        />
        <div className="mb-4 w-full">
          <input
            type="number"
            name="tokenId"
            id="tokenId"
            className="block w-full rounded-md border-8 border-black text-3xl outline-none ring-transparent focus:border-black focus:ring-transparent"
            placeholder="Fangster ID"
            autoComplete="off"
            onChange={e => updateFangsterId(e.target.value)}
          />
        </div>
        <div className="mb-4 w-full">
          <MultiSelect
            options={items}
            value={selected}
            onChange={updateItems}
            className="mt-1 block w-full rounded-md border-8 border-black text-3xl outline-none ring-transparent focus:border-black focus:ring-transparent"
            labelledBy="Select Items"
            disableSearch
            hasSelectAll={false}
            valueRenderer={(selected, _options) =>
              selected.length ? `${selected.length} Item${selected.length > 1 ? "s" : ""}` : "Select Items"
            }
          />
        </div>
      </div>
    </div>
  );
};
