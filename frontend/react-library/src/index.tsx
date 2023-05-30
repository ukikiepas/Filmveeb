import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";

// tutaj dajemy publishable key zeby polaczyc z kontem stripe
const stripePromise = loadStripe('pk_test_51NDQi7LmYD3CXGOoHQqAkilQZupWtGfrO1niYlP7JZUFsj4ri7TUa1pgy7VOzF1XLO83CNG2Ez4SzL3qYOSbipmb00hBjpKHYC');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
      <Elements stripe={stripePromise} >
          <App />
      </Elements>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
