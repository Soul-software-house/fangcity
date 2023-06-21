import React, { useState, useEffect, useCallback } from "react";
import { useGlobalState } from "../../App";
// import { Toggle } from "../Toggle";
import axios from "axios";


import { Modal } from "../Modal";
import Tabs from "../Tabs";

import pixlfang from "../../assets/images/store/SuperPxlFangster_Pre_Reveal.gif";
import selectFangsterIcon from "../../assets/images/store/SelectFangster.svg";
import traitStore from '../../assets/images/store/storeIcon.svg'
import remove from "../../assets/images/store/Remove.svg";
import silhouette from "../../assets/images/store/placeholder.svg";
import silhouetteNE from '../../assets/images/store/Placeholder_NE.svg'
import Add from "../../assets/images/store/Add.svg";
import shoppingCartIcon from '../../assets/images/store/shoppingCartIcon.svg'

import { inventory, series, allSeries } from "../../constants";
import ShoppingCart from "../ShoppingCart";
import Load from "../Load";
// import Load from "../Load";

export const TraitInventory = () => {
  const [, setModal] = useGlobalState("modal");
  const [, setConfirm] = useGlobalState("confirm");
  const [openPanel, setOpenPanel] = useState(false)
  const [selectedTrait, setSelectedTrait] = useState(null);
  const [seriesSelected, setSeriesSelected] = useState();
  const [, setGlobalTrait] = useGlobalState("selectedTrait")
  const [globalSelection, setGlobalSelection] = useGlobalState("selections")
  const [globalFangster, setGlobalFangster] = useGlobalState("selectedFangster")
  const everyTrait = [...series, allSeries]
  const [onAddToCart, setOnAddToCart] = useState(false)
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false)
  const [,setCombined] = useGlobalState("combinedImgInventory")
  const baseURL = "https://fangcityimagegen.herokuapp.com/api/generateimage/token";
  const [globalPanel, setGlobalPanel] = useGlobalState("selectFangsterPanel")

  const fetchTraits = useCallback(() => {
    // Get latest traits in cart + selected trait
    const temp = [selectedTrait, ...globalSelection].filter(n => n);
    const head = temp.find(t => t.type === "head");
    const body = temp.find(t => t.type === "body");
    const fur = temp.find(t => t.type === "fur");
    const face = temp.find(t => t.type === "face");
    const background = temp.find(t => t.type === "background");
    const item = temp.find(t => t.type === "items");
    const result = [head, body, fur, face, background, item].filter(n => n);
    console.log(result)
    return result;
  }, [globalSelection, selectedTrait]);

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

  function onConfirmChange() {
    setConfirm("change")
    setGlobalSelection(globalSelection)
    setGlobalFangster(globalFangster)
  }

  function onClickMint() {
    setConfirm("mint")
    setGlobalTrait(selectedTrait)
  }

  function elementCount(arr, element) {
    // console.log(arr.filter((currentElement) => currentElement === element).length)
    return arr.filter((currentElement) => currentElement === element).length;
  };

  function addToBasket(item) {
    // console.log("add to basket");
    // if (globalSelection.indexOf(item) !== -1) {
    //   return null;
    // } else {
    //   setGlobalSelection(globalSelection => [item, ...globalSelection]);
    //   // console.log(shoppingCart);
    // }
    if (globalSelection.indexOf(item) !== -1 ){
      return null
    } else if (elementCount(globalSelection, item) === 0) {
      item.quantity = 1;
      setGlobalSelection(globalSelection => [item, ...globalSelection]);
      item.totalMint = item.totalMint -1
      // console.log(shoppingCart)
      return null;
    } else {
      globalSelection[globalSelection.indexOf(item)].quantity++;
      var res = Array.from(new Set(globalSelection))
      setGlobalSelection([...res]);
      // console.log(res);
      item.totalMint = item.totalMint -1
    }
  }
  
  function checkChanges(array) {
    let result = array.map(a => a.type);
    // console.log((new Set(result)).size !== array.length)
    return (new Set(result)).size !== array.length;
    
  }

  function removeTrait(item) {
    var array = [...globalSelection];
    var index = array.indexOf(item);
    if (item.quantity > 1){
      item.quantity--;
      item.totalMint = item.totalMint + 1
      var res = Array.from(new Set(globalSelection))
      setGlobalSelection([...res]);
    }else if (index !== -1) {
      item.totalMint = item.totalMint + 1
      array.splice(index, 1);
      setGlobalSelection(array);
      console.log("Item removed!" + globalSelection);
    }
  }


  function selectNFT(item) {
    setGlobalFangster(item);
    setOpenPanel(false);
  }

  const rarityColor = item => {
    // console.log(item.rarity)
    let rarity = (item && item.rarity) || "";
    switch (rarity.toLowerCase()) {
      case "common":
        return "text-[#FFA4EF]";
      case "uncommon":
        return "text-[#A9EFC6]";
      case "rare":
        return "text-[#76D8F9]";
      case "legendary":
        return "text-[#FFC657]";
      case "oneone":
        return "text-[#FF6363]";
      default:
        return "text-[#FFA4EF]";
    }
  };

  function sortAZ(data) {
    return [...data].sort((a, b) =>
    a.name > b.name ? 1 : -1,
  );
  }

  const NewSeries = ({item}) => {
    // Sort by date
    var newest = [...item].sort((a, b) => a.upload - b.upload).slice(0,3);
    // console.log(newest)
    // Sort A-Z
    const newSeriesAZ = sortAZ(newest);

    return (
      <div className="flex flex-col auto">
        <h1 className="text-left text-2xl font-bold text-white">New Series</h1>
        <div  className="flex h-auto sm:flex-wrap gap-2">
          {newSeriesAZ.map((data, index) => (
              <button
                key={index}
                onClick={() => setSeriesSelected(data.name)}
                className="sm:h-[150px] h-[110px] w-[95px] sm:w-[127px] shrink-0 rounded-lg bg-purple-darkest px-1 pt-1 pb-2"
              >
                <img src={data.coverImg} alt={data.name} className=" rounded-lg" />
                <p className="mt-1 text-xxs sm:text-xs font-bold uppercase text-white">{data.name}</p>
              </button>

          ))}
        </div>
      </div>
      
      
    );
  };

  const SeriesAZ = ({item}) => {
    // Sort Array
    const sorted = sortAZ(item)
    var letters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const azArray = letters.split("")
    // console.log(azArray)

    return (
      <>
        {sorted.map((data) => (
          <div className="h-auto">
            {azArray.map((az, index) => (
              <>
              { az === data.name[0].toUpperCase() ?
                <>
                <h1 className="text-white font-bold text-2xl text-left">{az}</h1>
                <div key={index} className="flex flex-wrap gap-2">
                      <button
                        // key={index}
                        onClick={() => setSeriesSelected(data.name)}
                        className="sm:h-[150px] h-[110px] w-[95px] sm:w-[127px] shrink-0 rounded-lg bg-purple-darkest px-1 pt-1 pb-2"
                      >
                        <img src={data.coverImg} alt={data.name} className=" rounded-lg" />
                        <p className="mt-1 text-xxs sm:text-xs font-bold uppercase text-white">{data.name}</p>
                      </button>
                </div>
                </>
                : ""
              }
              </>
            ))}
          </div>
        ))
        }
        {/* <h1 className="text-white font-bold text-2xl text-left">A</h1>
        <div  className="flex flex-wrap gap-2">
            <button
              key={index}
              onClick={() => setSeriesSelected(data.name)}
              className="h-[150x] w-[127px] shrink-0 rounded-lg bg-purple-darkest px-1 pt-1 pb-2"
            >
              <img src={data.coverImg} alt={data.name} className="h-[120px] w-[120px] rounded-lg" />
              <p className="mt-1 text-xs font-bold uppercase text-white">{data.name}</p>
            </button>
      </div> */}
    </>
    )
  };

  function setFangsterPanel(){
    console.log(window.innerWidth)
    if (window.innerWidth < 640 ){
      setGlobalPanel(true)
      setConfirm("selectFangsterPanel")
    } else setOpenPanel(!openPanel);
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const res = await axios.post(baseURL, {
          integerInput: globalFangster && globalFangster.id,
          objectList: fetchTraits()
      })
      // console.log(res.data)
      setLoading(false)
      setPost(res.data)
      setCombined(`data:image/png;base64,${res && res.data.base64Image}`)

    }
    fetchData();
  }, [fetchTraits, globalFangster, setCombined]);

  useEffect(() => {
    // setGlobalCart(shoppingCart)
    setOnAddToCart(true)
    setTimeout(() => {
      setOnAddToCart(false)
    }, 1000);
    
  }, [globalSelection])

  return (
    <Modal title="Trait Inventory" modal="traitinventory">
      {/* Main Panel */}
      <div className="flex max-h-[calc(100%-6rem)] h-full w-auto flex-col items-center lg:justify-between gap-2 lg:items-start lg:flex-row">
        {/* Left panel */}
        <div className="flex h-[210px] sm:h-[270px] lg:h-auto w-full lg:w-auto gap-1 sm:gap-4 justify-between flex-row-reverse lg:flex-col order-first ">
          {/* Buttons  */}
          <div className=" flex w-full lg:w-auto flex-col justify-between shrink">
            <button
              onClick={() => setModal("traitstore")}
              className="flex h-[55px] w-full lg:w-[270px] text-left items-center justify-start rounded-[21px] bg-secondary-btn py-2 px-3 text-xs sm:text-sm font-bold uppercase text-white ease-in hover:bg-[#FFC657] active:scale-95"
            >
              <img className=" mr-2 max-w-[25px] sm:max-w-[46px]" src={traitStore} alt="inventory icon" />
              <span>TRAIT STORE</span>
            </button>
            <button
              onClick={() => setFangsterPanel()}
              className={`${
                globalPanel ? "bg-[#FFC657]" : "bg-secondary-btn"
              } mt-3 flex sm:hidden h-[55px] w-full text-left items-center justify-start rounded-[21px] py-2 pr-1 pl-3 text-xs font-bold uppercase text-white ease-linear hover:bg-[#FFC657] active:scale-95 lg:w-[270px] sm:px-4 sm:text-sm`}
            >
              <img className=" mr-2 max-w-[25px] sm:max-w-[46px]" src={selectFangsterIcon} alt="inventory icon" />
              <span>Select PxlFangster</span>
            </button>
            <button
              onClick={() => setOpenPanel(!openPanel)}
              className={`${
                openPanel ? "bg-[#FFC657]" : "bg-secondary-btn"
              } mt-3 hidden sm:flex h-[55px] w-full text-left items-center justify-start rounded-[21px] py-2 pr-1 pl-3 text-xs font-bold uppercase text-white ease-linear hover:bg-[#FFC657] active:scale-95 lg:w-[270px] sm:px-4 sm:text-sm`}
            >
              <img className=" mr-2 max-w-[25px] sm:max-w-[46px]" src={selectFangsterIcon} alt="inventory icon" />
              <span>Select PxlFangster</span>
            </button>
            <button
              onClick={() => setConfirm("selection")}
              className={` mt-3 bg-secondary-btn ${ onAddToCart ? "animate-shaking" : '' } lg:hidden text-left flex h-[55px] w-full lg:w-[270px] items-center justify-start rounded-[21px] py-2 pr-2 pl-3 sm:px-4 text-xs sm:text-sm font-bold uppercase text-white ease-linear hover:bg-[#FFC657] active:scale-95`}
            >
              <img className=" mr-2 max-w-[25px] sm:max-w-[46px]" src={shoppingCartIcon} alt="inventory icon" />
              <span>Your Selection</span>
            </button>
          </div>

          {/* PxlFangster Photo */}
          <div className={` relative mb-6 h-[210px] sm:h-[270px] w-[210px] sm:w-[270px] shrink-0 flex sm:${openPanel ? "hidden" : "flex"}`}>
            <div className="absolute -top-7 lg:top-auto lg:-bottom-6 flex h-[50px] w-2/3 lg:w-[200px] items-center justify-center rounded-t-xl lg:rounded-t-none lg:rounded-b-3xl bg-content-bg">
              <p className="h-full pt-2 text-xs font-semibold leading-tight text-white lg:pt-6 sm:text-[18px]">
                {globalFangster ? `PxlFangster #${globalFangster && globalFangster["id"]}` : "Select a PxlFangster"}
              </p>
            </div>
            <img
              className="z-10 sm:mt-0 h-full w-full rounded-3xl border-8 border-content-bg"
              src={globalFangster != null  && !loading ? `data:image/png;base64,${post && post.base64Image}` : pixlfang}
              alt="select pxlfang"
            />
             {loading ? (
              <div className=" z-20 absolute opacity-75 bg-black  h-full w-full rounded-3xl border-8 border-content-bg sm:mt-0">
                <Load />
              </div>
            ) : (
              <div className=" z-5 absolute bg-black  h-full w-full rounded-3xl border-8 border-content-bg sm:mt-0">
               
              </div>
            ) }
          </div>

          {/* PxlFangster select panel */}
          <div
            className={` h-[180px] lg:h-[423px] w-[160px] shrink-0 sm:h-[270px] sm:w-full scrollbar overflow-y-auto flex-wrap overflow-x-hidden max-w-[270px] bg-content-bg  ${
              openPanel ? "flex" : "hidden"
            }  gap-1 rounded-3xl p-2 sm:p-3 content-start`}
          >
             <button
                onClick={() => {setGlobalFangster(null);setOpenPanel(false);}}
                className="relative z-10 h-[60px] w-[60px] sm:h-[75px] sm:w-[75px] overflow-clip rounded-lg border-2 bg-[rgba(0,0,0,0.5)] border-purple-light"
              >
                <p className=" text-white font-bold">NONE</p>
            </button>
            {/* Invalid cases - oneOne to check for 1/1 and pxlchip to check for applied chip  */}
            {inventory.length !== 0 ? (inventory && inventory.map((item, index) => (
              <button
                key={index}
                onClick={() => selectNFT(item)}
                className="relative z-10 h-[60px] w-[60px] sm:h-[75px] sm:w-[75px] overflow-clip rounded-lg border-2 border-purple-light"
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
                    Apply a Super PxlChip first!
                  </p>
                </div>
                <img className="z-0" src={item.img} alt="NFT" />
              </button>
            ))) : 
            <div className="relative z-10 w-full h-full gap-4">
              <p className="text-sm font-bold uppercase text-white">
              No pixel fangs found! <br/>
              </p>
              <button className="h-[44px] max-w-[132px] rounded-full bg-purple-darkest py-2 px-4 text-sm font-bold uppercase text-white ease-linear hover:scale-105 active:scale-95">
                <a href="https://opensea.io/collection/pxlfangs">
                buy now
                </a>
                
              </button>
            </div>
            }
          </div>
        </div>

      {/* Middle Panel */}
        {/* SERIES PANEL */}

          
          {!seriesSelected || !globalFangster ? (
          <div className={`scrollbar flex sm:flex-col relative sm:h-[563px] lg:order-none order-last min-w-[270px] lg:shrink-0 w-full sm:w-[580px] gap-[0.3rem] ${globalFangster ? "overflow-x-auto sm:overflow-y-auto" : "overflow-clip" }   rounded-3xl bg-content-bg p-2 sm:py-4 sm:pr-0 sm:pl-4`}>
            { globalFangster ? "" : (
              <div className="absolute flex top-0 left-0 bottom-0 right-0 h-full w-full bg-[rgba(38,32,2,0.5)] justify-center items-center overflow-clip">
                <p className="text-white font-bold text-3xl">Select a PxlFangster first</p>
              </div>
            )}
            {/* Map New Series - MAX 3 */}
            <NewSeries item={series} />
            <SeriesAZ item={everyTrait} />
          </div>
          ) : (
          <div className=" order-last relative flex-col h-full min-h-0 flex w-full items-stretch max-w-[580px] lg:order-none">
            <Tabs back={setSeriesSelected} inventory={true} store={false} cart={globalSelection} selectedTrait={setSelectedTrait} series={seriesSelected} />
            <p className="hidden absolute sm:block -bottom-9 text-[10px] font-normal text-white text-left px-4 pt-2">If you minted a trait as an NFT or bought one on a secondary market, before you can apply it to a Super PxlFangster, import it to your inventory by burning the NFT. All traits are minted on Polygon.</p>
          </div>
        )}
        

        {/* Right panel */}
        <div className="flex lg:w-auto w-full flex-col">
          {/* Trait details */}
          <div className="w-full lg:max-w-[270px] h-[122px] sm:h-[147px] rounded-2xl  bg-content-bg py-2 px-4">
            <h2 className="w-full hidden sm:block text-left text-[11px] uppercase font-bold text-white">Trait details</h2>
            <div className="mt-2 flex gap-3">
              <div className="relative flex h-[82px] w-[82px] shrink-0 overflow-clip rounded-lg bg-[#E1C9FF]">
                <img
                  src={testNE(selectedTrait && selectedTrait.name) ?  silhouetteNE : silhouette}
                  alt="silhouette"
                  className={`top-0 z-0 h-[82px]  w-[82px] ${selectedTrait ? "block" : "hidden"} `}
                />
                <img
                  src={selectedTrait ? selectedTrait && selectedTrait.img : pixlfang}
                  alt="traitImg"
                  className="absolute top-0 z-10  w-[82px] "
                />
              </div>

              <div className="inline-block w-full text-left">
                <h3 className="text-base font-bold text-white line-clamp-2 leading-[20px]">
                  {selectedTrait ? selectedTrait && selectedTrait.name : "No Trait Selected"}
                </h3>
                <hr className="w-full" />
                <div className={` ${selectedTrait ? "flex" : "hidden"} justify-between gap-3`}>
                  <div>
                    <p className={` text-base font-bold capitalize ${rarityColor(selectedTrait && selectedTrait)}`}>
                      {selectedTrait ? (selectedTrait.rarity === "oneone" ? '1/1' : selectedTrait.rarity) : null}
                    </p>
                    <p className="text-[11px] font-light text-white">
                      You own: {selectedTrait && selectedTrait.totalMint}/{selectedTrait && selectedTrait.supply}{" "}
                    </p>
                  </div>
                  <div className=" mt-2 lg:hidden flex justify-end align-middle">
                    <button className="mr-2 shrink-0 p-2 bg-primary-btn rounded-full" onMouseDown={() => onClickMint()} disabled={!selectedTrait}>
                      <p className=" text-xxs font-bold text-black uppercase">mint as nft</p>
                    </button>
                    <button className="mr-2 shrink-0" onMouseDown={() => addToBasket(selectedTrait)}>
                      <img src={Add} alt="add" />
                    </button>
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-2 lg:flex justify-between hidden   ">
            <button
              onMouseDown={() => onClickMint()}
              disabled={!selectedTrait}
              className="h-[44px] mt-1 hidden sm:block rounded-full bg-primary-btn py-3 px-4 text-xs font-bold uppercase enabled:hover:scale-105 enabled:active:scale-95 text-black disabled:text-opacity-50 disabled:bg-primary-btn-disabled ease-linear"
            >
              MINT AS NFT
            </button>
            <button 
              onMouseDown={() => addToBasket(selectedTrait)}
              disabled={!selectedTrait}
              className={`h-[44px] mt-1 hidden sm:block rounded-full bg-primary-btn py-3 px-4 text-xs font-bold uppercase enabled:hover:scale-105 enabled:active:scale-95 text-black disabled:text-opacity-50 disabled:bg-primary-btn-disabled ease-linear `}
            >
              ADD TO SELECTION
            </button>
          </div>

          {/* Shopping Cart */}
          <div className="lg:block hidden">
            <ShoppingCart 
              title="Your Selection" inventory={true}
              shoppingCart={globalSelection} 
              testNE={testNE} silhouetteNE={silhouetteNE} silhouette={silhouette} toggleState={false} remove={remove} removeTrait={removeTrait} />
            <div className="mt-2 flex justify-center self-end sm:justify-end ">
              <button
              disabled={globalSelection.length === 0 ? true : false || checkChanges(globalSelection)}
                onClick={() => onConfirmChange()}
                className="h-[44px] mt-auto rounded-full bg-primary-btn py-3 px-5 text-xs font-bold text-black uppercase enabled:hover:scale-105 enabled:active:scale-95  disabled:text-opacity-50 disabled:bg-primary-btn-disabled  ease-linear"
              >
                confirm changes
              </button>
          </div>
          
          </div>
        </div>
      </div>
    </Modal> 
  );
};
