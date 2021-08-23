import React, { useCallback, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import {Col, Container, Row, Image, Form, Card, Modal} from 'react-bootstrap';
import constants from "../constants";
import { listAuctions, getTimedAuctions, bidOnTimedAuction, closeTimedAuction } from '../ethereum/web3';
import sold from '../assets/img/Sold.png';

export default function PurchasedNFTs(props){

    const [countLoaded, setCountLoaded] = useState(false);
    const [timedAuctionsLoaded, setTimedAuctionsLoaded] = useState(false);
    const [auctionCount, setAuctionCount] = useState({});
    const [timedAuctions, setTimedAuctions] = useState([]);
    const [sellOrder, setOrderInformation] = useState({});

    const [show, setShow] = useState(false);
    
    function handleClose(){
        if(show) setShow(false);
        else setShow(true);
    }

    async function loadCount(){
        const counts = await listAuctions();
        setAuctionCount({
            timed: counts.timed,
            reserved: counts.reserved,
            open: counts.open,
            vickery: counts.vickery
        });
        setCountLoaded(true);
    }
    async function loadTimedAuctions(){
        const auctions = await getTimedAuctions();
        
        for(let i=0; i<auctions.length; i++){
            const token = auctions[i][0];
            if(auctions[i][4]!=props.address || auctions[i][6] == true) continue;
            
            let meta = await fetch(`https://api-dev.rarible.com/protocol/v0.1/ethereum/nft/items/${constants.ERC721}:${token}/meta`)
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
                    meta.owner = auctions[i][1];
                    meta.reservePrice = auctions[i][2];
                    let sec = auctions[i][3];
                    let d = new Date(0);
                    d.setUTCMilliseconds(sec);     
                    d=d.toString();               
                    meta.deadline = d;
                    meta.highestBidder = auctions[i][4];
                    meta.highestBid = auctions[i][5];
                    meta.isOpen = auctions[i][6];
                    meta.id = i+1;
                    
                }
                break;
            }
            setTimedAuctions(currentState => [...currentState, meta]); 
        }
        
    }
    
    if(!countLoaded){
        loadCount();
    }   
    if(!timedAuctionsLoaded){
        loadTimedAuctions();
        setTimedAuctionsLoaded(true); 
    }

    async function claim(){
        
        console.log(props.sdk.order);
        await props.sdk.order.fill(sellOrder, {amount: parseInt(1)}).then(a => a.runAll());
        
    }

    return (
        <div className="text-center" style={{overflowX:'hidden'}}>
            <h2>NFTs Purchased Through Auction House</h2>
            <Modal show={show} size="lg" onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Sell Order Information</Modal.Title>
                </Modal.Header>
                <Modal.Body><textarea cols="75" rows="20" onChange={(e) => setOrderInformation(JSON.parse(e.target.value))}></textarea></Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="success" onClick={() => {
                    claim();
                    handleClose();
                }}>
                    Claim
                </Button>
                </Modal.Footer>
            </Modal>
            
            <Row style={{marginLeft:50}}>
            {timedAuctions.map((item) => 
                <Col lg={6} key={item.token}>

                <div  style={{textAlign:'left'}} >

                  <Card style={{ width: '40vw', backgroundColor:constants.COLORS.GREY, marginTop: 20, borderColor:'green', borderWidth:5}}>
                    <Card.Body>
                      
                      <div style={{width:'50%', display:'inline-block', verticalAlign:'top'}}>
                          <img src={item.imageUrl} style={{width:300, height:250}}></img>
                      </div>
                      <div style={{width:'50%', display:'inline-block', verticalAlign:'top'}}>
                          
                          <h3 style={{fontFamily:'Montserrat'}}>Title: {item.name}</h3>
                          
                          <h5 style={{fontFamily:'Montserrat', marginTop:30}}>
                            Description: {item.description}
                          </h5>
                          
                          <h5 style={{fontFamily:'Montserrat', marginTop:30}}>
                            Reserve Price: {item.reservePrice} wei
                          </h5>
                          <h5 style={{fontFamily:'Montserrat', marginTop:30}}>
                            You purchased for: <strong>{item.highestBid}</strong> wei
                          </h5>
                          
                          {!true ? <Button variant="success" style={{width:'100%'}} onClick={handleClose}>Claim NFT</Button> : null}
                          
                    
                      </div>   
                      
                    </Card.Body>
                    <Card.Footer>
                        <div style={{display:'inline'}}>
                            <p style={{display:'inline'}}>Creator: {item.owner}</p>
                            <a target="_blank" href={item.imageUrl}><Button variant="warning" style={{marginLeft:60}}>View Image on IPFS</Button></a>
                        </div>
                    </Card.Footer>
                  </Card>

                    </div>
                </Col>
                
                
                
            )}
            </Row>
        </div>
    )
}