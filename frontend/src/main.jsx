import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'sonner';
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster 
        theme="dark" 
        position="top-center" 
        richColors 
        duration={5000}
        toastOptions={{
          style: {
            background: '#080808',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            fontSize: '12px',
            letterSpacing: '0.1em'
          },
        }}
      />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);