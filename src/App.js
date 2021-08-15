
import './App.css';

import { toAddress, toBigNumber } from "@rarible/types"

import 'bootstrap/dist/css/bootstrap.min.css';


import constants from './rarible/contants';
import {useState, useEffect} from 'react';
import { createRaribleSdk } from "@rarible/protocol-ethereum-sdk";
import Header from './components/Header';
import { Button } from 'react-bootstrap';


import MyItems from './components/MyItems';
import CreateNFT from './components/CreateNFT';
import Auction from './components/Auction';
import ListAuctions from './components/ListAuctions';

const Web3 = require('web3');

const provider = new Web3.providers.HttpProvider(constants.INFURA_URL);

//const web3 = new Web3(provider);
let web3;
function App() {
  
  const [address, setAddress] = useState('');
  const [metamask, setMetamask] = useState(false);
  const [sdk, setSdk] = useState();
  const [component, setComponent] = useState('MyItems');
  const [itemForSale, setItemForSale] = useState({});
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
   
    const item = await sdk?.nft.mintLazy({
        '@type': 'ERC721', // type of NFT to mint
        contract: toAddress('0xB0EA149212Eb707a1E5FC1D2d3fD318a8d94cf05'), // rinkeby default Rarible collection
        uri: "/ipfs/QmWLsBu6nS4ovaHbGAXprD1qEssJu4r5taQfB74sCG51tp", // tokenUri, url to media that nft stores
        creators: [{ account: toAddress('0xDb9F310D544b58322aBA88881f6bAA4F7B4AD666'), value: 10000 }], // list of creators
        royalties: [], // royalties
    })
    if (item) {
        
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

  const createSellOrder = async () => {

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

  let content;

  function setRoute(route) {
    setComponent(route);
  }

  function putForAuction(item){
    setItemForSale(item);
    setComponent('Auction');
  }

  if(component === 'MyItems') {
    content = <MyItems address={address} auctionItem={putForAuction}/>
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

  
  return (
    <div>
      <Header changeRoute={setRoute} />
      {content}
    </div>
    
  );
}

export default App;
