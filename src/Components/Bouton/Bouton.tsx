import React, {ReactNode} from 'react';

type MoneyProps = {
    children: React.ReactNode
    onClick: () => any
}
 

const Bouton =( children: MoneyProps ) => {
    return (
      <div className="flex bg-light-gray border-medium-gray text-black border-4 outline outline-4 outline-dark-gray max-w-xs justify-center">
        <div className='text-center'>{children.children}</div>
      </div>
    );
}

export default Bouton;