import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
  headers: {
    authorization: localStorage.getItem("username") || ''
  }
});

ReactDOM.render(
  <React.StrictMode>
      <ApolloProvider client={client}>
    <App/>
      </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);