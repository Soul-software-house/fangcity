import React from 'react'
import {Confirm} from '../Confirm'
import { useGlobalState } from "../../App";
import ShoppingCart from '../ShoppingCart';
import silhouette from "../../assets/images/store/placeholder.svg";
import silhouetteNE from "../../assets/images/store/Placeholder_NE.svg";
import remove from "../../assets/images/store/Remove.svg";
import { add } from 'mathjs'

const ShoppingCartModal = () => {
    const [shoppingCart, ] = useGlobalState("shoppingCart")
    const [, setConfirm] = useGlobalState("confirm")
    const [globalCart, setGlobalCart] = useGlobalState("shoppingCart")
    const [globalFangster, setGlobalFangster] = useGlobalState("selectedFangster")
    const [currency, ] = useGlobalState("currency")
    const [toggleState, ] = useGlobalState("toggleState")

    function checkApply(array) {
        let result = array.map(a => a.type);
        // console.log(result)
        return (new Set(result)).size !== array.length;
        
      }

      function onClickStore() {
        setConfirm("buy")
        setGlobalCart(shoppingCart)
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

    function removeTrait(item) {
    var array = [...globalCart];
    var index = array.indexOf(item);
    if (item.quantity > 1){
      item.quantity--;
      item.totalMint = item.totalMint + 1
      var res = Array.from(new Set(globalCart))
      setGlobalCart([...res]);
    }else if (index !== -1) {
      item.totalMint = item.totalMint + 1
      array.splice(index, 1);
      setGlobalCart(array);
      console.log("Item removed!" + globalCart);
    }
  }

    function calculateTotal(item) {
        let total:number = 0
        let length = 0;
    
        item.map((data) => {
          if(length < price(data).toString().length -2){
            length = price(data).toString().length -2;
          }
          return (
            total = add(total , price(data))
          )
      })
    
      if (total > 1){
        return total.toFixed(2)
      } else {
        return total.toFixed(length)
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

  function checkQuantity(array) {
    let result = array.filter(item=>item.quantity>1);
    console.log(result)
    if(result.length === 0){
      return false
    } else {
      return true
    }
  }

  function onClickApply() {
    setConfirm("apply");
    setGlobalCart(shoppingCart)
    setGlobalFangster(globalFangster)
    // ADD TO GLOBAL INVENTORY
    // console.log(globalCart)
  }

  return (
    <Confirm confirm="cart">
        <div className='flex flex-col justify-center align-middle'>
        <ShoppingCart
            title="Shopping Cart" inventory={false}
            shoppingCart={globalCart} 
            testNE={testNE} silhouetteNE={silhouetteNE} silhouette={silhouette} toggleState={toggleState} remove={remove} removeTrait={removeTrait} />
          <h1 className="mt-4 text-base font-bold text-white mb-4">
            Total: {calculateTotal(shoppingCart && shoppingCart)}  {currency}
          </h1>
          <div className="mt-auto flex justify-center gap-x-1.5">
            <button
              onClick={() => onClickStore()}
              disabled={shoppingCart.length === 0 }
              className="h-[44px] max-w-[132px] rounded-full bg-primary-btn py-2 px-4 text-xs font-bold uppercase text-black ease-linear disabled:text-opacity-50 disabled:bg-primary-btn-disabled enabled:hover:scale-105 enabled:active:scale-95"
            >
              buy and store
            </button>
            <button 
              onClick={() => onClickApply()}
              disabled={!globalFangster || shoppingCart.length === 0 || checkApply(shoppingCart) || checkQuantity(shoppingCart)}
              className="h-[44px] max-w-[132px] rounded-full bg-primary-btn py-2 px-4 text-xs font-bold uppercase text-black ease-linear disabled:text-opacity-50 disabled:bg-primary-btn-disabled enabled:hover:scale-105 enabled:active:scale-95">
              buy and apply
            </button>
          </div>
        </div>
        
                
    </Confirm>
  )
}

export default ShoppingCartModal