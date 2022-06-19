import React, { useState } from 'react';
import { Bouton, Money, Pokemon, Score } from './Components';
import { transform } from './utils';
import {Palier, Product, World } from './world';
import cd from './images/cd.png';
import baie from './images/baie.png';
import clé from './images/clé.png';
import message from  './images/message.png';
import { Manager } from './Components/Managers';
import { gql, useMutation } from '@apollo/client';

type MainProps = {
  loadworld: World
  username: string
 }

 export default function Main({ loadworld, username } : MainProps) {
  const [world, setWorld] = useState(JSON.parse(JSON.stringify(loadworld)) as World)
  const [qtmulti, setQtmulti] = useState("1");
  const [showManager, setShowManager] = useState(false);

  function addToScore(gain: number) {
    {console.log("addToScore : " + world.score)}
    world.score += gain
    setWorld(world)
    {console.log("addToScore : " + world.score)}
  }

  function changerQuantite() {
    switch (qtmulti) {
      case "1":
        setQtmulti("10");
        break;
      case "10":
        setQtmulti("100");
        break;
      case "100":
        setQtmulti("Max");
        break;
      case "Max":
          setQtmulti("1");
          break;
    }
  };
   
  function onProductionDone(poke: Product): void {
    {console.log("onProductionDone : " + world.score)}
    // calcul de la somme obtenue par la production du produit
    let gain: number = poke.revenu * poke.quantite;
    // ajout de la somme à l’argent possédé
    addToScore(gain);
  }

  function onProductBuy(poke: Product, quantite: number): void{
    //calcul de la depense
    let achat: number = poke.cout*((1-Math.pow(poke.croissance, poke.quantite+quantite))/(1-poke.croissance))-poke.cout*((1-Math.pow(poke.croissance, poke.quantite))/(1-poke.croissance))
    //soustraction au monde
    world.money -= achat
    //passage au serveur de la donnee
    acheterPokemon({ variables: { id: poke.id , quantite: quantite} });

  }

  //ne marche pas, jsp pq
  const ACHETER_POKEMON = gql`
    mutation acheterQtProduit($id: Int!, $quantite: Int!) {
      acheterQtProduit(id: $id, quantite: $quantite) {
            id
            quantite
        }
    }
  `;

  // la variable entre crochet sert à definir le nom de la fonction à appeler
  const [acheterPokemon] = useMutation(ACHETER_POKEMON,
    { context: { headers: { "x-user": username }},
    onError: (error): void => {
    // actions en cas d'erreur
        console.log("acheterPokemon " + username)
        console.log("acheterPokemon " + error)
    }
    }
  )

  function hireManager(manager: Palier): void{
    //check si on a assez d'argent pour acheter le manager
    if(world.money>= manager.seuil){
      //retire le cout du manager
      world.money -= manager.seuil
      // changement de la propriété du manager et du unlocked manager du pokemon
      manager.unlocked = true
      world.products[manager.idcible-1].managerUnlocked = true
    }
  }

  const afficheManager = () => {
    setShowManager(true);
};

  return (
    <div className='max-h-full'>
      <div className="grid grid-rows-2 grid-flow-col gap-8 text-white text-xl  p-6 font-poke max-h-md place-items-center">
        <Money> <span dangerouslySetInnerHTML={{__html: transform(world.money)}}/> </Money>
        <Score> {world.score} </Score>
        <div className="col-span-10 row-span-2"> 
          <img src={"http://localhost:4000" + world.logo} alt="Logo"  className="h-48 w-full object-cover md:h-full md:w-48 "/>
        </div>
        <div className="row-span-2 ">
          <div className="text-lg m-3" > Mutiplicateur </div>
          <button onClick={changerQuantite}> x{qtmulti} </button>
        </div>

      </div>
      <div className='h-full w-screen' >
        <div className="flex w-screen p-8 h-full">
          <div className='grid grid-rows-4 grid-cols-1 gap-4 text-white justify-end w-20 place-items-center mt-auto pl-6'> 
            <div className="h-12 w-12">
              <img src={cd} onClick={afficheManager}/> 
              <div>
                <Manager managers={world.managers} world={world} showManager={showManager} hireManager={hireManager}/>
              </div>
            </div>
            <div className="h-12 w-12">
              <img src={baie}/> 
            </div>
            <div className="h-12 w-12">
              <img src={clé}/>
              </div>
            <div className="h-12 w-12">
              <img src={message}/>
            </div>
          </div>
          <div className="grid grid-rows-3 grid-auto-rows grid-cols-2 mx-auto place-items-center gap-x-52 overflow-hidden">
            {world.products.map((poke) => {
              return <Pokemon poke={poke} key={poke.id} onProductionDone={onProductionDone} qtMulti={qtmulti} moneyJoueur={world.money} onProductBuy={onProductBuy} username={username}/* services={services}*//>
            })}
          </div>
          <div className='w-20'>
          </div>
          </div>
        </div>
    </div>
  );
}

