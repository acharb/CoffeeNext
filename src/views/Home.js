import React, { useState } from "react";
import { Link } from "react-router-dom";

import Web3 from "web3";

import { contract, contractAddress } from "../abi.js";
import { HomeWrapper } from "./HomeWrapper";

import detectEthereumProvider from "@metamask/detect-provider";

export const Home = () => {
  const [partnershipName, setPartnershipName] = useState("");
  const [viewPartnership, setViewPartnership] = useState({
    name: "",
    next: 1,
    exists: false,
  });
  const [message, setMessage] = useState("");
  const [connectedAccount, setConnectedAccount] = useState("");

  const getWhoOwes = async (name) => {
    return await contract().methods.getWhoOwes(name).call();
  };

  const flipNext = async (partnershipName) => {
    setMessage("");
    const ethereum = await detectEthereumProvider();

    const hashedMessage = Web3.utils.sha3("flipOwer");

    const sig = await ethereum.request({
      method: "personal_sign",
      params: [hashedMessage, connectedAccount],
    });

    const r = sig.slice(0, 66);
    const s = "0x" + sig.slice(66, 130);
    const v = parseInt(sig.slice(130, 132), 16);

    try {
      const encodedData = await contract()
        .methods.flipOwer(partnershipName, hashedMessage, v, r, s)
        .encodeABI();

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

      setViewPartnership({
        ...viewPartnership,
        next: viewPartnership.next === "1" ? "2" : "1",
      });
      setMessage("woohoo flipped! (give it a second to update on chain)");
    } catch (e) {
      console.log({ e });
      console.log("there was an error, correct signature?");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

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
      setMessage(`error finding: ${partnershipName}. does it exist?`);
    }
  };

  return (
    <HomeWrapper setConnectedAccount={setConnectedAccount}>
      <div className="Home">
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
          <>
            <div className="Home__partnership-details">
              <div>party: {viewPartnership.name}</div>
              <div>next (either 1 or 2): {viewPartnership.next}</div>
            </div>
            <div>
              <button
                disabled={!connectedAccount}
                onClick={() => flipNext(partnershipName)}
              >
                flip next
              </button>
            </div>
          </>
        )}
        <div className="Message">{message}</div>
      </div>
    </HomeWrapper>
  );
};
