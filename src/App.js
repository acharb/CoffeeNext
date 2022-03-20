import React, { useState } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Home } from "./views/Home";
import { NewParty } from "./views/NewParty";

import "./App.scss";

export const ConnectedContext = React.createContext();

function App() {
  const [connectedAccount, setConnectedAccount] = useState("");
  const value = { connectedAccount, setConnectedAccount };
  return (
    <ConnectedContext.Provider value={value}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/new" element={<NewParty />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </ConnectedContext.Provider>
  );
}

export default App;
