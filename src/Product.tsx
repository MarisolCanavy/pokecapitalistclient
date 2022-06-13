import React, {ReactNode} from 'react';
import logo from './logo.svg';
import './Product.css';

type Props = {
  children: ReactNode
}

const Product =( {children}: Props ) => {
  return (
    <div>
      <div>{children}</div>
      <img src="/logo512.png"/>
    </div>
  );
}

export
 default Product;
