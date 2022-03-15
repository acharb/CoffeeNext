import React, { useState } from "react";
import { Link } from "react-router-dom";

import { contract } from "../abi.js";

import detectEthereumProvider from "@metamask/detect-provider";

export const NewParty = () => {
  const [newPartnership, setNewPartnership] = useState("");
  const [otherPublicKey, setOtherPublicKey] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ethereum = await detectEthereumProvider();
    if (!ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });

    // ALEC TODO - allow custom gas configs when sending? can do in metamask?
    try {
      const resp = await contract()
        .methods.register(newPartnership, accounts[0], otherPublicKey)
        .send({ from: accounts[0], gas: 6721975, gasPrice: "30000000" });
      if (resp.status === true) {
        setMessage("woohoo success!");
      }
    } catch (e) {
      console.log({ e });
      setMessage("oops, something went wrong. Does it already exist?");
    }
  };

  return (
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
            <button type="submit">submit</button>
          </div>
        </div>
      </form>
      <Link to="/">go home</Link>
      <div>{message}</div>
    </div>
  );
};