import React from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Home } from "./views/Home";
import { NewParty } from "./views/NewParty";

import "./App.scss";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/new" element={<NewParty />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
