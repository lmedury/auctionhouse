
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useState, useEffect} from 'react';
import { createRaribleSdk } from "@rarible/protocol-ethereum-sdk";
import Header from './components/Header';
import MyItems from './components/MyItems';
import CreateNFT from './components/CreateNFT';
import Auction from './components/Auction';
import ListAuctions from './components/ListAuctions';
import Home from './components/Home';
import Footer from './components/Footer';
import PurchasedNFTs from './components/PurchasedNFTs';
import SellNFT from './components/SellNFT';
const Web3 = require('web3');

let web3;
function App() {
  
  const [address, setAddress] = useState('');
  const [metamask, setMetamask] = useState(false);
  const [sdk, setSdk] = useState();
  const [component, setComponent] = useState('Home');
  const [itemForSale, setItemForSale] = useState({});
  
  useEffect(() => {
    
    if(!metamask){
      if(window.ethereum){
        web3 = new Web3(window.ethereum);
        const raribleSdk = createRaribleSdk(web3, 'ropsten');
        setSdk(raribleSdk);
        try{
          window.ethereum.enable().then(function(){
            web3.eth.getAccounts((err, accounts) => {
              setAddress(accounts[0]);
            })
            
          });
          
        } catch(error){
          console.log('Denied');
        }
      }
      setMetamask(true);
    }
    window.ethereum.on('accountsChanged', function(accounts){
        setAddress(accounts[0]);
    })
    
  }, [metamask]);

  let content;

  function setRoute(route) {
    setComponent(route);
  }

  function putForAuction(item){
    setItemForSale(item);
    setComponent('Auction');
  }

  function putForSale(item){
    setItemForSale(item);
    setComponent('Sale')
  }

  if(component === 'MyItems') {
    content = <MyItems address={address} auctionItem={putForAuction} createSellOrder={putForSale}/>
  }
  else if(component === 'Create') {
    content = <CreateNFT address={address} sdk={sdk} web3={web3}/>
  }
  else if(component === 'Auction'){
    content = <Auction item={itemForSale} web3={web3} />
  }
  else if(component === 'List'){
    content = <ListAuctions address={address} />
  }
  else if(component === 'Home'){
    content = <Home changeRoute={setRoute} />
  }
  else if(component === 'Purchased'){
    content = <PurchasedNFTs address = {address} sdk={sdk} />
  }
  else if(component === 'Sale'){
    content = <SellNFT address = {address} item={itemForSale} sdk={sdk} web3={web3} />
  }

  
  return (
    <div style={{fontFamily:'Montserrat'}}>
      <Header changeRoute={setRoute} />
      {content}
      
      <div style={{marginTop:100}}>
        <Footer></Footer>
      </div>
      
    </div>
    
  );
}

export default App;
