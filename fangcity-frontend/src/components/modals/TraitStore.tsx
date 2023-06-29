import React, { useCallback, useEffect, useState } from "react";
import { useGlobalState } from "../../App";
import { Toggle } from "../Toggle";
import { add } from "mathjs";
import axios from "axios";

import { Modal } from "../Modal";
import Tabs from "../Tabs";
import { XIcon } from "@heroicons/react/outline";

import pixlfang from "../../assets/images/store/SuperPxlFangster_Pre_Reveal.gif";
import selectFangsterIcon from "../../assets/images/store/SelectFangster.svg";
import traitInventory from "../../assets/images/store/InventoryIcon.svg";
import Add from "../../assets/images/store/Add.svg";
import remove from "../../assets/images/store/Remove.svg";
import silhouette from "../../assets/images/store/placeholder.svg";
import silhouetteNE from "../../assets/images/store/Placeholder_NE.svg";
import shoppingCartIcon from "../../assets/images/store/shoppingCartIcon.svg";

import { inventory, series, allSeries } from "../../constants";
import ShoppingCart from "../ShoppingCart";
import Load from "../Load";

import { getStrapiURL } from "../../utils/Strapi";
import { getStrapiSerie } from "../../utils/StrapiParser";

export const TraitStore = () => {
  const [, setModal] = useGlobalState("modal");
  const [confirm, setConfirm] = useGlobalState("confirm");
  const [currency, setCurrency] = useGlobalState("currency");
  const [toggleState, setToggleState] = useGlobalState("toggleState");
  const [selectFangsterPanel, setSelectFangsterPanel] = useState(false);
  const [selectedTrait, setSelectedTrait] = useState(null);
  const [seriesSelected, setSeriesSelected] = useState();
  const [shoppingCart] = useState([]);
  const [globalCart, setGlobalCart] = useGlobalState("shoppingCart");
  const [globalFangster, setGlobalFangster] = useGlobalState("selectedFangster");
  const everyTrait = [...series, allSeries];
  const [onAddToCart, setOnAddToCart] = useState(false);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [, setCombined] = useGlobalState("combinedImgStore");
  const baseURL = "https://fangcityimagegen.herokuapp.com/api/generateimage/token";
  const [, setGlobalPanel] = useGlobalState("selectFangsterPanel");

  // Fetch Strapi
  const [traits, setTraits] = useState(null);
  const [serie, setSeries] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseTraits = await axios.get(`${getStrapiURL("/api/traits?populate=layer.*,series.image.*")}`);
        const responseSeries = await axios.get(`${getStrapiURL("/api/series?populate=image.*&sort=createdAt:desc")}`);

        if (responseTraits.status === 200) {
          console.log("Strapi Traits:", responseTraits.data);
          setTraits(responseTraits.data);
          
        } else {
          console.log("Error fetching traits from Strapi", responseTraits.status);
        }


        if (responseSeries.status === 200) {  
          console.log("Strapi Series:", responseSeries.data);
          const strapiResponse = getStrapiSerie(responseSeries.data.data);
          // console.log("Strapi Series:", strapiResponse);
          setSeries(strapiResponse);
        } else {
          console.log("Error fetching series from Strapi", responseSeries.status);
        }
      } catch (error) {
        console.error("Error fetching data from Strapi:", error);
      }
    };

    fetchData();
  }, []);
  

  const fetchTraits = useCallback(() => {
    // Get latest traits in cart + selected trait
    const temp = [selectedTrait, ...globalCart].filter(n => n);
    const head = temp.find(t => t.type === "head");
    const body = temp.find(t => t.type === "body");
    const fur = temp.find(t => t.type === "fur");
    const face = temp.find(t => t.type === "face");
    const background = temp.find(t => t.type === "background");
    const item = temp.find(t => t.type === "items");
    const result = [head, body, fur, face, background, item].filter(n => n);
    console.log("result", result);
    return result;
  }, [globalCart, selectedTrait]);

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

  function onClickApply() {
    setConfirm("apply");
    setGlobalCart(globalCart);
    setGlobalFangster(globalFangster);

    // ADD TO GLOBAL INVENTORY
    // console.log(globalCart)
  }

  function onClickStore() {
    setConfirm("buy");
    setGlobalCart(globalCart);
  }

  function elementCount(arr, element) {
    // console.log(arr.filter((currentElement) => currentElement === element).length)
    return arr.filter(currentElement => currentElement === element).length;
  }

  function checkApply(array) {
    let result = array.map(a => a.type);
    // console.log(result)
    return new Set(result).size !== array.length;
  }

  function checkQuantity(array) {
    let result = array.filter(item => item.quantity > 1);
    console.log(result);
    if (result.length === 0) {
      return false;
    } else {
      return true;
    }
  }

  function addToBasket(item) {
    // console.log("add to basket");
    if (item.totalMint < 1) {
      return null;
    } else if (elementCount(globalCart, item) === 0) {
      item.quantity = 1;
      setGlobalCart(globalCart => [item, ...globalCart]);
      item.totalMint = item.totalMint - 1;
      // console.log(shoppingCart)
      return null;
    } else {
      globalCart[globalCart.indexOf(item)].quantity++;
      var res = Array.from(new Set(globalCart));
      setGlobalCart([...res]);
      // console.log(res);
      item.totalMint = item.totalMint - 1;
    }
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

  function removeTrait(item) {
    var array = [...globalCart];
    var index = array.indexOf(item);
    if (item.quantity > 1) {
      item.quantity--;
      item.totalMint = item.totalMint + 1;
      var res = Array.from(new Set(globalCart));
      setGlobalCart([...res]);
    } else if (index !== -1) {
      item.totalMint = item.totalMint + 1;
      array.splice(index, 1);
      setGlobalCart(array);
      // console.log("Item removed!" + shoppingCart);
    }
  }

  function price(item) {
    if (toggleState) {
      // let ETH = item.priceETH *1000
      return item.priceETH;
      // console.log(item.priceAWOO)
    } else {
      return item.priceAWOO;
      // console.log(totalPrice)
    }
  }

  function selectNFT(item) {
    setGlobalFangster(item);
    setSelectFangsterPanel(false);
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
    return [...data].sort((a, b) => (a.name > b.name ? 1 : -1));
  }

  const NewSeries = ({ item }) => {
    // Sort by date
    var newest = [...item].slice(0, 3);
    // console.log(newest)
    // Sort A-Z
    const newSeriesAZ = sortAZ(newest);

    return (
      <div className="auto flex flex-col">
        <h1 className="text-left text-2xl font-bold text-white">New Series</h1>
        <div className="flex h-auto gap-2 sm:flex-wrap">
          {newSeriesAZ.map((data, index) => (
            <button
              key={index}
              onClick={() => setSeriesSelected(data.name)}
              className="h-[110px] w-[95px] shrink-0 rounded-lg bg-purple-darkest px-1 pt-1 pb-2 sm:h-[150px] sm:w-[127px]"
            >
              <img src={`${getStrapiURL(data.imageUrl)}`} alt={data.name} className=" rounded-lg" />
              <p className="mt-1 text-xxs font-bold uppercase text-white sm:text-xs">{data.name}</p>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const SeriesAZ = ({ item }) => {
    // Sort Array
    const sorted = sortAZ(item);
    var letters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const azArray = letters.split("");
    // console.log(azArray)

    return (
      <>
        {sorted.map(data => (
          <div className="h-auto">
            {azArray.map((az, index) => (
              <>
                {az === data.name[0].toUpperCase() ? (
                  <>
                    <h1 className="text-left text-2xl font-bold text-white">{az}</h1>
                    <div key={index} className="flex gap-2 sm:flex-wrap">
                      <button
                        // key={index}
                        onClick={() => setSeriesSelected(data.name)}
                        className="h-[110px] w-[95px] shrink-0 rounded-lg bg-purple-darkest px-1 pt-1 pb-2 sm:h-[150px] sm:w-[127px]"
                      >
                        <img src={`${getStrapiURL(data.imageUrl)}`} alt={data.name} className="rounded-lg" />
                        <p className="mt-1 text-xxs font-bold uppercase text-white sm:text-xs">{data.name}</p>
                      </button>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </>
            ))}
          </div>
        ))}
      </>
    );
  };

  function setFangsterPanel() {
    // console.log(window.innerWidth)
    if (window.innerWidth < 640) {
      setGlobalPanel(true);
      setConfirm("selectFangsterPanel");
    } else setSelectFangsterPanel(!selectFangsterPanel);
  }

  useEffect(() => {
    // setGlobalCart(shoppingCart)
    setOnAddToCart(true);
    setTimeout(() => {
      setOnAddToCart(false);
    }, 1000);
  }, [globalCart]);

  useEffect(() => {
    if (!toggleState) {
      setCurrency("AWOO");
      // console.log(toggleState);
    } else {
      setCurrency("ETH");
      // console.log(toggleState);
    }
  }, [toggleState, setCurrency]);

  useEffect(() => {
    // console.log(globalFangster.id)
    async function fetchData() {
      setLoading(true);
      const res = await axios.post(baseURL, {
        integerInput: globalFangster && globalFangster.id,
        objectList: fetchTraits(),
      });
      // console.log(res.data)
      setLoading(false);
      setPost(res.data);
      setCombined(`data:image/png;base64,${res && res.data.base64Image}`);
    }

    fetchData();
  }, [fetchTraits, globalFangster, setCombined]);



  return (
    <Modal title="Trait Store" modal="traitstore">
      {/* Currency Switch */}
      <div className="-mt-[26px] flex w-auto justify-end">
        <Toggle label="ETH" label2="AWOO" toggled={toggleState} onClick={() => setToggleState(!toggleState)} />
      </div>
      {/* Main Panel */}
      <div className="flex h-auto max-h-[calc(100%-6rem)] w-auto flex-col items-center gap-2 lg:flex-row lg:items-start lg:justify-between">
        {/* Left panel */}
        <div className="order-first flex h-[210px] w-full flex-row-reverse justify-between gap-1 sm:h-[270px] sm:gap-4 lg:h-auto lg:w-auto lg:flex-col">
          {/* Buttons  */}
          <div className=" flex w-full shrink flex-col justify-between">
            <button
              onClick={() => setModal("traitinventory")}
              className="flex h-[55px] w-full items-center justify-start rounded-[21px] bg-secondary-btn py-2 pr-2 pl-3 text-left text-xs font-bold uppercase text-white ease-in hover:bg-[#FFC657] active:scale-95 sm:px-4 sm:text-sm lg:w-[270px]"
            >
              <img className=" mr-2 max-w-[25px] sm:max-w-[46px]" src={traitInventory} alt="inventory icon" />
              <span>TRAIT INVENTORY</span>
            </button>

            <button
              onClick={() => setSelectFangsterPanel(!selectFangsterPanel)}
              className={`${
                selectFangsterPanel ? "bg-[#FFC657]" : "bg-secondary-btn"
              } mt-3 hidden h-[55px] w-full items-center justify-start rounded-[21px] py-2 pr-1 pl-3 text-left text-xs font-bold uppercase text-white ease-linear hover:bg-[#FFC657] active:scale-95 sm:flex sm:px-4 sm:text-sm lg:w-[270px]`}
            >
              <img className=" mr-2 max-w-[25px] sm:max-w-[46px]" src={selectFangsterIcon} alt="inventory icon" />
              <span>Select PxlFangster</span>
            </button>
            <button
              onClick={() => setFangsterPanel()}
              className={`${
                confirm === "selectFangsterPanel" ? "bg-[#FFC657]" : "bg-secondary-btn"
              } mt-3 flex h-[55px] w-full items-center justify-start rounded-[21px] py-2 pr-1 pl-3 text-left text-xs font-bold uppercase text-white ease-linear hover:bg-[#FFC657] active:scale-95 sm:hidden sm:px-4 sm:text-sm lg:w-[270px]`}
            >
              <img className=" mr-2 max-w-[25px] sm:max-w-[46px]" src={selectFangsterIcon} alt="inventory icon" />
              <span>Select PxlFangster</span>
            </button>
            <button
              onClick={() => setConfirm("cart")}
              className={` mt-3 bg-secondary-btn ${
                onAddToCart ? "animate-shaking" : ""
              } flex h-[55px] w-full items-center justify-start rounded-[21px] py-2 pr-2 pl-3 text-left text-xs font-bold uppercase text-white ease-linear hover:bg-[#FFC657] active:scale-95 sm:px-4 sm:text-sm lg:hidden lg:w-[270px]`}
            >
              <img className=" mr-2 max-w-[25px] sm:max-w-[46px]" src={shoppingCartIcon} alt="inventory icon" />
              <span>Shopping cart</span>
            </button>
          </div>

          {/* PxlFangster Photo */}
          <div
            className={` relative mb-6 flex h-[210px] w-[210px] shrink-0 sm:h-[270px] sm:w-[270px] sm:${
              selectFangsterPanel ? "hidden" : "flex"
            }`}
          >
            <div className="absolute -top-7 flex h-[50px] w-2/3 items-center justify-center rounded-t-xl bg-content-bg lg:top-auto lg:-bottom-6 lg:w-[200px] lg:rounded-t-none lg:rounded-b-3xl">
              <p className="h-full pt-2 text-xs font-semibold leading-tight text-white sm:text-[18px] lg:pt-6">
                {globalFangster ? `PxlFangster #${globalFangster && globalFangster["id"]}` : "Select a PxlFangster"}
              </p>
            </div>
            <img
              className="z-10  h-full w-full rounded-3xl border-8 border-content-bg sm:mt-0"
              src={globalFangster != null && !loading ? `data:image/png;base64,${post && post.base64Image}` : pixlfang}
              alt="select pxlfang"
            />
            {loading ? (
              <div className=" absolute z-20 h-full w-full  rounded-3xl border-8 border-content-bg bg-black opacity-75 sm:mt-0">
                <Load />
              </div>
            ) : (
              <div className=" z-5 absolute h-full  w-full rounded-3xl border-8 border-content-bg bg-black sm:mt-0"></div>
            )}
          </div>

          {/* PxlFangster select panel */}
          <div
            className={` scrollbar h-[180px] w-[160px] max-w-[270px] shrink-0 flex-wrap overflow-y-auto overflow-x-hidden bg-content-bg sm:h-[270px] sm:w-full lg:h-[423px] ${
              selectFangsterPanel ? "flex" : "hidden"
            }  content-start gap-1 rounded-3xl p-2 sm:p-3`}
          >
            <button
              onClick={() => {
                setGlobalFangster(null);
                setSelectFangsterPanel(false);
              }}
              className="relative z-10 h-[60px] w-[60px] shrink-0 overflow-clip rounded-lg border-2 border-purple-light bg-[rgba(0,0,0,0.5)] sm:h-[75px] sm:w-[75px]"
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
                  className="relative z-10 h-[60px] w-[60px] shrink-0 overflow-clip rounded-lg border-2 border-purple-light sm:h-[75px] sm:w-[75px]"
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
        </div>

        {/* Middle Panel */}
        {/* SERIES PANEL */}

        {!seriesSelected ? (
          <div className="scrollbar order-last flex h-full min-h-[180px] w-full min-w-[270px] flex-row gap-[0.3rem] overflow-x-auto rounded-3xl bg-content-bg px-2 pt-2 pb-2 sm:max-h-[563px] sm:min-h-0 sm:w-[580px] sm:flex-col sm:overflow-y-auto sm:py-4 sm:pr-0 sm:pl-4 lg:order-none lg:mt-0 lg:h-full lg:flex-auto lg:flex-shrink-0">
            {/* Map New Series - MAX 3 */}
            <NewSeries item={serie} />
            <SeriesAZ item={serie} />
          </div>
        ) : (
          <div className=" order-last flex h-full min-h-0 w-full max-w-[580px] items-stretch lg:order-none ">
            <Tabs
              back={setSeriesSelected}
              cart={shoppingCart}
              inventory={false}
              store={true}
              selectedTrait={setSelectedTrait}
              series={seriesSelected}
            />
          </div>
        )}

        {/* Right panel */}
        <div className="flex w-full flex-none flex-col lg:w-auto ">
          {/* Trait details */}
          <div className="h-[122px] w-full rounded-2xl bg-content-bg py-2 px-4 sm:h-[147px] lg:max-w-[270px]">
            <h2 className="hidden w-full text-left text-[11px] font-bold uppercase text-white sm:block">
              Trait details
            </h2>
            <div className="mt-2 flex gap-3">
              <div className="relative flex h-[82px] w-[82px] shrink-0 overflow-clip rounded-lg bg-[#E1C9FF]">
                <div className="absolute top-0 right-0 block pt-4 pr-4">
                  <button
                    type="button"
                    className="rounded-md text-slate-300 hover:text-white focus:outline-none"
                    onClick={() => setSelectedTrait(null)}
                  >
                    <XIcon className="h-8 w-8" />
                  </button>
                </div>
                <img
                  src={testNE(selectedTrait && selectedTrait.name) ? silhouetteNE : silhouette}
                  alt="silhouette"
                  className={`top-0 z-10 h-[82px]  w-[82px] ${selectedTrait ? "block" : "hidden"} `}
                />
                <img
                  src={selectedTrait ? selectedTrait && selectedTrait.img : pixlfang}
                  alt="traitImg"
                  className={`absolute top-0 w-[82px] ${
                    selectedTrait && selectedTrait.type === "background" ? "z-0" : "z-20"
                  }`}
                />
              </div>

              <div className="inline-block w-full text-left">
                <h3 className="text-base font-bold leading-[20px] text-white line-clamp-2">
                  {selectedTrait ? selectedTrait && selectedTrait.name : "No Trait Selected"}
                </h3>
                <hr className="w-full" />
                <div className={` ${selectedTrait ? "flex" : "hidden"} justify-between gap-3`}>
                  <div>
                    <p
                      className={` text-base font-bold capitalize ${rarityColor(selectedTrait ? selectedTrait : null)}`}
                    >
                      {selectedTrait ? (selectedTrait.rarity === "oneone" ? "1/1" : selectedTrait.rarity) : null}
                    </p>
                    <p className="text-[11px] font-light text-white">
                      Supply: {selectedTrait && selectedTrait.totalMint}/{selectedTrait && selectedTrait.supply}{" "}
                    </p>
                    <p className="text-[11px] font-bold text-white">
                      {!toggleState
                        ? selectedTrait && selectedTrait.priceAWOO + " AWOO"
                        : selectedTrait && selectedTrait.priceETH + "ETH"}{" "}
                    </p>
                  </div>
                  <button className="mr-2" onMouseDown={() => addToBasket(selectedTrait)}>
                    <img src={Add} alt="add" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Shopping Cart */}
          <div className="hidden lg:block">
            <ShoppingCart
              title="Shopping Cart"
              inventory={false}
              shoppingCart={globalCart}
              testNE={testNE}
              silhouetteNE={silhouetteNE}
              silhouette={silhouette}
              toggleState={toggleState}
              remove={remove}
              removeTrait={removeTrait}
            />
            <h1 className="mt-auto mb-4 text-base font-bold text-white">
              Total: {calculateTotal(globalCart && globalCart)} {currency}
            </h1>
            <div className="mt-auto flex justify-center gap-x-1.5">
              <button
                onClick={() => onClickStore()}
                disabled={globalCart.length === 0}
                className="h-[44px] max-w-[132px] rounded-full bg-primary-btn py-2 px-4 text-xs font-bold uppercase text-black ease-linear enabled:hover:scale-105 enabled:active:scale-95 disabled:bg-primary-btn-disabled disabled:text-opacity-50"
              >
                buy and store
              </button>
              <button
                onClick={() => onClickApply()}
                disabled={
                  !globalFangster || globalCart.length === 0 || checkApply(globalCart) || checkQuantity(globalCart)
                }
                className="h-[44px] max-w-[132px] rounded-full bg-primary-btn py-2 px-4 text-xs font-bold uppercase text-black ease-linear enabled:hover:scale-105 enabled:active:scale-95 disabled:bg-primary-btn-disabled disabled:text-opacity-50"
              >
                buy and apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
