import React, { useState } from 'react';
import { Bouton, Money, Pokemon, Score } from './Components';
import { transform } from './utils';
import {World } from './world';

type MainProps = {
  loadworld: World
  username: string
 }

 export default function Main({ loadworld, username } : MainProps) {
  const [world, setWorld] = useState(JSON.parse(JSON.stringify(loadworld)) as World)

  
  return (
    <div>
      <div>
          <div className="grid grid-rows-2 grid-flow-col gap-8 text-white text-xl  p-6 font-poke max-h-md place-items-center">
            <Money> <span dangerouslySetInnerHTML={{__html: transform(world.money)}}/> </Money>
            <Score> {world.score} </Score>
            <div className="col-span-10 row-span-2"> 
              <img src={"http://localhost:4000" + world.logo} alt="Logo"  className="h-48 w-full object-cover md:h-full md:w-48 "/>
            </div>
            <div className="row-span-2 ">
              <div className="text-lg m-3" > Mutiplicateur </div>
              <Bouton>x10</Bouton>
            </div>

          </div>
        <div className="">
          <div className="main flex w-full mt-8 mb-32">
            <div className='grid grid-rows-4 grid-cols-1 gap-4 text-white justify-end w-20 place-items-center'> 
              <div className="h-2 w-2">1</div>
              <div className="h-2 w-2">2</div>
              <div className="h-2 w-2">3</div>
              <div className="h-2 w-2">4</div>
            </div>
            <div className="grid grid-rows-3 grid-auto-rows grid-cols-2 mx-auto place-items-center gap-x-52">
              {world.products.map((value) => {
                return <Pokemon poke={value} />
              })}
            </div>
            <div className='w-20'>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

        


