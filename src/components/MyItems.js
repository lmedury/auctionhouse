import React, {useState, useEffect} from 'react';
import { Card, Image, Button } from 'react-bootstrap';
import constants from '../constants';

export default function MyItems(props) {
    
    const [items, setItems] = useState(false);
    const [nfts, setNfts] = useState([]);
    const address = '0xDb9F310D544b58322aBA88881f6bAA4F7B4AD666';

    async function getItems(){
        const res = await fetch(`https://api-dev.rarible.com/protocol/v0.1/ethereum/nft/items/byOwner?owner=${address}`)
        .then((res) => res.json());
        
        let items = [];
        res.items.forEach(function({id}){
            items.push(id);
        })
        for(let i=0; i<items.length; i++){
            const token = items[i];
            let meta = await fetch(`https://api-dev.rarible.com/protocol/v0.1/ethereum/nft/items/${token}/meta`)
            .then((res) => res.json());
            
            meta.token = token;
            for(let key in meta.image) {
                for(let url in meta.image[key]){
                    const imageUrl = meta.image[key][url];
                    
                    if(imageUrl.split('/')[0] == 'ipfs:'){
                        const hash = imageUrl.split('/')[3];
                        meta.imageUrl = `https://ipfs.infura.io/ipfs/${hash}`; 
                    }
                    else{
                        meta.imageUrl = imageUrl;
                    }
                }
                break;
            }
            
            setNfts(currentState => [...currentState, meta]); 
        }
        
        
    }

    if(!items) {
        getItems();
        setItems(true);
    }
    

    return (
        <div style={{marginLeft:'30%'}}>
            {nfts.map((item) => 
                <div key={item.token} style={{textAlign:'left'}} >

                  <Card style={{ width: '40vw', marginTop: 20}}>
                    <Card.Body>
                      <div style={{width:'50%', display:'inline-block'}}>
                          <Image src={item.imageUrl} style={{width: 300, height: 300}}></Image>
                      </div>
                      <div style={{width:'50%', display:'inline-block'}}>
                          <h3 style={{fontFamily:'Montserrat'}}>Title: {item.name}</h3>
                          
                          <h5 style={{fontFamily:'Montserrat'}}>
                            Description: {item.description}
                          </h5>
                          <div style={{marginTop:50}}>
                          <a href={item.imageUrl} target="_blank"><Button variant="warning">View Image on IPFS</Button></a>
                          <Button variant="success" onClick={() => props.auctionItem(item)} style={{marginLeft: 20}}>Auction This Item</Button>
                          
                          </div>
                      </div>   
                      
                    </Card.Body>
                  </Card>
                </div>
            )}
        </div>
        
    )
    
    
}