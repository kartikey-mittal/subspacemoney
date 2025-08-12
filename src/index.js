// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { NhostClient, NhostReactProvider } from '@nhost/react';
import { NhostApolloProvider } from '@nhost/react-apollo';

// Nhost client ko configure karein
const nhost = new NhostClient({
  subdomain: 'bisvcatrrmemfwvskwkf', // <-- Nhost dashboard se copy karein
  region: 'ap-south-1'        // <-- Nhost dashboard se copy karein
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <NhostReactProvider nhost={nhost}>
      <NhostApolloProvider nhost={nhost}>
        <App />
      </NhostApolloProvider>
    </NhostReactProvider>
  </React.StrictMode>
);