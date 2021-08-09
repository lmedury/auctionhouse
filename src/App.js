
import './App.css';

import {getToken, createLazyMint, signTypedData, putLazyMint} from './rarible/LazyMint';
import { encodeOrder, signOrder, sendOrder } from './rarible/SellOrder';
import { toAddress, toBigNumber } from "@rarible/types"

import 'bootstrap/dist/css/bootstrap.min.css';


import constants from './rarible/contants';
import {useState, useEffect} from 'react';
import { createRaribleSdk } from "@rarible/protocol-ethereum-sdk";
import Header from './components/Header';
import { Nav } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import MyItems from './components/MyItems';

const Web3 = require('web3');

const provider = new Web3.providers.HttpProvider(constants.INFURA_URL);

//const web3 = new Web3(provider);
let web3;
function App() {
  
  const [address, setAddress] = useState('');
  const [metamask, setMetamask] = useState(false);
  const [token, setToken] = useState();
  const [structure, setDs] = useState('');
  const [sdk, setSdk] = useState();
  const [createOrderForm, setCreateOrderForm] = useState({
    contract: '',
		tokenId: '',
		price: '10',
		hash: '',
  })

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
    
  });

  const getRaribleToken = async () => {
    /*
    const newToken = await getToken();
    console.log(newToken);
    setToken(newToken);
    */
    const item = await sdk?.nft.mintLazy({
        '@type': 'ERC721', // type of NFT to mint
        contract: '0xB0EA149212Eb707a1E5FC1D2d3fD318a8d94cf05', // rinkeby default Rarible collection
        uri: "/ipfs/QmWLsBu6nS4ovaHbGAXprD1qEssJu4r5taQfB74sCG51tp", // tokenUri, url to media that nft stores
        creators: [{ account: '0x6B311A7229B9D46a19e7D3a249D645a574FcCfa7', value: 10000 }], // list of creators
        royalties: [], // royalties
    })
    if (item) {
        /**
         * Get minted nft through SDK
         */
        const token = await sdk?.apis.nftItem.getNftItemById({ itemId: item.id })

        if (token) {
            setCreateOrderForm({
              ...createOrderForm,
              contract: token.contract,
              tokenId: token.tokenId,
            });
        }
    }
  }

  const lazyMint = async () => {
    /*
    const ds = await createLazyMint(token);
    console.log(ds);
    setDs(ds);*/
    console.log(createOrderForm);
  }

  const sign = async () => {

     const data = await signTypedData(web3, '0x6B311A7229B9D46a19e7D3a249D645a574FcCfa7', structure);
     console.log(data);
     const thisStruct = structure.message;
     thisStruct.signatures = [`${data.result}`];
     const uri = thisStruct.tokenURI;
     delete thisStruct.tokenURI;
     thisStruct.uri = uri;

     console.log(thisStruct);
     const result = await putLazyMint(thisStruct);
     //console.log(result);*/
  }

  const viewItems = async () => {
    const account = address[0];
    const res = await fetch(`https://api-dev.rarible.com/protocol/v0.1/ethereum/nft/items/byOwner?owner=${account}`)
    .then((res) => res.json());
    
    let items = [];
    res.items.forEach(function({id}){
      items.push(id);
    })
    for(let i=0; i<items.length; i++){
      const token = items[i];
      console.log(token);
      const meta = await fetch(`https://api-dev.rarible.com/protocol/v0.1/ethereum/nft/items/${token}/meta`)
      .then((res) => res.json());
      
      
    }
    
  }

  const createSellOrder = async () => {

    /*
    const tokenId = '48484232827816830878986996706944297318189305185390064202543177320002635169805';
    let order = await encodeOrder(address[0], tokenId);
    order = order.signMessage;
    console.log(order);
  
    
    const sign = await signOrder(web3, order, address[0]);
    
    let finalOrder = await sendOrder(address[0], tokenId, sign.result);
    console.log(finalOrder);*/

    if (createOrderForm.contract && createOrderForm.tokenId && createOrderForm.price) {
			const request = {
				makeAssetType: {
					assetClass: "ERC721",
					contract: toAddress(createOrderForm.contract),
					tokenId: toBigNumber(createOrderForm.tokenId),
				},
				amount: 1,
				maker: toAddress(address[0]),
				originFees: [],
				payouts: [],
				price: toBigNumber(createOrderForm.price),
				takeAssetType: { assetClass: "ETH" },
			}

      try{
        const resultOrder = await sdk.order.sell(request).then(a => a.runAll());
        if (resultOrder) {
          /*
          setOrder(resultOrder)
          setPurchaseOrderForm({ ...purchaseOrderForm, hash: resultOrder.hash })*/
          console.log(resultOrder);
        }
      }catch(err) {
        console.log(err);
      }
			
			
		}
  }

  /* 
  <div className="App">

      <Header address={address} />
      <Navigation />
      <Button variant="primary" onClick={getRaribleToken} >Create</Button>
      <Button variant="primary" onClick={lazyMint} >Lazy Mint</Button>
      <Button variant="primary" onClick={sign} >Sign</Button>
      <Button variant="primary" onClick={viewItems} >View</Button>
      <Button variant="primary" onClick={createSellOrder} >Sell Order</Button>

    </div>
  */

  
  return (
    <Router>
      <Header address={address} />
      <div style={{marginTop:50, marginLeft:20}} >
        <Nav variant="tabs" defaultActiveKey="/home" >
          <Nav.Item>
            <Nav.Link eventKey="/home">
              <Link to="/home">Your Items</Link>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-1">
              <Link to="/create">Create an NFT</Link>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-2">
              <Link to="/auction">Auction NFT</Link>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-3">
              <Link to="/sell">Transfer NFT</Link>
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Switch>
          <Route path="/home">
            <MyItems address={address} />
          </Route>
          
        </Switch>
      </div>
      
    </Router>
    
  );
}

export default App;
