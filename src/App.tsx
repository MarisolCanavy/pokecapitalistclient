import React, { useState } from 'react';
import logo from './logomonde.png';
import Main from './Main';
import { useQuery, gql, empty } from '@apollo/client';
import { Money, Score, Bouton } from './Components';
import './App.css';


function App() {
  let name = localStorage.getItem("username");

  if (!name) {
    name = "NewCaptain" + Math.floor(Math.random() * 10000);
    localStorage.setItem("username", name);
  }

  const [username, setUsername] = useState(name);
  const {loading, error, data, refetch } = useQuery(GET_WORLD, {
    context: { headers: { "x-user": username } }
   });

  function onUserNameChanged(e : React.ChangeEvent<HTMLInputElement>) {
    console.log("Le nom rentrée est :" + e.target.value);
    setUsername(e.target.value);
    localStorage.setItem("username", e.target.value);
    refetch();
  }
 
  let corps = undefined

  if (loading) {
    corps = <div> Loading... </div>;
  } else if (error) {
    corps = <div> Erreur de chargement du monde ! </div>;
    console.log(error);
  } else {
    corps = <Main loadworld={data.getWorld} username={username} />;
  }

  return (
    <div className="App bg-bg bg-right-bottom bg-cover bg-background bg-no-repeat w-full h-screen">
       <div className="grid grid-rows-2 grid-flow-col gap-8 text-white text-xl  p-6 font-poke max-h-md place-items-center">
       <div className="row-span-2 justify-center ">
          <div className="text-lg m-3 text-center" > Monde de </div>
          <input type="text" className="flex bg-light-gray border-medium-gray border-4 outline outline-4 outline-dark-gray max-w-xs text-center text-light-light-gray " name="username" value={username}  onChange={onUserNameChanged}/>
        </div>
      </div>
      {corps}
    </div>
  );
}

const GET_WORLD = gql`
 query getWorld {
 getWorld {
 name
 money
  logo
  score
  totalangels
  activeangels
  angelbonus
  lastupdate
  products {
    id
    name
    logo
    cout
    croissance
    revenu
    vitesse
    quantite
    timeleft
    managerUnlocked
    paliers {
      name
      logo
      seuil
      idcible
      ratio
      typeratio
      unlocked
    }
  }
  allunlocks {
    name
    logo
    seuil
    idcible
    ratio
    typeratio
    unlocked
  }
  upgrades {
    name
    logo
    seuil
    idcible
    ratio
    typeratio
    unlocked
  }
  angelupgrades {
    name
    logo
    seuil
    idcible
    ratio
    typeratio
    unlocked
  }
  managers {
    name
    logo
    seuil
    idcible
    ratio
    typeratio
    unlocked
  }
}
}`

export default App;
