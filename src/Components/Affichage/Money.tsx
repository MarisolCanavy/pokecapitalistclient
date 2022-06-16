import logo from '../../images/logoMoney.png';

type MoneyProps = {
    children: React.ReactNode;
}
  
const Money =( children: MoneyProps ) => {
    return (
      <div className="flex space-x-5 place-self-start">
        <img src={logo} className='max-h-10'/> 
        <div>{children.children}</div> 
        <div>₽</div>
      </div>
    );
}

export default Money;