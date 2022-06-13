import React from 'react';
import logo from './logo.svg';
import './Main.css';
import Product from './Product';

function Main() {
  return (
    <div>
      <div className="header">
        <div> Argent </div>
        <div> PokéWorld </div>
        <div> Mutiplicateur </div>
      </div>
      <div className="main">
        <div> liste des boutons de menu </div>
        <div className="product">
          <Product>Team Bulbizarre</Product>
          <Product>Team Carapuce</Product>
          <Product>Team Salamèche</Product>
          <Product>Team Draco</Product>
          <Product>Team Ecto</Product>
          <Product>Team Pikachu</Product>
        </div>
      </div>
    </div>
  );
}

export default Main;
