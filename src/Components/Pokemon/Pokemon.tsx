import React, {ReactNode} from 'react';
import bulbasaur from "../../images/bulbasaur.png";
import { Product } from '../../world';

type PokeProps = {
  poke: Product
}

export default function Pokemon({poke} : PokeProps){
    if(!poke) return <div></div>
    else
    return (
        <div className="font-poke text-color-font h-fit text-xl">
            <div className='flex -space-x-28 overflow-hidden gap-x-5'>
            <img src={"http://localhost:4000" + poke.logo} className="w-64 h-64 z-10"/>
            <div className='grid grid-cols-2 gap-4 bg-fondPoke bg-contain bg-no-repeat  py-8 px-4 h-40 w-471 my-auto'>
                <div className='place-self-start pl-5'>
                    {poke.name}
                </div>
                <div className='place-self-end'>
                    {poke.quantite} / total
                </div>
                <div className='col-span-2 place-self-end'>
                    barre de chargement
                </div>
                <div></div>
                <div className="justify-center text-center">
                    {poke.cout} ₽
                </div>
            </div>
            </div>
        </div>
    );
}
