import Web3 from "web3";

// ganache data:
const ganacheURL = "http://127.0.0.1:7545";
export const contractAddress = "0xB962CB376fe1D6c79123bb057EFa7ff76f5fd245";
export const deployOwner = "0x9f4BB5664600F404E0389FfCb6b40fDd53C74e10";

export const contract = () => {
  const web3 = new Web3(ganacheURL);
  return new web3.eth.Contract(CoffeeNextABI, contractAddress);
};

// TODO - figure out how to import this automatically from the build
export const CoffeeNextABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "method",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "ts",
        type: "uint256",
      },
    ],
    name: "Log",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "partnerships",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "getPartnerships",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "partnership",
        type: "string",
      },
      {
        internalType: "address",
        name: "keyA",
        type: "address",
      },
      {
        internalType: "address",
        name: "keyB",
        type: "address",
      },
    ],
    name: "register",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "partnership",
        type: "string",
      },
      {
        internalType: "bytes32",
        name: "_hashedMsg",
        type: "bytes32",
      },
      {
        internalType: "uint8",
        name: "_v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "_r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_s",
        type: "bytes32",
      },
    ],
    name: "flipOwer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "partnership",
        type: "string",
      },
    ],
    name: "getWhoOwes",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "healthCheck",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
    constant: true,
  },
];
