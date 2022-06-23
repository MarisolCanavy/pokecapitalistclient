import { Palier, World } from "../../world"

type AngelsProps = {
    world: World
    showAngels: boolean
    onCloseAngels: () =>void
    //hireManager: (manager:Palier)=>void
  }

//showManager change mais s'affiche, juste un refresh marche
export default function Anges({world, showAngels, onCloseAngels} : AngelsProps){
    if(!showAngels) return <div> </div>
    else
    return (
        <div>
            <div> Achats des anges </div>
            <div>
                Total d'anges accumulés : {world.totalangels}
                2% de bonus par ange
                <button>
                </button> 
            </div>
        </div>
    );
}