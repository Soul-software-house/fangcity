import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { throttle } from "lodash";
import Moralis from "moralis-v1";
import { useMoralis } from "react-moralis";
import { createGlobalState } from "react-hooks-global-state";

import { Arcade } from "./components/pages/Arcade";
import { Bank } from "./components/Bank";
import { Fanghaus } from "./components/pages/Fanghaus";
import { Navigation } from "./components/Navigation";
import { MainStreet } from "./components/pages/MainStreet";
import { Wldfngz } from "./components/pages/Wldfngz";

// Modals
import { Account } from "./components/modals/Account";
import { ApplyItem } from "./components/modals/ApplyItem";
import { Claim } from "./components/modals/Claim";
import { Claw } from "./components/modals/Claw";
import { Fangsters } from "./components/modals/Fangsters";
import { Inventory } from "./components/modals/Inventory";
import { Live } from "./components/modals/Live";
import { Shirt } from "./components/modals/Shirt";
import { SuperPxls } from "./components/modals/SuperPxls";
import { Transaction } from "./components/modals/Transaction";
import { Vault } from "./components/modals/Vault";
import { Wardrobe } from "./components/modals/Wardrobe";

import "./styles/app.css";
import { TraitStore } from "./components/modals/TraitStore";
import { TraitInventory } from "./components/modals/TraitInventory";
import { Buy } from "./components/confirm/Buy";
import { Apply } from "./components/confirm/Apply";
import Change from "./components/confirm/Change";
import Mint from "./components/confirm/Mint";
import Import from "./components/confirm/Import";
import ShoppingCartModal from "./components/modals/ShoppingCartModal";
import SelectionModal from "./components/confirm/SelectionModal"; 
import SelectFangster from "./components/modals/SelectFangster";


const initialState = {
  applyItem: null,
  backgroundClass: "",
  collectionItems: [],
  confirm: null,
  currentFangster: null,
  erc20Balance: null,
  fangGangAccruals: [],
  globalAudio: null,
  location: "",
  mobileControls: false,
  modal: null,
  nfcBalance: null,
  pxlFangAccruals: [],
  transaction: null,
  transactionMessage: "",
  unclaimedBalance: null,
  userFangsters: [],
  userPxlFangsters: [],
  toggleState: true,
  currency: "ETH",
  shoppingCart: [],
  selectedFangster: null,
  selectedTrait: [],
  selections: [],
  inventory: [],
  combinedImgStore: null,
  combinedImgInventory: null,
  selectFangsterPanel: null
};
const { useGlobalState } = createGlobalState(initialState);

function App() {
  const { user, isAuthenticated } = useMoralis();
  const [backgroundClass] = useGlobalState("backgroundClass");
  const [, setMobileControls] = useGlobalState("mobileControls");
  const [modal] = useGlobalState("modal");
  const [location] = useGlobalState("location");

  useEffect(() => {
    setMobileControls(!modal);
  }, [modal, setMobileControls]);  

  const logActivity = async () => {
    try {
      if (isAuthenticated && (user?.get("currentFangster") || "").length) {
        await Moralis.Cloud.run("updateLastActivityAt", { tokenId: Number(user?.get("currentFangster")) });
      }
    } catch (e) {
      console.log("There was a problem logging activity!");
    }
  };

  const updateLocation = async (location: string) => {
    try {
      if (isAuthenticated && (user?.get("currentFangster") || "").length) {
        Moralis.Cloud.run("updateCurrentLocation", {
          tokenId: Number(user?.get("currentFangster")),
          location: location,
        });
      }
    } catch (e) {
      console.log("There was a problem updating current location!");
    }
  };

  useEffect(() => {
    updateLocation(location);
  }, [location]); // eslint-disable-line react-hooks/exhaustive-deps

  const throttledLogActivity = throttle(logActivity, 10_000);

  return (
    <div className="h-screen" onMouseMove={throttledLogActivity} onClick={throttledLogActivity}>
      <Navigation />
      <div className={`relative ${backgroundClass} h-full bg-tiling bg-repeat-x`}>
        <Switch>
          <Route key="arcade" path="/arcade" exact render={() => <Arcade />} />
          <Route key="wldfngz" path="/wldfngz" exact render={() => <Wldfngz />} />
          <Route key="fanghaus" path="/fanghaus" exact render={() => <Fanghaus />} />
          <Route key="bank" path="/bank" exact render={() => <Bank />} />
          <Route path="*" render={() => <MainStreet />} />
        </Switch>
      </div>

      <Account />
      <ApplyItem />
      <Claim />
      <Claw />
      <Buy />
      <Apply />
      <Change />
      <Mint />
      <Import />
      <Fangsters />
      <Inventory />
      <ShoppingCartModal />
      <Live />
      <SelectionModal />
      <Shirt />
      <SuperPxls />
      <SelectFangster />
      <Transaction />
      <TraitInventory />
      <TraitStore />
      <Vault />
      <Wardrobe />
    </div>
  );
}

export default App;
export { useGlobalState };
