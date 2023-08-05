// import React, { useEffect, useState } from "react";
import { useGlobalState } from "../../App";
import { Confirm } from "../Confirm";
// import { placeholder } from '../../constants'
import { add } from "mathjs";

export const Apply = () => {
    const [, setConfirm] = useGlobalState("confirm")
    const [globalCart, ] = useGlobalState("shoppingCart")
    const [globalFangster, ] = useGlobalState('selectedFangster')
    const [, setGlobalInventory] = useGlobalState("inventory")
    const [img, ] = useGlobalState("combinedImgStore")
    const [currency,] = useGlobalState("currency")

    function onConfirm() {
        setGlobalInventory(globalCart)
        setConfirm(null);
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
        } if (currency === "AWOO") {
          return item.priceAWOO;
          // console.log(totalPrice)
        }
      }

  return (
    <Confirm confirm="apply">
          <div className='flex relative sm:flex-row-reverse justify-center sm:text-left text-center sm:items-left items-center flex-col gap-6'>
                    <div className='flex w-[232px] h-[232px] border-8 border-content-bg rounded-2xl overflow-clip flex-shrink-0 flex-none'>
                        <img src={img} alt="mintImg" />    
                    </div>
                    <div className='flex justify-between items-stretch h-full flex-col gap-2'>
                        <h1 className='uppercase text-white font-bold text-xl'>ARE YOU SURE?</h1>
                        <p className='text-white '>You’re about to buy and apply <br/> the following traits to <b>PxlFangster {globalFangster && globalFangster["id"]}</b>:</p>
                        <ul className='text-white'>
                            {globalCart.map(item => (
                                <li>- {item.name}</li>
                            ))}
                        </ul>
                        <p className="text-white">For a total of <b>{calculateTotal(globalCart)} {currency}</b>.</p>
                    </div>
                </div>
                {/* <p className='text-white text-xs font-bold my-4'>Note: you have 1 trait selected that hasn’t been added to your cart. It will not be minted or applied.</p> */}
                <div className='flex justify-center mt-4 items-center gap-4'>
                    <button onClick={() => setConfirm(null)} className="bg-primary-btn max-w-[132px] h-[44px] rounded-full py-2 px-8 font-bold text-black text-sm hover:scale-105 active:scale-95 uppercase ease-linear">cancel</button>
                    <button onClick={() => onConfirm()} className="bg-primary-btn max-w-[132px] h-[44px] rounded-full py-2 px-8 font-bold text-black text-sm hover:scale-105 active:scale-95 uppercase ease-linear">confirm</button>
                </div>
                

    </Confirm>
  )
}