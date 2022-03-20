import React, { useContext } from "react";
import detectEthereumProvider from "@metamask/detect-provider";

import { ConnectedContext } from "../App";

export const HomeWrapper = ({ children }) => {
  const { connectedAccount, setConnectedAccount } = useContext(
    ConnectedContext
  );

  const requestConnect = async () => {
    const ethereum = await detectEthereumProvider();
    if (!ethereum) {
      return;
    }
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    setConnectedAccount(accounts[0]);
  };
  return (
    <div className="HomeWrapper">
      <div className="header">who got next?</div>
      <div className="HomeWrapper__connected-acct">
        {connectedAccount ? (
          <span>connected to: {connectedAccount}</span>
        ) : (
          <>
            <span>connect to metamask to interact with smart contract</span>
            <span>
              <button onClick={() => requestConnect()}>
                connect to metamask
              </button>
            </span>
          </>
        )}
        <span>(Ropsten only currently)</span>
      </div>
      <div className="HomeWrapper__a-github">
        source code:{" "}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/acharb/CoffeeNext"
        >
          https://github.com/acharb/CoffeeNext
        </a>
      </div>
      <div>{children}</div>
    </div>
  );
};
