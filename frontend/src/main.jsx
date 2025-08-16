import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import 'virtual:windi.css';  // WindiCSS base
import './styles/global.css'; // your custom global styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
