import { Palier, World } from "../../world"

type ManagerProps = {
    world: World
    managers: Palier[]
    showManager: boolean
    onCloseManager: () =>void
    hireManager: (manager:Palier)=>void
  }

//showManager change mais s'affiche, juste un refresh marche
export default function manager({managers, world, showManager, onCloseManager, hireManager} : ManagerProps){
    if(!showManager) return <div> </div>
    else
    return (
        <div className="modal is-active absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-light-gray border-medium-gray border-8 outline outline-8 outline-dark-gray max-w-xs text-center text-light-light-gray overflow-auto font-poke">
            <div className="grid grid-rows-2 grid-auto-rows grid-cols-3 place-items-center my-auto gap-16 mt-10">
            {managers.filter(manager => manager.unlocked === false).map((manager) => 
                    <div className="text-color-font h-fit text-xl z-30 space-y-3">
                        <div>
                            <div className="">
                            <img alt="manager du logo" className="mx-auto" src= {"http://localhost:4000" + manager.logo} />
                            </div>
                        </div>
                        <div className="infosmanager">
                            <div className="managername"> { manager.name} </div>
                            <div className="managercible"> {
                              world.products[manager.idcible-1].name } 
                            </div>
                        </div>
                        <div>
                            <div className="managercost"> 
                                { manager.seuil} 
                            </div>
                        </div>
                        <div onClick={() => hireManager(manager)}>
                            <button disabled={world.money < manager.seuil || world.products[manager.idcible-1].quantite === 0} 
                            className="bg-light-gray border-medium-gray border-4 outline outline-4 outline-dark-gray max-w-xs text-center py-1 px-9 mt-2"> Je t'engage !</button>
                        </div>
                    </div>
                    )}
                    <div>
                </div>
            </div>
            <button className="w-3/12 py-2 bg-light-gray text-xl border-medium-gray border-4 outline outline-4 outline-dark-gray text-center text-color-font" onClick={onCloseManager}>Fermer
            </button>
        </div>
   );
}
