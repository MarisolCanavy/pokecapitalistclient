import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Main from './Main';
import reportWebVitals from './reportWebVitals';
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
const client = new ApolloClient({
uri: 'http://localhost:4000/graphql',
cache: new InMemoryCache()
});

ReactDOM.render(
  <React.StrictMode>
      <ApolloProvider client={client}>
    <Main />
      </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);