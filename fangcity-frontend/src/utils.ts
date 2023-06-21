import { useEffect, useState } from "react";
import Moralis from "moralis-v1";

export type IAccrualValue = { type: "BigNumber"; hex: string };
export type IAccrual = [string, IAccrualValue[], IAccrualValue[], IAccrualValue];
export type IAccruals = [IAccrual[], IAccrualValue];

export const MIN_NUMBER = 0.000000000001;
export const ERROR_MESSAGES = {
  "Specified item already applied to the specified token and is not stackable":
    "The item is already applied to this token.",
  "Not owner or approved": "You must set approval before applying an item.",
  "Exceeds address limit": "You can only purchase one of this item per wallet.",
  "Insufficient Balance": "Your NFC Wallet balance is too low to purchase this item.",
  "Inactive item": "This item is not currently available for purchase.",
};

const useKeyPress = targetKey => {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState<boolean>(false);
  // Add event listeners
  useEffect(() => {
    // If pressed key is our target key then set to true
    const downHandler = ({ key, keyCode }) => {
      if (key === targetKey || keyCode === targetKey) {
        setKeyPressed(true);
      }
    };
    // If released key is our target key then set to false
    const upHandler = ({ key, keyCode }) => {
      if (key === targetKey || keyCode === targetKey) {
        setKeyPressed(false);
      }
    };

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [targetKey]); // Empty array ensures that effect is only run on mount and unmount
  return keyPressed;
};

const useContainerDimensions = myRef => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const getDimensions = () => ({
      width: myRef.current.offsetWidth,
      height: myRef.current.offsetHeight,
    });

    const handleResize = () => {
      setDimensions(getDimensions());
    };

    const handleLoad = () => {
      if (myRef.current) {
        setDimensions(getDimensions());
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("load", handleLoad);

    const oneSecDelay = setInterval(() => setDimensions(getDimensions()), 1_000);
    const fiveSecDelay = setInterval(() => setDimensions(getDimensions()), 5_000);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", handleLoad);
      clearInterval(oneSecDelay);
      clearInterval(fiveSecDelay);
    };
  }, [myRef]);

  return dimensions;
};

const formatWalletAddress = (string: string, length: number = undefined) => {
  if (!string) return string;
  if (length) {
    return `${string.substring(2, length)}`;
  }

  return `${string.substring(2, 6)}...${string.substring(string.length - 4)}`;
};

const formatENSName = (string: string) => {
  if (!string) return string;

  return string.split(".eth")[0];
};

const parseAccruals = (accruals: IAccruals, contractAddress: string): { [key: string]: string } => {
  const acc: IAccrual = accruals?.length
    ? accruals[0].find((accrual: IAccrual) => accrual[0]?.toLowerCase() === contractAddress?.toLowerCase())
    : null;

  return acc
    ? acc[1].reduce((a, tokenValue, index) => {
        a[tokenValue.toString()] = Moralis.Units.FromWei(acc[2][index].toString(), 18);

        return a;
      }, {})
    : null;
};

const truncateNumber = (num: number | string): number => {
  var re = new RegExp("^-?\\d+(?:.\\d{0,12})?");
  return Number(num.toString().match(re)[0]);
};

const weiToNumber = (wei: string): number => {
  return truncateNumber(Moralis.Units.FromWei((BigInt(wei) < MIN_NUMBER ? 0 : BigInt(wei as string)).toString(), 18));
};

export {
  formatENSName,
  formatWalletAddress,
  useContainerDimensions,
  useKeyPress,
  parseAccruals,
  truncateNumber,
  weiToNumber,
};
