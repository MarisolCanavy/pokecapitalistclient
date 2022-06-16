import React,{ReactNode} from 'react';
import logo from '../../images/logoScore.png';

type Props = {
    children: ReactNode
  }
  
const Score =( {children}: Props ) => {
    return (
      <div className='flex space-x-5 place-self-start'>
        <img src={logo} className='max-h-10'/>
        <div>{children}</div>
      </div>
    );
}

export default Score;