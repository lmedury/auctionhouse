import React, {useState, useEffect} from 'react';
import { Card, Image, Button, Col, Row } from 'react-bootstrap';
import constants from '../constants';
import { listAuctions} from '../ethereum/web3';
import nfts from '../assets/img/nfts.jpg';
import rarible from '../assets/img/rarible.png';
import auctioned from '../assets/img/auctioned.png';
import transfer from '../assets/img/Transfer.png';
import nfttoken from '../assets/img/nfttoken.png';
import soldicon from '../assets/img/Sold.png';
import auctionicon from '../assets/img/auctionicon.png';

const Web3 = require('web3');
let web3;

export default function Home(props) {

    const [countOfAuctions, setCountOfAuctions] = useState(0);

    async function getCount(){
        const auctions = await listAuctions();
        const count = auctions.timed + auctions.reserved + auctions.open + auctions.vickery;
        return count;
    }

    if(!countOfAuctions) {
        const count = getCount();
        setCountOfAuctions(count);
    }

    return (
        <div className="text-center" style={{marginTop:50}}>
            <h2>Welcome To Auction House!</h2>
            <div style={{marginTop: 60, marginLeft:100, marginRight:100}}>
                <h5 style={{textAlign:'left', marginBottom:30}}>In Auction house:</h5>
                <Row>
                    <Col lg="3">
                        <Card style={{backgroundColor:constants.COLORS.GREY, textAlign:'left'}}>
                            <div style={{marginLeft:30}}>
                                <h2 style={{display:'inline'}}>NFTs Minted</h2>
                                <img src={nfttoken} style={{width:100, marginLeft:70}}></img>
                                <h5>56</h5>
                            </div>
                            
                            
                        </Card>
                    </Col>
                    <Col lg={{span:"3", offset:"1"}}>
                        <Card style={{backgroundColor:constants.COLORS.GREY, textAlign:'left'}}>
                            <div style={{marginLeft:30}}>
                                <h2 style={{display:'inline'}}>NFTs Auctioned</h2>
                                <img src={auctionicon} style={{width:80, marginLeft:50}}></img>
                                <h5 style={{marginTop:30}}>20</h5>
                            </div>
                            
                        </Card>
                    </Col>
                    <Col lg={{span:"3", offset:"1"}}>
                        <Card style={{backgroundColor:constants.COLORS.GREY, textAlign:'left'}}>
                            <div style={{marginLeft:30}}>
                                <h2 style={{display:'inline'}}>NFTs Sold</h2>
                                <img src={soldicon} style={{width:100, marginLeft:100}}></img>
                                <h5 style={{marginTop:30}}>12</h5>
                            </div>
                            
                        </Card>
                    </Col>
                </Row>
            </div>

            <div style={{marginTop: 60, marginLeft:100, marginRight:100}}>
                <h5 style={{textAlign:'left', marginBottom:30}}>With Auction House, you can:</h5>
                <Row>
                    <Col lg="4">
                        <Card style={{backgroundColor:constants.COLORS.GREY, height:380}}>
                            <Card.Title style={{marginTop:20}}>
                                Mint an NFT on Rarible Protocol
                            </Card.Title>
                            <Card.Body>
                                <img src={nfts} style={{width:'35%', marginRight:20}}></img><h1 style={{display:'inline'}}>+</h1><img src={rarible} style={{width:'20%',marginLeft:20}}></img>
                                <p style={{marginTop:20}}>An NFT, or a nonfungible token, is a digital file created using blockchain computer code. It is bought using cryptocurrency such as Ether or Wax, and exists as a unique file unable to be duplicated, often just to be admired digitally.</p>
                            </Card.Body>
                            <Card.Footer>
                                <Button style={{backgroundColor:constants.COLORS.BLUE}} onClick={() => props.changeRoute('Create')}>Get Started!</Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col lg="4">
                        <Card style={{backgroundColor:constants.COLORS.GREY, height:380}}>
                            <Card.Title style={{marginTop:20}}>
                                Put your NFT on Auction
                            </Card.Title>
                            <Card.Body>
                                <img src={auctioned} style={{width:'40%'}}></img>
                                <p style={{marginTop:10}}>Auction House provides the sellers with the flexibility of choosing their desired type of auction to sell their NFT. We currently support Timed, Open, Reserved, and Vickery Auctions.</p>
                            </Card.Body>
                            <Card.Footer>
                                <Button style={{backgroundColor:constants.COLORS.BLUE}} onClick={() => props.changeRoute('List')}>Get Started!</Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col lg="4">
                        <Card style={{backgroundColor:constants.COLORS.GREY, height:380}}>
                            <Card.Title style={{marginTop:20}}>
                                Transfer NFT
                            </Card.Title>
                            <Card.Body>
                                <img src={transfer} style={{width:'40%', backgroundColor:constants.COLORS.GREY}}></img>
                                <p style={{marginTop:10}}>Users can transfer their Non-fungible tokens to any Ethereum address after the auction, or just a gift! The transfer is powered and secured by the Rarible Protocol</p>
                            </Card.Body>
                            <Card.Footer>
                                <Button style={{backgroundColor:constants.COLORS.BLUE}} onClick={() => props.changeRoute('List')}>Get Started!</Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
        
    )
}