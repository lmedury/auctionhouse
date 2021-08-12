import React, {useState, useEffect} from 'react';
import { Card, Image, Button, Row, Col, Form } from 'react-bootstrap';
import constants from '../constants';
import createTimedAuction from '../ethereum/web3';

export default function Auction(props) {
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState();
    const [price, setPrice] = useState(0);

    return(
        <div className="text-center" style={{marginTop:50}}>
            <h2>Auction your NFT</h2>
            <div style={{marginTop:50}}>
                <Row>
                    <Col lg={{span: 3, offset: 3}}>
                        <Card style={{ width: 400 }}>
                            <Card.Body>
                                <Image src={props.imageUrl || 'https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547__480.jpg' } rounded style={{width:350}} />  
                            </Card.Body>
                            <div className="text-center" style={{ height:'100%', backgroundColor:constants.COLORS.BLUE}}>
                                <h3 style={{color:'white', flexGrow:1}}>{props.name || 'Default Title'}</h3>
                                <p style={{color:'white', flexGrow:1}}>{props.description || 'Default Description'}</p>
                            </div>
                        </Card>
                    </Col>
                    <Col lg={{span: 3}}>
                        <Form>
                            <div style={{textAlign:'left', marginBottom:20}}><strong>Auction Active Until</strong>:</div>
                            <Row>
                                <Col lg="6">
                                    <Form.Group className="mb-3">
                                        <Form.Control type="date" onChange={(e) => {
                                            setDate(e.target.value);
                                        }} placeholder="Date" />
                                    </Form.Group>
                                </Col>
                                <Col lg="6">
                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Form.Control type="time" onChange={(e) => {
                                            setTime(e.target.value);
                                        }} placeholder="Time" />
                                    </Form.Group>
                            
                                </Col>
                            </Row>
                            <div style={{textAlign:'left', marginBottom:20, marginTop:20}}><strong>Reserve Price of your item</strong>:</div>
                            <Row>
                                <Col lg="12">
                                    <Form.Group className="mb-3">
                                        <Form.Control type="number" onChange={(e) => {
                                            setPrice(e.target.value);
                                        }} placeholder="Reserve Price" />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div style={{textAlign:'left', marginBottom:20, marginTop:20}}><strong>Token ID</strong>:</div>
                            <Form.Group className="mb-3">
                                <Form.Control type="text" value={props.tokenId || "1"} disabled />
                            </Form.Group>

                            <div style={{textAlign:'left', marginBottom:20, marginTop:20}}><strong>Auction Contract Address</strong>:</div>
                            <Form.Group className="mb-3">
                                <Form.Control type="text" value={constants.AUCTION_CONTRACT} disabled />
                            </Form.Group>
                            <Button style={{width:"100%"}} variant="success" onClick={() => {
                                createTimedAuction(props.tokenId||'1', price, date, time, props.address || '0xDb9F310D544b58322aBA88881f6bAA4F7B4AD666')
                            }}>Submit For Auction</Button>
                            
                        </Form>
                    </Col>
                </Row>
            </div>
        </div>
    )
}