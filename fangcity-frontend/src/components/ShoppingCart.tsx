import React from 'react'

const ShoppingCart = ({shoppingCart, testNE, silhouetteNE, silhouette, toggleState, remove, removeTrait, title, inventory}) => {

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

  return (
    <div className={`scrollbar mt-2 h-[300px] mx-2 sm:mx-0 w-auto sm:w-[270px] gap-3 overflow-y-scroll rounded-2xl bg-content-bg py-2 pl-4 `}>
            <h2 className="w-full text-center sm:text-left text-[11px] uppercase text-white font-bold">{title}</h2>
            {/* Map traits selected  */}

            {shoppingCart && shoppingCart.map((item, index) => (
                
                <div className="mt-2 flex gap-3" key={index}>
                  <div className="relative flex h-[82px] w-[82px] shrink-0 items-start overflow-clip rounded-lg bg-[#E1C9FF]">
                    <img src={testNE(item.name) ? silhouetteNE : silhouette} alt="silhouette" className={`absolute top-0 z-10 h-[82px] w-[82px] leading-[20px]`} />
                    <img src={item.img} alt="traitImg" className={`relative top-0 w-[82px] rounded-lg ${item.type === 'background' ? 'z-0' : 'z-20'}`} />
                  </div>
                  <div className="inline-block w-full text-left">
                    <h3 className="text-base font-bold text-white">{item.name}</h3>
                    <hr className="w-full" />
                    <div className={` flex justify-between gap-3`}>
                      <div>
                        <p className={` ${rarityColor(item)} text-base font-bold capitalize`}>{item.rarity === "oneone" ? "1/1" : item.rarity}</p>
                        { inventory ? 
                        (
                          <>
                            <p className="text-[11px] font-light text-white">
                              Quantity: {item.quantity} /{item.supply}{" "}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-[11px] font-light text-white">
                              Quantity: {item.quantity} /{item.supply}{" "}
                            </p>
                            <p className="text-[11px] font-bold text-white">
                              {!toggleState ? item && item.priceAWOO + " AWOO" : item && item.priceETH + "ETH"}
                            </p>
                          </>
                        )}
                        
                      </div>
                      <button className="shrink-0" onClick={() => removeTrait(item)}>
                        <img src={remove} alt="remove" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
  )
}

export default ShoppingCart