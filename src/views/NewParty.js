import React, { useState } from "react";
import { Link } from "react-router-dom";

import { contract, contractAddress } from "../abi.js";
import { HomeWrapper } from "./HomeWrapper";

import detectEthereumProvider from "@metamask/detect-provider";

export const NewParty = () => {
  const [newPartnership, setNewPartnership] = useState("");
  const [otherPublicKey, setOtherPublicKey] = useState("");
  const [message, setMessage] = useState("");
  const [connectedAccount, setConnectedAccount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ethereum = await detectEthereumProvider();

    try {
      const encodedData = await contract()
        .methods.register(newPartnership, connectedAccount, otherPublicKey)
        .encodeABI();

      // send trough metamask
      const transactionParams = {
        to: contractAddress,
        from: connectedAccount,
        data: encodedData,
      };
      const resp = await ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParams],
      });

      console.log({ resp });

      setMessage("woohoo success!");
    } catch (e) {
      console.log({ e });
      setMessage("oops, something went wrong. Does it already exist?");
    }
  };

  // doesn't work with Infura, would need to figure out how to do with a raw transaction
  // const handleEstimate = async (e) => {
  //   e.preventDefault();
  //   const ethereum = await detectEthereumProvider();
  //   if (!ethereum) {
  //     alert("Please install MetaMask!");
  //     return;
  //   }
  //   const accounts = await ethereum.request({ method: "eth_requestAccounts" });

  //   try {
  //     const resp = await contract()
  //       .methods.register(newPartnership, connectedAccount, otherPublicKey)
  //       .estimateGas({ from: connectedAccount });

  //     setGasEstimate(resp);
  //   } catch (e) {
  //     console.log({ e });
  //     setMessage("oops, something went wrong. Does it already exist?");
  //   }
  // };

  return (
    <HomeWrapper setConnectedAccount={setConnectedAccount}>
      <div className="NewParty">
        <form onSubmit={handleSubmit}>
          <div className="NewParty__form-row">
            <div>
              <input
                type="text"
                value={newPartnership}
                onChange={(e) => setNewPartnership(e.target.value)}
                placeholder="partnership name"
              />
            </div>
            <div>
              <input
                type="text"
                value={otherPublicKey}
                onChange={(e) => setOtherPublicKey(e.target.value)}
                placeholder="other public key"
              />
            </div>
            <div>
              <button type="submit" disabled={!connectedAccount}>
                submit
              </button>
            </div>
          </div>
        </form>
        <Link to="/">go home</Link>
        <div>{message}</div>
      </div>
    </HomeWrapper>
  );
};
