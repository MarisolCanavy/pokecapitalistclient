import React, { useState } from 'react';
import { Bouton, Money, Pokemon, Score, Unlock } from './Components';
import { transform } from './utils';
import {Palier, Product, World } from './world';
import cd from './images/cd.png';
import baie from './images/baie.png';
import clé from './images/clé.png';
import message from  './images/message.png';
import { Manager } from './Components/Managers';
import { gql, useMutation } from '@apollo/client';
import { Button, IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type MainProps = {
  loadworld: World
  username: string
}

export interface SnackbarMessage {
  message: string;
  key: number;
}

export interface State {
  open: boolean;
  snackPack: readonly SnackbarMessage[];
  messageInfo?: SnackbarMessage;
}

export default function Main({ loadworld, username } : MainProps) {
  const [world, setWorld] = useState(JSON.parse(JSON.stringify(loadworld)) as World)
  const [qtmulti, setQtmulti] = useState("1")
  const [showManager, setShowManager] = useState(false)
  const [showUnlocks, setShowUnlocks] = useState(false)

  const [snackPack, setSnackPack] = React.useState<readonly SnackbarMessage[]>([]);
  const [open, setOpen] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState<SnackbarMessage | undefined>(undefined,);

  React.useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  const handleClick = (message: string) => () => {
    {console.log("handleClick : Coucou")}
    setSnackPack((prev) => [...prev, {message, key: new Date().getTime() }]);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  const action = (
    <React.Fragment>
      <Button onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  
  function addToScore(gain: number) {
    world.score += gain
    setWorld({...world})
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
    // calcul de la somme obtenue par la production du produit
    let gain: number = poke.revenu * poke.quantite
    // ajout de la somme à l’argent possédé et au score
    addToScore(gain)
    world.money += gain
    setWorld({...world})
  }

  function onProductBuy(poke: Product, quantite: number): void{
    //calcul de la depense
    let achat: number = poke.cout*((1-Math.pow(poke.croissance, poke.quantite+quantite))/(1-poke.croissance))-poke.cout*((1-Math.pow(poke.croissance, poke.quantite))/(1-poke.croissance))
    if (world.money - achat >= 0){
      //passage au serveur de la donnee
      acheterPokemon({ variables: { id: poke.id , quantite: quantite} })
      //soustraction au monde
      world.money -= achat
      //ajout à ma quantite
      poke.quantite += quantite
      //regarder si on a atteint le pallier
      let nextPalier = poke.paliers.find( p => p.unlocked === false)

      if(nextPalier){
        if(poke.quantite >= nextPalier?.seuil){
          nextPalier.unlocked = true
        }
      }
      setWorld({...world})
    }else{
      {console.log("OnProductBuy : pas assez d'argent ")}
    }
    
  }

  //OK
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
      handleClick('Bonjour 2')
      engagerManager({variables: {name : manager.name}})
      //retire le cout du manager
      world.money -= manager.seuil
      // changement de la propriété du manager et du unlocked manager du pokemon
      manager.unlocked = true
      world.products[manager.idcible-1].managerUnlocked = true
      setWorld({...world})
    }else{
      console.log("hireManager " + " pas assez d'argent pour acheter le manager")
    }
  }

    //OK
    const ENGAGER_MANAGER = gql`
    mutation engagerManager($name: String!) {
      engagerManager(name: $name) {
            name
        }
    }
  `;

  // la variable entre crochet sert à definir le nom de la fonction à appeler
  const [engagerManager] = useMutation(ENGAGER_MANAGER,
    { context: { headers: { "x-user": username }},
    onError: (error): void => {
    // actions en cas d'erreur
        console.log("engagerManager " + error)
    }
    }
  )

  // TODO
  function deblockUnlock(unlock: Palier): void{
    //regarder si on a atteint le seuil et changer
    if(world.money>= unlock.seuil){
      console.log("deblockUnlock " + unlock.name + " engagé")
      debloquerUnlock({variables: {name : unlock.name}})
      //retire le cout du manager
      world.money -= unlock.seuil
      // changement de la propriété du manager et du unlocked manager du pokemon
      unlock.unlocked = true
      world.products[unlock.idcible-1].managerUnlocked = true
      console.log("deblockUnlock " + world.products[unlock.idcible-1].name + " manager " + world.products[unlock.idcible-1].managerUnlocked )
      setWorld({...world})
    }else{
      console.log("deblockUnlock " + " pas assez d'argent pour acheter le manager")
    }
  }

    //OK
    const DEBLOQUER_UNLOCK = gql`
    mutation debloquerUnlock($name: String!) {
      engagerManager(name: $name) {
            name
        }
    }
  `;

  // la variable entre crochet sert à definir le nom de la fonction à appeler
  const [debloquerUnlock] = useMutation(DEBLOQUER_UNLOCK,
    { context: { headers: { "x-user": username }},
    onError: (error): void => {
    // actions en cas d'erreur
        console.log("engagerManager " + error)
    }
    }
  )

  const afficheManager = () => {
    setShowManager(true);
  };

  const onCloseManager = () => {
    setShowManager(false);
  };

  const afficheUnlocks = () => {
    setShowUnlocks(true);
  };

  const onCloseUnlock = () => {
    setShowUnlocks(false);
  };

  return (
    <div className='max-h-full'>
      <div className="grid grid-rows-2 grid-flow-col gap-8 text-white text-xl  p-6 font-poke max-h-md place-items-center" onClick={handleClick('Bonjour 4')}>
        <Money> <span dangerouslySetInnerHTML={{__html: transform(world.money)}}/> </Money>
        <Score> {world.score} </Score>
        <div className="col-span-10 row-span-2"> 
          <img src={"http://localhost:4000" + world.logo} alt="Logo"  className="h-48 w-full object-cover md:h-full md:w-48"/>
        </div>
        <div className="row-span-2 ">
          <div className="text-lg m-3" > Mutiplicateur </div>
          <button className='w-full py-2 bg-light-gray text-xl border-medium-gray border-4 outline outline-4 outline-dark-gray text-center text-color-font' onClick={changerQuantite}> x{qtmulti} </button>
        </div>
      </div>

      <div className='h-full w-screen'>
        <div className="flex w-screen p-6 h-full">
          <div className='grid grid-rows-4 grid-cols-1 gap-4 text-white justify-end w-20 place-items-left mt-auto'> 
            <div className="h-12 w-12">
              <img src={cd} onClick={afficheManager}/> 
              <div>
                <Manager managers={world.managers} world={world} showManager={showManager} onCloseManager={onCloseManager} hireManager={hireManager}/>
              </div>
            </div>
            <div className="h-12 w-12">
              <img src={baie} onClick={afficheUnlocks}/> 
              <div>
                <Unlock allunlocks={world.allunlocks} world={world} showUnlock={showUnlocks} onCloseUnlock={onCloseUnlock} deblockUnlock={deblockUnlock}/>
              </div>
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
          <div className='absolute z-30'>
            <Snackbar
              open={open}
              autoHideDuration={6000}
              onClose={handleClose}
              message={messageInfo ? messageInfo.message : undefined}
              action={action}
              key={messageInfo ? messageInfo.key : undefined}
              TransitionProps={{ onExited: handleExited }}
            />
        </div>
        </div>
      </div>
    </div>
  );
}