import React, {useEffect} from 'react'
import {Confirm} from '../Confirm'
import { useGlobalState } from "../../App";
import { placeholder } from '../../constants'
import silhouette from "../../assets/images/store/placeholder.svg";
import silhouetteNE from "../../assets/images/store/Placeholder_NE.svg";
import { add } from "mathjs";

export const Buy = () => {
    const [, setConfirm] = useGlobalState("confirm");
    const [globalCart, ] = useGlobalState("shoppingCart")
    const [, setGlobalInventory] = useGlobalState("inventory")
    const [currency, ] = useGlobalState("currency")

    function onConfirm() {
        setGlobalInventory(globalCart)
        setConfirm(null)
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
                <div className='flex sm:flex-row justify-left sm:text-left text-center sm:items-left items-center flex-col gap-6'>
                    {/* <div className='flex w-[232px] h-[232px] border-8 border-purple-light rounded-2xl overflow-clip flex-shrink-0 flex-none'>
                        <img src={placeholder.img} alt="mintImg" />    
                    </div> */}
                    <div className='flex justify-center flex-col px-2 gap-2'>
                        <h1 className='uppercase text-white font-bold text-xl'>ARE YOU SURE?</h1>
                        <p className='text-white '>You&apos;re about to buy and store the following traits:</p>
                        <div className='scrollbar pl-2 sm:pl-0 flex flex-row gap-2 w-[calc(100vw-2rem)] sm:w-full overflow-x-auto max-w-[550px]'>
                            {globalCart.map(item => (
                                <div className={`flex relative justify-center bg-[#E1C9FF] flex-shrink-0 ${borderRarity(item)} border-[5px] rounded-lg w-[110px] h-[110px]`}>
                                    <img key={item.name} className='z-10' alt={item.name} src={item.img} />
                                    <img src={testNE(item.name) ? silhouetteNE : silhouette } alt="silhouette" className="absolute  top-0 left-0 right-0 align-bottom block" />  
                                </div>
                                
                                // <li>- {item.name} <b>x{item.quantity}</b></li>
                            ))}
                        
                        </div>
                    </div>
                </div>
                <p className='text-white sm:text-left my-4'>For a total of <b>{calculateTotal(globalCart)} {currency}</b>.</p>
                <p className='text-white text-xs my-4'>Note: All traits bought will be stored in the inventory</p>
                <div className='flex justify-center items-center gap-4'>
                    <button onClick={() => setConfirm(null)} className="bg-primary-btn max-w-[132px] h-[44px] rounded-full py-2 px-8 font-bold text-black text-sm hover:scale-105 active:scale-95 uppercase ease-linear">cancel</button>
                    <button onClick={() => onConfirm()} className="bg-primary-btn max-w-[132px] h-[44px] rounded-full py-2 px-8 font-bold text-black text-sm hover:scale-105 active:scale-95 uppercase ease-linear">confirm</button>
                </div>
                
    </Confirm>
  )
}