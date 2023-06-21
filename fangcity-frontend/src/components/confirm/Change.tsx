import React from 'react'
import { useGlobalState } from "../../App";
import { Confirm } from "../Confirm";
import { placeholder } from '../../constants'

const Change = () => {
    const [, setConfirm] = useGlobalState("confirm")
    const [globalCart, ] = useGlobalState("selections")
    const [globalFangster] = useGlobalState("selectedFangster")
    const [img,] = useGlobalState("combinedImgInventory")

    function onConfirm() {
        setConfirm(null)
    }

  return (
    <Confirm confirm="change">
          <div className='flex sm:flex-row-reverse h-auto justify-center sm:text-left text-center sm:items-left items-center flex-col gap-6'>
                    <div className='flex w-[232px] h-[232px] border-8 border-content-bg rounded-2xl overflow-clip flex-shrink-0 flex-none'>
                        <img src={img} alt="mintImg" />    
                    </div>
                    <div className='flex h-full items-stretch flex-col gap-2'>
                        <h1 className='uppercase text-white font-bold text-xl'>ARE YOU SURE?</h1>
                        <p className='text-white '>You’re about to apply the following traits <br/> to <b>PxlFangster {globalFangster && globalFangster["id"]}</b>:</p>
                        <ul className='text-white'>
                            {globalCart.map(item => (
                                <li>- {item.name}</li>
                            ))}
                            
                        </ul>
                    </div>
                </div>
                {/* <p className='text-white text-xs font-bold my-4'>Note: you have 1 trait selected that hasn’t been added to your cart. It will not be minted or applied.</p> */}
                <div className='flex justify-center items-center gap-4 mt-6'>
                    <button onClick={() => setConfirm(null)} className="bg-primary-btn max-w-[132px] h-[44px] rounded-full py-2 px-8 font-bold text-black text-sm hover:scale-105 active:scale-95 uppercase ease-linear">cancel</button>
                    <button onClick={() => onConfirm()} className="bg-primary-btn max-w-[132px] h-[44px] rounded-full py-2 px-8 font-bold text-black text-sm hover:scale-105 active:scale-95 uppercase ease-linear">confirm</button>
                </div>
                

    </Confirm>
  )
}

export default Change