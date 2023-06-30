import React, { useState } from "react";
import { useGlobalState } from "../App";
import backArrow from "../assets/images/store/BackToSeries.svg";
import lock from "../assets/images/store/Lock.svg";
import { data, testData} from '../constants'
import silhouette from '../assets/images/store/placeholder.svg'
import silhouetteNE from '../assets/images/store/Placeholder_NE.svg'
import { getStrapiURL } from "../utils/Strapi";

const Tabs = ({ back, selectedTrait, series, inventory, store, cart, triats }) => {

  const [activeTab, setActiveTab] = useState("head");
  const [, setConfirm] = useGlobalState("confirm");
  const [, setTrait] = useGlobalState("selectedTrait")
  
  function onImport(item) {
    setConfirm("import")
    setTrait(item)
    console.log(data)
  }

  const handleBack = () => {
    back(false);
  };

  function checkSoldOut(stock:any, maxQuantity:any) {
    if (store){
      if (stock < 1 ) {
      return true
    } else {
      return false
    }
    } else return false
    
  }

  function checkTrait(item) {
    let result = cart.map(a => a.type);
    // console.log(cart.length > 0)
      if (cart.length > 0 ){
        if (result.indexOf(item.type) !== -1){
        return true
      } else return false
    }
  }

  function testNE(data){
    switch (data){
      case "Black WLDFNGZ Retro Bucket Hat":
        return true;
      case "Red Bandana":
        return true;
      case "Black Bandana":
        return true;
      case "Red WLDFNGZ Retro Bucket Hat":
        return true;
      default: return false;
    }
  }

  function checkLocked( prerequisites:any ) {
    if (store){
      if (prerequisites.length !== 0) {
        return true
      } else {
        return false
      }
    } else return false

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

  // useEffect(() => {
  //   console.log(selectedTrait)

  // }, [selectedTrait])
  

  return (
    <div className="lg:h-full h-full flex flex-col max-h-[563px] w-full lg:w-[580px] ">
      {/* Tabs */}
      <ul className="flex sm:text-base text-xs w-full list-none sm:gap-1 justify-between">
        <li
          onClick={() => setActiveTab("head")}
          className={` ${
            activeTab === "head" ? " bg-content-bg px-5 sm:px-10" : "bg-secondary-btn px-3 sm:px-6"
          }  cursor-pointer rounded-t-2xl  py-4 font-bold text-white transition-all `}
        >
          Head
        </li>
        <li
          onClick={() => setActiveTab("face")}
          className={` ${
            activeTab === "face" ? " bg-content-bg px-5 sm:px-10" : "bg-secondary-btn px-3 sm:px-6"
          }  cursor-pointer rounded-t-2xl  py-4 font-bold text-white transition-all`}
        >
          Face
        </li>
        <li
          onClick={() => setActiveTab("body")}
          className={` ${
            activeTab === "body" ? " bg-content-bg px-5 sm:px-10" : "bg-secondary-btn px-3 sm:px-6"
          }  cursor-pointer rounded-t-2xl  py-4 font-bold text-white transition-all`}
        >
          Body
        </li>
        <li
          onClick={() => setActiveTab("fur")}
          className={` ${
            activeTab === "fur" ? " bg-content-bg px-5 sm:px-10" : "bg-secondary-btn px-3 sm:px-6"
          }  cursor-pointer rounded-t-2xl  py-4 font-bold text-white transition-all`}
        >
          Fur
        </li>
        <li
          onClick={() => setActiveTab("background")}
          className={` ${
            activeTab === "background" ? " bg-content-bg px-5 sm:px-10" : "bg-secondary-btn px-3 sm:px-6"
          }  cursor-pointer rounded-t-2xl  py-4 font-bold text-white transition-all`}
        >
          Backgr.
        </li>
        <li
          onClick={() => setActiveTab("items")}
          className={` ${
            activeTab === "items" ? " bg-content-bg px-5 sm:px-10" : "bg-secondary-btn px-3 sm:px-6"
          }  cursor-pointer rounded-t-2xl  py-4 font-bold text-white transition-all`}
        >
          Items
        </li>
      </ul>

      {/* Panel */}
      <div className="relative min-h-[160px] h-auto sm:h-full flex-shrink items-stretch -mt-3 flex lg:h-[518px] w-full flex-col justify-start  gap-2 rounded-2xl bg-content-bg pt-2 sm:pt-4 pb-0 sm:pb-2 pl-2  text-center">
        
        {/* Back Button */}
        <button
          onClick={() => handleBack()}
          className="absolute left-4 top-5 flex items-center gap-2.5 text-[11px] font-bold text-white"
        >
          <img src={backArrow} alt="browse series " />
          <span>BROWSE SERIES</span>
        </button>

        {/* Title */}
        <h1 className="inline-block text-right sm:text-center font-bold px-4 text-white uppercase">{series}</h1>

        {/* Map Traits Card */}
        <div className="flex sm:flex-wrap sm:flex-1 min-h-[85px] sm:items-stretch  gap-2 pl-0.5 py-1 overflow-x-auto sm:overflow-y-auto scrollbar">
          
          {/* Trait Card */}
          { triats.map((data) => (
              data.type.toLowerCase() === activeTab.toLowerCase()
              && (data.serie === series || series === "all series") ?   
                <button
                key={data.name}
                onClick={() => selectedTrait(data)}
                // onFocus={() =>  selectedTrait(data)}
                onBlur={() => selectedTrait(null)}
                disabled={(data.inventory && inventory) || (checkTrait(data) && inventory) || checkLocked(data.requiredTraits)}
                className={` ${
                  checkLocked(data.requiredTraits) || checkSoldOut(data.maxQuantity, data.maxQuantity)
                    ? "cursor-default focus:outline-none "
                    : "cursor-pointer focus:outline-dashed focus:outline-[3px] focus:outline-white"
                }  relative shrink-0 z-10 h-[95px] w-[95px] sm:h-[165px] sm:w-[165px] overflow-clip group
                rounded-lg border-[5px] bg-[#E1C9FF] ${borderRarity(data)}`}
              >
                <img src={testNE(data.name) ? silhouetteNE : silhouette } alt="silhouette" className="z-10 relative top-0 left-0 right-0 align-bottom block" />
                <img src={`${getStrapiURL(data.image)}`} alt={data.name} className={`absolute block top-0 left-0 right-0 w-full ${data.type === 'background' ? 'z-0' : 'z-20'}`} />

                {/* Not Off-chain case */}
                { data.inventory && inventory  ? 
                <div className="flex p-2 sm:hidden sm:group-hover:flex absolute  flex-col justify-center bg-[rgba(38,32,2,0.5)] items-center gap-y-2 top-0 w-full h-full bottom-0 left-0 right-0 z-30">
                  <p className="text-white text-xxs sm:text-[11px] font-bold ">This trait is still on-chain.</p>
                  <button
                      onClick={() => onImport(data)}
                      className="h-[44px] rounded-full bg-primary-btn leading-tight sm:p-2 p-1 text-xxs sm:text-sm font-bold uppercase enabled:hover:bg-primary-btn-disabled enabled:active:scale-95 text-black ease-linear"
                    >
                      burn to import
                    </button>
                </div> : ""}
                
                {/* Inventory - added item to cart, grey out rest of the trait type */}
                {inventory && checkTrait(data) ? 
                <div className="flex p-2 absolute  flex-col justify-center bg-[rgba(38,32,2,0.5)] items-center gap-y-2 top-0 w-full h-full bottom-0 left-0 right-0 z-20">
                </div>
                : ""
                }
                
                {/* SOLD OUT CASE */}
                <a
                  href={data.link}
                  className={` ${
                    checkSoldOut(data.stock, data.maxQuantity) ? "flex" : "hidden"
                  } absolute top-0 h-full w-full items-center justify-center bg-black opacity-80 z-50`}
                >
                  <p className="text-[11px] text-white">
                    <b className="text-base">SOLD OUT</b>
                    <br />
                    Find on secondary
                  </p>
                </a>
                {/* LOCKED TRAIT */}
                <div className={` ${ checkLocked(data.requiredTraits) && !checkSoldOut(data.stock, data.maxQuantity) ? "block" : "hidden" } peer absolute top-2 right-2 z-50 cursor-pointer`}>
                  <img src={lock} alt="locked" className="sm:w-auto w-[15px]" />
                </div>
                <div
                  className={` absolute top-2 left-2 sm:top-3 sm:left-4 hidden h-5/6 w-5/6 flex-col items-center z-30 justify-center rounded sm:rounded-xl bg-[#FF6363] peer-hover:flex `}
                >
                  <p className="text-[8px] sm:text-[11px] text-white">
                    <b>TRAIT-GATED</b>
                    <br />
                    Hold one of these traits to unlock:
                  </p>
                  <ul className=" text-[8px] sm:text-[11px] text-white">
                    {data.requiredTraits.map((point, index) => (
                      <li key={index} className=" capitalize" >- {point}</li>
                    ))}
                  </ul>
                </div>
              </button>
              : ""
          ) )}

        </div>
      </div>
    </div>
  );
};

export default Tabs;
