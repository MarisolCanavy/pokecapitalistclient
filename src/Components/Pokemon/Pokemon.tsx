import { useEffect, useRef, useState} from 'react';
import { transform } from '../../utils';
import { Product } from '../../world';
import { BarreProgres, Orientation } from '../BarreProgres';
import { gql, useMutation } from '@apollo/client';

type PokeProps = {
  poke: Product
  onProductionDone: (product: Product) => void
  qtMulti: string
  moneyJoueur: number
  onProductBuy: (product: Product, qtMulti: number) => void
  username: string
  /*services: Services*/
}


export default function Pokemon({poke, onProductionDone, qtMulti, moneyJoueur, onProductBuy, username /* , services */} : PokeProps){

    var [run, lancerProd] = useState(false);
    var quantite: number = 0;
    var coutQuantite: number = 0;
    let corps = undefined;
    let image = undefined;

    const savedCallback = useRef(calcScore)
    useEffect(() => savedCallback.current = calcScore)
    useEffect(() => {
        let timer = setInterval(() => savedCallback.current(), 500)
        return function cleanup() {
        if (timer) clearInterval(timer)
     }
    }, [])

    const startFabrication = () => { 
        if(poke.quantite == 0){
            {console.log("la production n'a pas commencé")}
        }else{
            lancerProduction({ variables: { id: poke.id } })
            //passe run à true
            lancerProd(true)
            poke.timeleft = poke.vitesse
            poke.lastupdate = Date.now()
        }
    };

    function onProgressbarCompleted() {
        lancerProd(false);
    }

    //envoie la donnnée vers le serveur : ok, mutationn serveur : ok, retour du serveur : pb
    const LANCER_PRODUCTION = gql`
        mutation lancerProductionProduit($id: Int!) {
            lancerProductionProduit(id: $id) {
                id
            }
        }
    `;

    // la variable entre crochet sert à definir le nom de la fonction à appeler
    const [lancerProduction] = useMutation(LANCER_PRODUCTION,
        { context: { headers: { "x-user": username }},
        onError: (error): void => {
        // actions en cas d'erreur
            console.log("lancerProduction onError " + username)
            console.log("lancerProduction onError " + error)
        }
        }
    )

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

        }else if(poke.timeleft === 0 && poke.managerUnlocked){
            startFabrication()
        }else{
            // TODO pourquoi mettre à jour la barre de progression ?
            // progress = Math.round(((poke.vitesse - poke.timeleft) / poke.vitesse) * 100)
        }
    }
    

    //fonction achat d'un produit
    function achatPokemon(){
        onProductBuy(poke, quantite)
    }

    //fonction qui calcule le maximum de pokemon que l'utilisateur peut achter
    function calcMaxCanBuy(){
        if(qtMulti === "Max") {
            let n = 0; 
            for (let i = 0; i < 10000; i++) {
                var somme = poke.cout * ((1-Math.pow(poke.croissance, poke.quantite+i))/(1-poke.croissance))
                if (somme<moneyJoueur){
                    n+=1
                } 
            }
            console.log("maxCanBuy" + n)
            coutQuantite = poke.cout*((1-Math.pow(poke.croissance, poke.quantite+n))/(1-poke.croissance))-poke.cout*((1-Math.pow(poke.croissance, poke.quantite))/(1-poke.croissance))
            quantite = n
        }else{
            coutQuantite = poke.cout*((1-Math.pow(poke.croissance, poke.quantite+parseInt(qtMulti)))/(1-poke.croissance))-poke.cout*((1-Math.pow(poke.croissance, poke.quantite))/(1-poke.croissance))
            quantite = parseInt(qtMulti)
        }
    }
    
    calcMaxCanBuy();

    if (qtMulti === "Max") {
        corps = <div> x {quantite} </div>;
    } else {
        corps = <div></div>;
    }

    const [shake, setShake] = useState(false);
    
    const animate = () => {
        // Button begins to shake
        setShake(true);
        // Buttons stops to shake after 2 seconds
        setTimeout(() => setShake(false), 2000);
        
    }

    if (poke.quantite === 0) {
        image = <img src={"http://localhost:4000" + poke.paliers.find( p => p.unlocked === false)?.logo } className="w-64 h-64 relative grayscale"  alt='img1' onClick={startFabrication}/>
    } else {
        image = <img src={"http://localhost:4000" + poke.paliers.find( p => p.unlocked === false)?.logo } className="w-64 h-64 relative shake"  alt='img1' onClick={() => {
            startFabrication();
            animate();
          }}/>
    }
    //faire fitter la progressbar
    if(!poke) return <div></div>
    else
    return (
        <div className="font-poke text-color-font h-fit text-xl">
            <div className='flex -space-x-28 overflow-hidden gap-x-5'>
                {image}
                <div className='grid grid-cols-2 gap-4 bg-fondPoke bg-contain bg-no-repeat py-7 px-4 h-40 w-471 my-auto'>
                    <div className='place-self-start pl-5'>
                        {poke.paliers.find( p => p.unlocked === false)?.name }
                    </div>
                    <div className='place-self-end'>
                        {poke.quantite} / {poke.paliers.find( p => p.unlocked === false)?.seuil }
                    </div>
                    <div className='col-span-2 place-self-start h-6 w-200'> 
                        <BarreProgres vitesse={poke.vitesse} className='max-h-4 w-full translate-y-4 translate-x-56 '
                            initialvalue={poke.vitesse - poke.timeleft}
                            run={run} frontcolor="rgba(24, 195, 32, 0.5)" backcolor="#ffffff"
                            auto={poke.managerUnlocked} orientation={Orientation.horizontal}
                            onCompleted={onProgressbarCompleted}/>
                    </div>
                    <div className='pl-5 justify-center text-center'>
                        {corps}
                    </div> 
                    <div className="justify-center text-center" onClick={achatPokemon}>
                        <span dangerouslySetInnerHTML={{__html: transform(coutQuantite)}}/> ₽
                    </div>
                </div>
            </div>
        </div>
    );
}
