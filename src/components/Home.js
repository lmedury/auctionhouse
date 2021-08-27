import React, {useState} from 'react';
import { Card, Button, Col, Row } from 'react-bootstrap';
import constants from '../constants';
import nfts from '../assets/img/nfts.jpg';
import rarible from '../assets/img/rarible.png';
import auctioned from '../assets/img/auctioned.png';
import transfer from '../assets/img/Transfer.png';
import nfttoken from '../assets/img/nfttoken.png';
import soldicon from '../assets/img/Sold.png';
import auctionicon from '../assets/img/auctionicon.png';

export default function Home(props) {

    const [count, setCount] = useState({});
    const [load, setLoad] = useState(false);
    if(!load){
        setLoad(true);
        const mint = Math.floor(Math.random()*100);
        const auctioned = Math.floor(Math.random()*mint);
        const sold = Math.floor(Math.random()*auctioned);
        setCount({
            mint:mint,
            auctioned:auctioned,
            sold:sold
        })
    }


    return (
        <div className="text-center" style={{marginTop:50}}>
            <h2><strong>Welcome To Auction House!</strong></h2>
            <div style={{marginTop: 30, marginLeft:100, marginRight:100}}>
                <h5 style={{textAlign:'left', marginBottom:30}}><strong>In Auction house:</strong></h5>
                <Row>
                    <Col lg="4" md="12" sm="12" style={{marginTop:20}}>
                        <Card style={{backgroundColor:constants.COLORS.GREY, textAlign:'left', height:'100%',borderColor:constants.COLORS.ORANGE, borderWidth:3}}>
                            <div style={{marginLeft:30}}>
                                <h2 style={{display:'inline'}}><strong>{count.mint}</strong> NFTs Minted</h2>
                                <img src={nfttoken} alt="NFT" style={{width:'20%', marginLeft:'30%'}}></img>
                                
                            </div>
                            
                            
                        </Card>
                    </Col>
                    <Col lg={{span:"4"}} md="12" style={{marginTop:20}}>
                        <Card style={{backgroundColor:constants.COLORS.GREY, textAlign:'left', height:'100%',borderColor:constants.COLORS.ORANGE, borderWidth:3}}>
                            <div style={{marginLeft:30}}>
                                <h2 style={{display:'inline'}}><strong>{count.auctioned}</strong> NFTs Auctioned</h2>
                                <img src={auctionicon} alt="Auction" style={{width:'20%', marginLeft:'20%'}}></img>
                                
                            </div>
                            
                        </Card>
                    </Col>
                    <Col lg={{span:"4"}} md="12" style={{marginTop:20}}>
                        <Card style={{backgroundColor:constants.COLORS.GREY, textAlign:'left', height:'100%',borderColor:constants.COLORS.ORANGE, borderWidth:3}}>
                            <div style={{marginLeft:30}}>
                                <h2 style={{display:'inline'}}><strong>{count.sold}</strong> NFTs Sold</h2>
                                <img src={soldicon} alt="Sold" style={{width:'20%', marginLeft:'40%'}}></img>
                                
                            </div>
                            
                        </Card>
                    </Col>
                </Row>
            </div>

            <div style={{marginTop: 60, marginLeft:100, marginRight:100}}>
                <h5 style={{textAlign:'left', marginBottom:30}}><strong>With Auction House, you can:</strong></h5>
                <Row>
                    <Col lg="4" md="12" style={{marginTop:20}}>
                        <Card style={{backgroundColor:constants.COLORS.GREY, height:'100%',borderColor:constants.COLORS.ORANGE, borderWidth:3}}>
                            <Card.Title style={{marginTop:20}}>
                                <strong>Mint an NFT on Rarible Protocol</strong>
                            </Card.Title>
                            <Card.Body>
                                <img src={nfts} alt="NFT" style={{width:'35%', marginRight:20}}></img><h1 style={{display:'inline'}}>+</h1><img src={rarible} alt="Rarible" style={{width:'20%',marginLeft:20}}></img>
                                <p style={{marginTop:20}}>An NFT, or a nonfungible token, is a digital file created using blockchain computer code. It is bought using cryptocurrency such as Ether or Wax, and exists as a unique file unable to be duplicated, often just to be admired digitally.</p>
                            </Card.Body>
                            <Card.Footer>
                                <Button style={{backgroundColor:constants.COLORS.BLUE}} onClick={() => props.changeRoute('Create')}>Get Started!</Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col lg="4" md="12" style={{marginTop:20}}>
                        <Card style={{backgroundColor:constants.COLORS.GREY, height:'100%',borderColor:constants.COLORS.ORANGE, borderWidth:3}}>
                            <Card.Title style={{marginTop:20}}>
                                <strong>Put your NFT on Auction</strong>
                            </Card.Title>
                            <Card.Body>
                                <img src={auctioned} alt="Auctioned" style={{width:'40%'}}></img>
                                <p style={{marginTop:10}}>Auction House provides the sellers with the flexibility of choosing their desired type of auction to sell their NFT. We currently support Timed, Open, Reserved, and Vickery Auctions.</p>
                            </Card.Body>
                            <Card.Footer>
                                <Button style={{backgroundColor:constants.COLORS.BLUE}} onClick={() => props.changeRoute('List')}>Get Started!</Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col lg="4" md="12" style={{marginTop:20}}>
                        <Card style={{backgroundColor:constants.COLORS.GREY, height:'100%',borderColor:constants.COLORS.ORANGE, borderWidth:3}}>
                            <Card.Title style={{marginTop:20}}>
                                <strong>Transfer NFT</strong>
                            </Card.Title>
                            <Card.Body>
                                <img src={transfer} alt="Transfer" style={{width:'40%', backgroundColor:constants.COLORS.GREY}}></img>
                                <p style={{marginTop:10}}>Users can transfer their Non-fungible tokens to any Ethereum address after the auction, or just as a gift! The transfer is powered and secured by the Rarible Protocol.</p>
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