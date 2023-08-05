import React from 'react'
import {Confirm} from '../Confirm'
import { useGlobalState } from "../../App";
import ShoppingCart from '../ShoppingCart';
import silhouette from "../../assets/images/store/placeholder.svg";
import silhouetteNE from "../../assets/images/store/Placeholder_NE.svg";
import remove from "../../assets/images/store/Remove.svg";
// import { add } from 'mathjs'

const SelectionModal = () => {
    const [, setConfirm] = useGlobalState("confirm")
    const [globalCart, setGlobalCart] = useGlobalState("selections")
    const [globalFangster, setGlobalFangster] = useGlobalState("selectedFangster")
    const [toggleState, ] = useGlobalState("toggleState")


    
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

  function checkChanges(array) {
    let result = array.map(a => a.type);
    console.log((new Set(result)).size !== array.length)
    return (new Set(result)).size !== array.length;
    
  }

  function onConfirmChange() {
    setConfirm("change")
    setGlobalCart(globalCart)
    setGlobalFangster(globalFangster)
  }
    




  return (
    <Confirm confirm="selection">
        <div className='flex flex-col justify-center align-middle '>
        <ShoppingCart 
            title="Shopping Cart" inventory={true}
            shoppingCart={globalCart} 
            testNE={testNE} silhouetteNE={silhouetteNE} silhouette={silhouette} toggleState={toggleState} remove={remove} removeTrait={removeTrait} />
          <div className="mt-2 flex justify-center ">
            <button
              disabled={globalCart.length === 0 ? true : false || checkChanges(globalCart)}
                onClick={() => onConfirmChange()}
                className="h-[44px] mt-auto rounded-full text-black bg-primary-btn py-3 px-5 text-xs font-bold uppercase enabled:hover:scale-105 enabled:active:scale-95 disabled:text-opacity-50 disabled:bg-primary-btn-disabled  ease-linear"
              >
                confirm changes
              </button>
          </div>
        </div>
        
                
    </Confirm>
  )
}

export default SelectionModal