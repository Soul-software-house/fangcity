import React from 'react'
import { Confirm } from '../Confirm'
import { useGlobalState } from '../../App'
import { inventory } from "../../constants";


const SelectFangster = () => {
    const [globalPanel, setGlobalPanel] = useGlobalState("selectFangsterPanel")
    const [globalFangster, setGlobalFangster] = useGlobalState("selectedFangster")
    const [,setConfirm] = useGlobalState("confirm")

    function selectNFT(item) {
        setGlobalFangster(item);
        setGlobalPanel(false);
        setConfirm(null)
      }


  return (
    <Confirm confirm="selectFangsterPanel">
        <div className='w-full h-[411px] justify-center flex flex-col max-w-[328px] bg-content-bg rounded-3xl p-2'>
            <h1 className='text-white text-xs my-1'>SELECT PXLFANGSTER</h1>
            <div
                className={`  flex h-full w-full scrollbar overflow-y-scroll flex-wrap 
                  content-start gap-1 pl-2`}
            >
                <button
                onClick={() => {
                    setGlobalFangster(null);
                    setGlobalPanel(false);
                    setConfirm(null)
                }}
                className="relative z-10 h-[93px] w-[93px] shrink-0 overflow-clip rounded-lg border-2 border-purple-light bg-[rgba(0,0,0,0.5)] "
                >
                <p className=" font-bold text-white">NONE</p>
                </button>
                {/* Invalid cases - oneOne to check for 1/1 and pxlchip to check for applied chip  */}
                {inventory.length !== 0 ? (
                inventory &&
                inventory.map((item, index) => (
                    <button
                    key={index}
                    onClick={() => selectNFT(item)}
                    disabled={item.oneOne || !item.superChip}
                    className="relative z-10 h-[93px] w-[93px] shrink-0 overflow-clip rounded-lg border-2 border-purple-light"
                    >
                    <div
                        className={` ${
                        item.oneOne || !item.superChip ? "flex" : "hidden"
                        } absolute left-0 h-full w-full items-center bg-black p-1 opacity-60 `}
                    >
                        <p className={` ${item.oneOne ? "block" : "hidden"} text-[10px] text-white `}>
                        Sorry! <br /> Trait add-ons don&apos;t fit 1/1s"
                        </p>
                        <p className={` ${!item.superChip ? "block" : "hidden"} text-[10px] text-white `}>
                        Apply a Super PxlChipfirst!
                        </p>
                    </div>
                    <img className="z-0" src={item.img} alt="NFT" />
                    </button>
                ))
                ) : (
                <div className="relative z-10 h-full w-full gap-4">
                    <p className="text-sm font-bold uppercase text-white">
                    No pixel fangs found! <br />
                    </p>
                    <button className="h-[44px] max-w-[132px] rounded-full bg-purple-darkest py-2 px-4 text-sm font-bold uppercase text-white ease-linear hover:scale-105 active:scale-95">
                    <a href="https://opensea.io/collection/pxlfangs">buy now</a>
                    </button>
                </div>
                )}
            </div>
            <button onClick={() => {setConfirm(null); setGlobalPanel(false)}} className=' bg-primary-btn w-auto py-2 px-4 rounded-full font-bold'>CANCEL</button>
        </div>
        
    </Confirm>
  )
}

export default SelectFangster