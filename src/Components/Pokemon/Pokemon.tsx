import React, {ReactNode, useEffect, useRef, useState} from 'react';
import bulbasaur from "../../images/bulbasaur.png";
import { toFixed2 } from '../../utils';
import { Product } from '../../world';
import { BarreProgres, Orientation } from '../BarreProgres';

type PokeProps = {
  poke: Product
  onProductionDone: (product: Product) => void
  qtMulti: string
  moneyJoueur: number
  onProductBuy: (product: Product, qtMulti: number) => void
  /*services: Services*/
}


export default function Pokemon({poke, onProductionDone, qtMulti, moneyJoueur, onProductBuy /* , services */} : PokeProps){

    var [run, lancerProd] = useState(false);
    var quantite: number = 0;
    var coutQuantite: number = 0;

    const savedCallback = useRef(calcScore)
    useEffect(() => savedCallback.current = calcScore)
    useEffect(() => {
        let timer = setInterval(() => savedCallback.current(), 500)
        return function cleanup() {
        if (timer) clearInterval(timer)
     }
    }, [])

    const startFabrication = () => {
        poke.timeleft = poke.vitesse
        poke.lastupdate = Date.now()
        //passe run à true
        lancerProd(true);
    };

    function onProgressbarCompleted() {
        lancerProd(false);
    }

    function calcScore(){
        //si timeleft est different de 0, cela signifie que la production du produit a été lancée
        if(poke.timeleft !== 0 ){
            // mise à jour du temps restant en prenant le timeleft, on soustrait le temps depuis la prod
            poke.timeleft -= (Date.now() - poke.lastupdate)
            poke.lastupdate = Date.now()
            if(poke.timeleft<=0){
                if(poke.timeleft<0) poke.timeleft = 0
                lancerProd(false)
                //ajoute du revenu produit au score
                onProductionDone(poke)
            }

        }else if(poke.timeleft == 0 && poke.managerUnlocked){
            startFabrication()
        }else{
            // TODO pourquoi mettre à jour la barre de progression ?
            // progress = Math.round(((poke.vitesse - poke.timeleft) / poke.vitesse) * 100)
        }
    }
    

    //fonction achat d'un produit
    function achatPokemon(){
        onProductBuy(poke, quantite)
        console.log("coucou")
    }

    //fonction qui calcule le maximum de pokemon que l'utilisateur peut achter
    function calcMaxCanBuy(){
        if(qtMulti == "Max") {
            let n = 0; 
            for (let i = 0; i < 10000; i++) {
                var somme = poke.cout * ((1-Math.pow(poke.croissance, poke.quantite+i))/(1-poke.croissance))
                if (somme<moneyJoueur){
                    n+=1
                } 
            }
            {console.log("maxCanBuy" + n)}
            coutQuantite = poke.cout*((1-Math.pow(poke.croissance, poke.quantite+n))/(1-poke.croissance))-poke.cout*((1-Math.pow(poke.croissance, poke.quantite))/(1-poke.croissance))
            quantite = n
        }else{
            coutQuantite = poke.cout*((1-Math.pow(poke.croissance, poke.quantite+parseInt(qtMulti)))/(1-poke.croissance))-poke.cout*((1-Math.pow(poke.croissance, poke.quantite))/(1-poke.croissance))
            quantite = parseInt(qtMulti)
        }
    }
    
    calcMaxCanBuy();

    //faire fitter la progressbar
    if(!poke) return <div></div>
    else
    return (
        <div className="font-poke text-color-font h-fit text-xl">
            <div className='flex -space-x-28 overflow-hidden gap-x-5'>
                <img src={"http://localhost:4000" + poke.logo} className="w-64 h-64 z-10"  onClick={startFabrication}/>
                <div className='grid grid-cols-2 gap-4 bg-fondPoke bg-contain bg-no-repeat  py-8 px-4 h-40 w-471 my-auto'>
                    <div className='place-self-start pl-5'>
                        {poke.name}
                    </div>
                    <div className='place-self-end'>
                        {poke.quantite} / total
                    </div>
                    <div className='col-span-2 place-self-end h-7'> 
                        <BarreProgres vitesse={poke.vitesse}
                            initialvalue={poke.vitesse - poke.timeleft}
                            run={run} frontcolor="rgba(24, 195, 32, 0.5)" backcolor="#ffffff"
                            /*frontcolor="rgba(24, 195, 32, 0.5)" backcolor="rgba(0, 0, 0, 0)"*/
                            auto={poke.managerUnlocked} orientation={Orientation.horizontal}
                            onCompleted={onProgressbarCompleted}/>
                    </div>
                    <div>
                        x{quantite}
                    </div> 
                    <div className="justify-center text-center" onClick={achatPokemon}>
                        <span dangerouslySetInnerHTML={{__html: toFixed2(coutQuantite)}}/> ₽
                    </div>
                </div>
            </div>
        </div>
    );
}
