import React, { useState } from "react";
import { Link } from "react-router-dom";

import Web3 from "web3";

import { contract } from "../abi.js";

import detectEthereumProvider from "@metamask/detect-provider";

export const Home = () => {
  const [partnershipName, setPartnershipName] = useState("");
  const [viewPartnership, setViewPartnership] = useState({
    name: "",
    next: 1,
    exists: false,
  });

  let ethereum;
  let accounts;
  const connectMetaMask = async () => {
    ethereum = await detectEthereumProvider();
    if (!ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    accounts = await ethereum.request({ method: "eth_requestAccounts" });
    console.log({ accounts });
  };

  const getWhoOwes = async (name) => {
    return await contract().methods.getWhoOwes(name).call();
  };

  const flipNext = async (partnershipName) => {
    await connectMetaMask();

    const hashedMessage = Web3.utils.sha3("flipOwer");

    const sig = await ethereum.request({
      method: "personal_sign",
      params: [hashedMessage, accounts[0]],
    });

    const r = sig.slice(0, 66);
    const s = "0x" + sig.slice(66, 130);
    const v = parseInt(sig.slice(130, 132), 16);

    try {
      const resp = await contract()
        .methods.flipOwer(partnershipName, hashedMessage, v, r, s)
        .send({ from: accounts[0] });
      console.log({ resp });
      if (resp.status === true) {
        setViewPartnership({
          ...viewPartnership,
          next: viewPartnership.next === "1" ? "2" : "1",
        });
      }
    } catch (e) {
      console.log({ e });
      console.log("there was an error, correct signature?");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resp = await getWhoOwes(partnershipName);

      setViewPartnership({
        name: partnershipName,
        next: resp,
        exists: true,
      });
    } catch (e) {
      console.log({ e });
      console.log("there was an error, does it exist?");
    }
  };

  return (
    <div className="Home">
      <div className="Home__header">who got next?</div>
      <form onSubmit={handleSubmit}>
        <div className="Home__form-row">
          <div>
            <input
              type="text"
              placeholder="input partnership name"
              value={partnershipName}
              onChange={(e) => setPartnershipName(e.target.value)}
            />
          </div>
          <div>
            <button type="submit">search</button>
          </div>
        </div>
      </form>
      <div className="Home__form-row">
        <Link to="/new">create new</Link>
      </div>
      {viewPartnership.exists && (
        <div className="Home__partnership-details">
          <div>party: {viewPartnership.name}</div>
          <div>next (either 1 or 2): {viewPartnership.next}</div>
          <div>
            <button onClick={() => flipNext(partnershipName)}>flip next</button>
          </div>
        </div>
      )}
    </div>
  );
};
