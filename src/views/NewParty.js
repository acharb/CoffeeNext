import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

import { contract, contractAddress } from "../abi.js";
import { HomeWrapper } from "./HomeWrapper";
import { ConnectedContext } from "../App";

import detectEthereumProvider from "@metamask/detect-provider";

export const NewParty = () => {
  const [newPartnership, setNewPartnership] = useState("");
  const [otherPublicKey, setOtherPublicKey] = useState("");
  const [message, setMessage] = useState("");
  const [successTxHash, setSuccessTxHash] = useState("");
  const [allPartnerships, setAllPartnerships] = useState([]);
  const { connectedAccount } = useContext(ConnectedContext);

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

      setSuccessTxHash(resp);
      setMessage("woohoo success! (give it a moment to update on chain)");
    } catch (e) {
      console.log({ e });
      setMessage("oops, something went wrong. Does it already exist?");
    }
  };

  const getAllPartnerships = async () => {
    try {
      const resp = await contract().methods.getPartnerships().call();
      console.log({ resp });
      setAllPartnerships(resp);
    } catch (e) {
      console.error("error");
      console.log({ e });
    }
  };

  return (
    <HomeWrapper>
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
        <div className="NewParty__link-stack">
          <Link to="/">go home</Link>
          <button onClick={getAllPartnerships}>see all accounts</button>
        </div>
        <div className="NewParty__all-partys">
          {allPartnerships.map((p) => p + ", ")}
        </div>
        <div className="Message">{message}</div>
        {successTxHash && (
          <div className="etherscan-link">
            <br />
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://ropsten.etherscan.io/tx/${successTxHash}`}
            >
              check status on etherscan ->
            </a>
          </div>
        )}
      </div>
    </HomeWrapper>
  );
};
