import React, { useEffect } from "react";
import { Confirm } from "../Confirm";
import { useGlobalState } from "../../App";
import { placeholder } from "../../constants";
import silhouette from "../../assets/images/store/placeholder.svg";
import silhouetteNE from "../../assets/images/store/Placeholder_NE.svg";
import { add } from "mathjs";
import { getWalletId } from "../../utils";
import { debuglog } from "util";
import axios from "axios";

export const Buy = () => {
  const [, setConfirm] = useGlobalState("confirm");
  const [globalCart] = useGlobalState("shoppingCart");
  const [, setGlobalInventory] = useGlobalState("inventory");
  const [currency] = useGlobalState("currency");

  async function onConfirm() {
    let walletId;
    try {
      walletId = await getWalletId();
      console.log("Wallet ID:", walletId);
    } catch (error) {
      console.log(error);
    }
    // Trait
    setGlobalInventory(globalCart);
    setConfirm(null);

    // Set data
    const data = {
      walletId: walletId,
      burn: true,
      offChainApply: true,
      meta: globalCart,
    };

    // Post to db
    console.log('data (fe)', data)
    const res = await axios.post(process.env.REACT_APP_BACKEND_BASE_URL + '/api/save/transaction', data, {
      headers: { "Content-Type": "application/json" },
    });
  }

  function calculateTotal(item) {
    let total: number = 0;
    let length = 0;

    item.map(data => {
      if (length < price(data).toString().length - 2) {
        length = price(data).toString().length - 2;
      }
      return (total = add(total, price(data)));
    });

    if (total > 1) {
      return total.toFixed(2);
    } else {
      return total.toFixed(length);
    }
  }

  function price(item) {
    if (currency === "ETH") {
      // let ETH = item.priceETH *1000
      return item.priceETH;
      // console.log(item.priceAWOO)
    }
    if (currency === "AWOO") {
      return item.priceAWOO;
      // console.log(totalPrice)
    }
  }

  const borderRarity = (item: any) => {
    // console.log(item.rarity)
    let rarity = (item && item.rarity) || "";
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
      default:
        return "border-[#FFA4EF]";
    }
  };

  function testNE(data) {
    switch (data) {
      case "Black WLDFNGZ Retro Bucket Hat":
        return true;
      case "Red Bandana":
        return true;
      case "Black Bandana":
        return true;
      case "Red WLDFNGZ Retro Bucket Hat":
        return true;
      default:
        return false;
    }
  }

  return (
    <Confirm confirm="buy">
      <div className="justify-left sm:items-left flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
        {/* <div className='flex w-[232px] h-[232px] border-8 border-purple-light rounded-2xl overflow-clip flex-shrink-0 flex-none'>
                        <img src={placeholder.img} alt="mintImg" />    
                    </div> */}
        <div className="flex flex-col justify-center gap-2 px-2">
          <h1 className="text-xl font-bold uppercase text-white">ARE YOU SURE?</h1>
          <p className="text-white ">You&apos;re about to buy and store the following traits:</p>
          <div className="scrollbar flex w-[calc(100vw-2rem)] max-w-[550px] flex-row gap-2 overflow-x-auto pl-2 sm:w-full sm:pl-0">
            {globalCart.map(item => (
              <div
                className={`relative flex flex-shrink-0 justify-center bg-[#E1C9FF] ${borderRarity(
                  item
                )} h-[110px] w-[110px] rounded-lg border-[5px]`}
              >
                <img key={item.name} className="z-10" alt={item.name} src={item.img} />
                <img
                  src={testNE(item.name) ? silhouetteNE : silhouette}
                  alt="silhouette"
                  className="absolute  top-0 left-0 right-0 block align-bottom"
                />
              </div>

              // <li>- {item.name} <b>x{item.quantity}</b></li>
            ))}
          </div>
        </div>
      </div>
      <p className="my-4 text-white sm:text-left">
        For a total of{" "}
        <b>
          {calculateTotal(globalCart)} {currency}
        </b>
        .
      </p>
      <p className="my-4 text-xs text-white">Note: All traits bought will be stored in the inventory</p>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setConfirm(null)}
          className="h-[44px] max-w-[132px] rounded-full bg-primary-btn py-2 px-8 text-sm font-bold uppercase text-black ease-linear hover:scale-105 active:scale-95"
        >
          cancel
        </button>
        <button
          onClick={() => onConfirm()}
          className="h-[44px] max-w-[132px] rounded-full bg-primary-btn py-2 px-8 text-sm font-bold uppercase text-black ease-linear hover:scale-105 active:scale-95"
        >
          confirm
        </button>
      </div>
    </Confirm>
  );
};
