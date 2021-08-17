import React, {useState, useEffect} from 'react';
import { Card, Image, Button, Col, Row } from 'react-bootstrap';
import constants from '../constants';

const Web3 = require('web3');
let web3;

export default function Home(props) {

    return (
        <div className="text-center" style={{marginTop:50}}>
            <h2>Welcome To Auction House!</h2>
            <div style={{marginTop: 60, marginLeft:100, marginRight:100}}>
                <h5 style={{textAlign:'left', marginBottom:30}}>With Auction House, you can:</h5>
                <Row>
                    <Col lg="4">
                        <Card style={{backgroundColor:constants.COLORS.BLUE, color:'white', height:230}}>
                            <Card.Title>
                                Mint an NFT on Rarible Protocol
                            </Card.Title>
                            <Card.Body>
                                An NFT, or a nonfungible token, is a digital file created using blockchain computer code. It is bought using cryptocurrency such as Ether or Wax, and exists as a unique file unable to be duplicated, often just to be admired digitally.
                            </Card.Body>
                            <Card.Footer>
                                <Button variant="warning" onClick={() => props.changeRoute('Create')}>Get Started!</Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col lg="4">
                        <Card style={{backgroundColor:constants.COLORS.BLUE, color:'white', height:230}}>
                            <Card.Title>
                                Put your NFT on Auction
                            </Card.Title>
                            <Card.Body>
                                Auction House provides the sellers with the flexibility of choosing their desired type of auction to sell their NFT. We currently support Timed, Open, Reserved, and Vickery Auctions.
                            </Card.Body>
                            <Card.Footer>
                                <Button variant="warning" onClick={() => props.changeRoute('List')}>Get Started!</Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col lg="4">
                        <Card style={{backgroundColor:constants.COLORS.BLUE, color:'white', height:230}}>
                            <Card.Title>
                                Transfer NFT
                            </Card.Title>
                            <Card.Body>
                                Users can transfer their Non-fungible tokens to any Ethereum address after the auction, or just a gift! The transfer is powered and secured by the Rarible Protocol
                            </Card.Body>
                            <Card.Footer>
                                <Button variant="warning" onClick={() => props.changeRoute('List')}>Get Started!</Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
        
    )
}