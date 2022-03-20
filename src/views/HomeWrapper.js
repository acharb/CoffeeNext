import React, { useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";

export const HomeWrapper = ({
  setConnectedAccount: setParentConnectedAccount,
  children,
}) => {
  const [connectedAccount, setConnectedAccount] = useState("");

  useEffect(() => {
    (async () => {
      const ethereum = await detectEthereumProvider();
      if (!ethereum) {
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setConnectedAccount(accounts[0]);
      setParentConnectedAccount(accounts[0]);
    })();
  });
  return (
    <div className="HomeWrapper">
      <div className="header">who got next?</div>
      <div className="HomeWrapper__connected-acct">
        {connectedAccount ? (
          <span>connected to: {connectedAccount}</span>
        ) : (
          <span>need to connect to metamask</span>
        )}
        <br />
        (Ropsten only currently)
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
