import React, {useState, useEffect} from 'react';
import { Card, Image, Button, Col, Row } from 'react-bootstrap';
import constants from '../constants';
import { listAuctions, getTimedAuctions} from '../ethereum/web3';

export default function MyItems(props) {
    
    const [items, setItems] = useState(false);
    const [nfts, setNfts] = useState([]);
    const [timedAuctionsLoaded, setTimedAuctionsLoaded] = useState(false);
    const [timedAuctions, setTimedAuctions] = useState([]);
    const address = props.address;

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

    async function loadTimedAuctions(){
        const auctions = await getTimedAuctions();
        for(let i=0; i<auctions.length; i++){
            let token = {
                tokenId : auctions[i][0],
                isOpen : auctions[i][6]
            }
            setTimedAuctions(currentState => [...currentState, token]);
        }
        
    }
    
    
    if(!timedAuctionsLoaded){
        loadTimedAuctions();
        setTimedAuctionsLoaded(true); 
    }

    function checkIfAuctioned(nft){
        let status = "";
        timedAuctions.forEach(function({tokenId, isOpen}){
            if(nft === tokenId && isOpen){
                status='Auctioned'
            }
            else if(nft === tokenId && !isOpen){
                status = 'Sold'
            }
        })
        
        return status;
        
    }
    

    return (
        <div className="text-center" style={{marginTop:50}}>
            <h3>My NFTs</h3>
            <Row>
            {nfts.map((item) => 
                <Col lg={6} key={item.token}>
                
                <div  style={{textAlign:'left', marginLeft:'10%'}} >

                  <Card style={{ width: '40vw', backgroundColor:constants.COLORS.GREY, marginTop: 20}}>
                    <Card.Body>
                      <div style={{width:'50%', display:'inline-block', verticalAlign:'top'}}>
                          <Image src={item.imageUrl} style={{width: 300, height: 300}}></Image>
                      </div>
                      <div style={{width:'50%', display:'inline-block', verticalAlign:'top'}}>
                          <h3 style={{fontFamily:'Montserrat'}}>Title: {item.name}</h3>
                          
                          <h5 style={{fontFamily:'Montserrat'}}>
                            Description: {item.description}
                          </h5>
                          
                          {checkIfAuctioned(item.token.split(':')[1]) == 'Auctioned' ? <p style={{color:'green'}}>Available On Auction</p> : null}
                          {checkIfAuctioned(item.token.split(':')[1]) == 'Sold' ? <p style={{color:'red'}}>Item Sold</p> : null}
                          <div style={{marginTop:200}}>
                          <a href={item.imageUrl} target="_blank"><Button variant="warning">View Image on IPFS</Button></a>
                          <Button variant="success" disabled={
                              checkIfAuctioned(item.token.split(':')[1]) == 'Auctioned' || checkIfAuctioned(item.token.split(':')[1]) == 'Sold'
                          } onClick={() => props.auctionItem(item)} style={{marginLeft: 20}}>Auction This Item</Button>
                          
                          </div>
                      </div>   
                      
                    </Card.Body>
                  </Card>

                    </div>
                </Col>
                
                
            )}
            </Row>
        </div>
        
    )
    
    
}