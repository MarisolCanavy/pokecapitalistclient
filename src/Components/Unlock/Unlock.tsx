import { Palier, World } from "../../world"

type UnlockedProps = {
    world: World
    allunlocks: Palier[]
    showUnlock: boolean
    onCloseUnlock: () =>void
  }


export default function unlock({allunlocks, world, showUnlock, onCloseUnlock} : UnlockedProps){
    if(!showUnlock) return <div> </div>
    else
    return (
        <div className="modal is-active absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-light-gray border-medium-gray border-8 outline outline-8 outline-dark-gray max-w-xs text-center text-light-light-gray overflow-auto font-poke">
            <div className="grid grid-rows-2 grid-auto-rows grid-cols-3 place-items-center gap-16 my-10">
                {world.products.map((poke) => {
                    return (<div className="text-color-font h-fit text-xl z-30 space-y-3">
                        <div className="nextPallier">
                            <img alt="logo du produit" className="mx-auto" src= {"http://localhost:4000" + poke.paliers.find( p => p.unlocked === false)?.logo }/>
                            <div> {poke.paliers.find( p => p.unlocked === false)?.seuil } </div>
                            <div>  {poke.paliers.find( p => p.unlocked === false)?.ratio } x {poke.paliers.find( p => p.unlocked === false)?.typeratio } </div>
                        </div>
                    </div>)
                })
                }
                {allunlocks.filter(unlock => unlock.unlocked === false).map((unlock) => 
                        <div className="text-color-font h-fit text-xl z-30 space-y-3">
                            <div>
                                <img alt="logo de allunlock" className="mx-auto" src= {"http://localhost:4000" + unlock.logo} />
                            </div>
                            <div className="infosmanager">
                                <div className="managername"> { unlock.name} </div>
                                <div className="seuil"> { unlock.seuil } </div>
                            </div>
                            <div className="ratio"> { unlock.ratio } x { unlock.typeratio } </div>
                        </div>
                )}
            </div>
            <div className="mb-10">
                <button className="w-3/12 py-2 bg-light-gray text-xl border-medium-gray border-4 outline outline-4 outline-dark-gray text-center text-color-font" onClick={onCloseUnlock}> Fermer
                </button>
            </div>
        </div>
   );
}
