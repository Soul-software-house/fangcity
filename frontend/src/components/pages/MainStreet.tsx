import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { useGlobalState } from "../../App";
import { Presence } from "../Presence";

import arcadeOpen from "../../assets/images/main-street/arcade-open.png";
import arcadeClosed from "../../assets/images/main-street/arcade-closed.png";
import bankClosed from "../../assets/images/main-street/bank-closed.png";
import bankOpen from "../../assets/images/main-street/bank-open.png";
import barrier from "../../assets/images/main-street/barrier.png";
import cityHallClosed from "../../assets/images/main-street/city-hall-closed.png";
import fanghausOpen from "../../assets/images/main-street/fanghaus-open.png";
import fanghausClosed from "../../assets/images/main-street/fanghaus-closed.png";
import hotDogCartOpen from "../../assets/images/main-street/hot-dog-cart-open.png";
import recordStoreOpen from "../../assets/images/main-street/record-store-open.png";
import recordStoreClosed from "../../assets/images/main-street/record-store-closed.png";
import wldfngzOpen from "../../assets/images/main-street/wildfangz-open.png";
import wldfngzClosed from "../../assets/images/main-street/wildfangz-closed.png";
import wall from "../../assets/images/main-street/wall.png";

export const MainStreet = () => {
  const [, setBackgroundClass] = useGlobalState("backgroundClass");
  const [, setLocation] = useGlobalState("location");
  const [, setModal] = useGlobalState("modal");
  const scrollTo = useRef(null);

  const scrollToBottom = () => {
    scrollTo.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setBackgroundClass("bg-mainstreet-background");
    setLocation("mainstreet");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setBackgroundClass("bg-main-street-background");
    setTimeout(() => {
      scrollToBottom();
    }, 500);
  }, [scrollTo, setBackgroundClass]);

  return (
    <div className="flex w-screen overflow-y-hidden">
      <div className="relative flex h-full min-w-screen shrink-0 flex-row items-center justify-between bg-tiling">
        <div className="relative z-[60] h-full shrink-0 items-center justify-center">
          <img className="h-screen select-none" src={cityHallClosed} alt="" />
        </div>
        <div className="group relative z-50 -ml-[17vh] h-full shrink-0 items-center justify-center">
          <img
            className="absolute h-screen cursor-pointer select-none group-hover:hidden"
            src={recordStoreClosed}
            alt=""
          />
          <img
            onClick={() => setModal("live")}
            className="h-screen cursor-pointer select-none"
            src={recordStoreOpen}
            alt=""
          />
        </div>
        <div className="relative z-40 -ml-[4vh] h-full shrink-0 items-center justify-center">
          <Link to="/arcade" className="group">
            <img
              className="absolute h-screen cursor-pointer select-none group-hover:hidden"
              src={arcadeClosed}
              alt=""
            />
            <img className="h-screen cursor-pointer select-none" src={arcadeOpen} alt="" />
          </Link>
        </div>
        <div className="group relative z-30 -ml-[27vh] h-full shrink-0 items-center justify-center">
          <Link to="/wldfngz">
            <img
              className="absolute h-screen cursor-pointer select-none group-hover:hidden"
              src={wldfngzClosed}
              alt=""
            />
            <img className="h-screen cursor-pointer select-none" src={wldfngzOpen} alt="" />
          </Link>
        </div>
        <div className="group relative z-40 -ml-[10vh] h-full shrink-0 items-center justify-center">
          {/* <img
            className="absolute z-50 h-screen cursor-pointer select-none group-hover:hidden"
            src={hotDogCartClosed}
            alt=""
          /> */}
          <img
            // onClick={() => setModal("flavatools")}
            // className="z-50 h-screen cursor-pointer select-none"
            className="z-50 h-screen select-none"
            src={hotDogCartOpen}
            alt=""
          />
        </div>
        <div className="group relative z-20 -ml-[20vh] h-full shrink-0 items-center justify-center">
          <Link to="/fanghaus">
            <img
              className="absolute h-screen cursor-pointer select-none group-hover:hidden"
              src={fanghausClosed}
              alt=""
            />
            <img className="h-screen cursor-pointer select-none" src={fanghausOpen} alt="" />
          </Link>
        </div>
        <div className="group relative z-10 -ml-[20vh] h-full shrink-0 items-center justify-center">
          <Link to="/bank">
            <img className="absolute h-screen cursor-pointer select-none group-hover:hidden" src={bankClosed} alt="" />
            <img className="h-screen cursor-pointer select-none" src={bankOpen} alt="" />
          </Link>
        </div>
        <div className="z-1 relative -ml-[25vh] h-full shrink-0 items-center justify-center">
          <Link to="/bank">
            <img className="absolute left-0 bottom-0 z-50 h-screen select-none" src={barrier} alt="" />
          </Link>
          <img className="pointer-events-none h-screen select-none" src={wall} alt="" />
        </div>
        <div className="items-bottom absolute left-0 right-0 top-0 bottom-0 flex shrink-0 flex-row justify-around bg-main-street-road bg-tiling bg-repeat-x" />

        <Presence />
      </div>
    </div>
  );
};
