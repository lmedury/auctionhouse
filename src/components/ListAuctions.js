import React, {useState, useEffect} from 'react';
import { Card, Image, Button, Row, Col, Form, Alert } from 'react-bootstrap';
import constants from '../constants';
import { listAuctions, getTimedAuctions } from '../ethereum/web3';

export default function ListAuctions(props){
    
    const [countLoaded, setCountLoaded] = useState(false);
    const [timedAuctionsLoaded, setTimedAuctionsLoaded] = useState(false);
    const [auctionCount, setAuctionCount] = useState({});
    const [timedAuctions, setTimedAuctions] = useState([]);

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
        setTimedAuctions(auctions);
    }
    
    if(!countLoaded){
        loadCount();
    }   
    if(!timedAuctionsLoaded){
        loadTimedAuctions();
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

        </div>
        
    )
}