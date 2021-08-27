import React, {useState} from 'react';
import { Card, Image, Button, Row, Col, Form, Alert, Dropdown} from 'react-bootstrap';
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
    const [dropdownValue, setDropdownValue] = useState('Timed Auction');
    const [isTimed, setIsTimed] = useState(true);
    const [method, setMethod] = useState();

    function handleAuction(type){
        if(type === 'Timed'){
            setIsTimed(true);
            setMethod('Timed');
        }
        else if(type === 'Open'){
            setIsTimed(false);
            setMethod('Open');
        }
        else if(type === 'Reserved'){
            setIsTimed(false);
            setMethod('Reserved');
        }
        else if(type === 'Vickery'){
            setIsTimed(false);
            setMethod('Vickery');
        }
    }

    async function createAuction(){
        
        if(method === 'Timed'){
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
        }
    }
   
    return(
        <div className="text-center" style={{marginTop:50, overflowX:'hidden'}}>
            <h2>Auction your NFT</h2>
            {loading ? 
            <div style={{marginTop:100}}>
                <img src={loader} alt="Loading" style={{width:200}}></img>
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
                            <div style={{textAlign:'left', marginBottom:20}}>
                                <strong style={{display:'inline'}}>Choice of Auction:</strong>
                            <Dropdown style={{marginBottom:30, width:200, display:'inline', marginLeft:30}}>
                                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                    {dropdownValue}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    
                                    <Dropdown.Item onClick={(e) => {
                                        setDropdownValue(e.target.innerHTML);
                                        handleAuction('Timed')
                                    }}>Timed Auction</Dropdown.Item>
                                    <Dropdown.Item onClick={(e) => {
                                        setDropdownValue(e.target.innerHTML);
                                        handleAuction('Reserved')
                                    }}>Reserved Auction</Dropdown.Item>
                                    <Dropdown.Item onClick={(e) => {
                                        setDropdownValue(e.target.innerHTML);
                                        handleAuction('Open')
                                    }}>Open Auction</Dropdown.Item>
                                    <Dropdown.Item onClick={(e) => {
                                        setDropdownValue(e.target.innerHTML);
                                        handleAuction('Vickery')
                                    }}>Vickery Auction</Dropdown.Item>
                                    
                                </Dropdown.Menu>
                            </Dropdown>
                            </div>
                            {isTimed ? 
                            <Row >
                                <div style={{textAlign:'left', marginBottom:20}}><strong>Auction Active Until</strong>:</div>
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
                            </Row> : null}
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
                            <Button style={{width:"100%"}} variant="success" onClick={createAuction}>Submit For Auction</Button>
                            
                        </Form>
                    </Col>
                </Row>
            </div>
        </div>
    )
}