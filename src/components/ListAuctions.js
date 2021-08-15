import React, {useState, useEffect} from 'react';
import { Card, Image, Button, Row, Col, Form, Alert } from 'react-bootstrap';
import constants from '../constants';
import { listAuctions, getTimedAuctions, bidOnTimedAuction } from '../ethereum/web3';

export default function ListAuctions(props){
    
    const [countLoaded, setCountLoaded] = useState(false);
    const [timedAuctionsLoaded, setTimedAuctionsLoaded] = useState(false);
    const [auctionCount, setAuctionCount] = useState({});
    const [timedAuctions, setTimedAuctions] = useState([]);
    const [bid, setBid] = useState();

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
    
    return(
        <div className="text-center" style={{marginTop:50, marginLeft:50}}>
            <h2>NFT Auctions</h2>
            <Row style={{marginTop:50, marginRight:50}}>
                <Col lg={3}>
                    <Card style={{backgroundColor:constants.COLORS.GREY, textAlign:'left', height:250}}>
                        <Card.Body>
                            <h5>Timed Auctions: {auctionCount.timed}</h5>
                            <p><em>Timed auctions don’t have an auctioneer calling the bids – there’s just a bidding window and whoever bids highest during it wins (as long as the reserve’s met of course). You'll know it's a timed auction as the end time will be displaced on the lot page.</em>
                                <br/>Source: <a href="https://support.the-saleroom.com/hc/en-gb/articles/115000058754-What-s-the-difference-between-live-and-timed-auctions-">Link</a>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={3} >
                    <Card>
                        <Card.Body style={{backgroundColor:constants.COLORS.GREY, textAlign:'left', height:250}}>
                            <h5>Reserved Auctions: {auctionCount.reserved}</h5>
                            <p><em>This is an auction where the final bid for an item can be rejected by the seller if it is not high enough to satisfy them. They may set a particular fixed reserve, or they may alter the reserve over the course of the auction in response to the bids placed. Bidders are often unaware of the reserve price.</em>
                                <br/>Source: <a href="https://www.sensibledevelopment.com/auction-glossary/auction-types/what-is-a-reserve-auction">Link</a>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={3}>
                    <Card>
                        <Card.Body style={{backgroundColor:constants.COLORS.GREY, textAlign:'left', height:250}}>
                            <h5>Open Auctions: {auctionCount.open}</h5>
                            <p><em>This is an auction where bidding is public, and every bidder has full knowledge of the value of all the other bids. </em>
                                <br/>Source: <a href="https://www.sensibledevelopment.com/auction-glossary/auction-types/what-are-open-bid-sealed-bid-auctions">Link</a>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={3}>
                    <Card>
                        <Card.Body style={{backgroundColor:constants.COLORS.GREY, textAlign:'left', height:250}}>
                            <h5>Vickery Auctions: {auctionCount.vickery}</h5>
                            <p><em>A Vickrey auction is a type of sealed-bid auction. Bidders submit written bids without knowing the bid of the other people in the auction. The highest bidder wins but the price paid is the second-highest bid. </em>
                                <br/>Source: <a href="https://en.wikipedia.org/wiki/Vickrey_auction">Link</a>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <h3 style={{textAlign:'left', marginTop:30}}>Timed Auctions</h3>
            <Row>
            {timedAuctions.map((item) => 
                <Col lg={6} key={item.token}>

                <div  style={{textAlign:'left'}} >

                  <Card style={{ width: '40vw', backgroundColor:constants.COLORS.GREY, marginTop: 20}}>
                    <Card.Body>
                      <div style={{width:'50%', display:'inline-block', verticalAlign:'top'}}>
                          <img src={item.imageUrl} style={{width:330, height:350}}></img>
                      </div>
                      <div style={{width:'50%', display:'inline-block', verticalAlign:'top'}}>
                          {item.isOpen ? <h5 style={{fontFamily:'Montserrat', color:'green'}}>
                            Item is still available for bidding
                          </h5>
                           : <h5 style={{fontFamily:'Montserrat', color:'red'}}>
                            The bidding is closed for this item
                          </h5> }
                          <h3 style={{fontFamily:'Montserrat'}}>Title: {item.name}</h3>
                          
                          <h5 style={{fontFamily:'Montserrat'}}>
                            Description: {item.description}
                          </h5>
                          
                          <h5 style={{fontFamily:'Montserrat'}}>Image:  <a href={item.imageUrl} target="_blank">Link</a></h5>
                          <h5 style={{fontFamily:'Montserrat'}}>
                            Reserve Price: {item.reservePrice} wei
                          </h5>
                          <h5 style={{fontFamily:'Montserrat'}}>
                            Highest Bid: {item.highestBid} wei
                          </h5>
                          
                          
                          <h5 style={{fontFamily:'Montserrat'}}>
                            Bidding Closes At: 
                          </h5> 
                          <p><strong>{item.deadline}</strong></p>
                          <div>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control type="number" placeholder="Your Bid" onChange={(e) => setBid(e.target.value)} disabled={!item.isOpen} />
                            </Form.Group>
                          </div>
                          {item.highestBidder === props.address ? 
                            <p style={{color:'green', marginTop:10}}>You are currently the highest bidder</p>
                          : null}
                          
                      </div>   
                      
                    </Card.Body>
                    <Card.Footer>
                        <div style={{display:'inline'}}>
                            <p style={{display:'inline'}}>Creator: {item.owner}</p>
                            <Button variant="success" style={{marginLeft:'10%', display:'inline', width:200}} disabled={!item.isOpen} onClick={async () => {
                                const txn = await bidOnTimedAuction(item.id, bid);
                            }}>Bid</Button>  
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