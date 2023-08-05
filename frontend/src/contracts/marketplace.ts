const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "awooContract",
        type: "address",
      },
      {
        internalType: "address",
        name: "claimingContract",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "itemName",
        type: "string",
      },
      {
        internalType: "address",
        name: "collectionAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "cost",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "baseAccrualRate",
        type: "uint256",
      },
    ],
    name: "addUpgradeItem",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "hash",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "sig",
        type: "bytes",
      },
      {
        internalType: "string",
        name: "nonce",
        type: "string",
      },
      {
        internalType: "string",
        name: "itemName",
        type: "string",
      },
      {
        internalType: "address",
        name: "collectionAddress",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "tokenId",
        type: "uint32",
      },
    ],
    name: "purchaseUpgrade",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "awooClaiming",
        type: "address",
      },
    ],
    name: "setAwooClaimingContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const contractAddress = process.env.REACT_APP_MARKETPLACE_CONTRACT_ADDRESS;

export { abi, contractAddress };
