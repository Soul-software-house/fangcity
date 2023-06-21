import React from "react";
import ReactDOM from "react-dom";
import { MoralisProvider } from "react-moralis";
import { BrowserRouter } from "react-router-dom";

import "./assets/fonts/The_Impostor.ttf";
import "./styles/app.css";

import App from "./App";

const APP_ID = process.env.REACT_APP_MORALIS_APP_ID!;
const SERVER_URL = process.env.REACT_APP_MORALIS_SERVER_URL!;

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL} initializeOnMount={true}>
        <App />
      </MoralisProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
