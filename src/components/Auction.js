import React, {useState, useEffect} from 'react';
import { Card, Image, Button, Row, Col, Form, Alert } from 'react-bootstrap';
import constants from '../constants';
import createTimedAuction from '../ethereum/web3';
import loader from '../assets/img/loader.svg';

export default function Auction(props) {
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState();
    const [price, setPrice] = useState(0);
    const [alert, setAlert] = useState(false);
    const [message, setMessage] = useState();
    const [variant, setVariant] = useState();
    const [loading, setLoading] = useState(false);
   
    return(
        <div className="text-center" style={{marginTop:50}}>
            <h2>Auction your NFT</h2>
            {loading ? 
            <div style={{marginTop:100}}>
                <img src={loader} style={{width:200}}></img>
                <h3>Processing...</h3>
            </div> : null}
            
                            
            {alert ? 
            <Alert variant={variant} className="text-center" style={{width:'50%', marginLeft:'25%'}}>
                {message}
            </Alert>: null}
            <div style={{marginTop:50}}>
                <Row>
                    <Col lg={{span: 3, offset: 3}}>
                        <Card style={{ width: 400 }}>
                            <Card.Body>
                                <Image src={props.item.imageUrl || 'https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547__480.jpg' } rounded style={{width:350}} />  
                            </Card.Body>
                            <div className="text-center" style={{ height:'100%', backgroundColor:constants.COLORS.BLUE}}>
                                <h3 style={{color:'white', flexGrow:1}}>{props.item.name}</h3>
                                <p style={{color:'white', flexGrow:1}}>{props.item.description}</p>
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
                                    <Form.Group className="mb-3" >
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
                                <Form.Control type="text" value={props.item.token} disabled />
                            </Form.Group>

                            <div style={{textAlign:'left', marginBottom:20, marginTop:20}}><strong>Auction Contract Address</strong>:</div>
                            <Form.Group className="mb-3">
                                <Form.Control type="text" value={constants.AUCTION_CONTRACT} disabled />
                            </Form.Group>
                            <Button style={{width:"100%"}} variant="success" onClick={async() => {
                                setLoading(true);
                                let res = await createTimedAuction(props.item.token||'1', price, date, time, props.address || '0xDb9F310D544b58322aBA88881f6bAA4F7B4AD666');
                        
                                if(res.success){
                                    setMessage('Congratulations! Your NFT is successfully put up for Auction!');
                                    setAlert(true);
                                    setVariant('success');
                                    setLoading(false);
                                }
                                else{
                                    setMessage(`Oh oh! There was some trouble with your transaction. Message: ${res.err.message}`);
                                    setAlert(true);
                                    setVariant('danger');
                                    setLoading(false);
                                }
                            }}>Submit For Auction</Button>
                            
                        </Form>
                    </Col>
                </Row>
            </div>
        </div>
    )
}