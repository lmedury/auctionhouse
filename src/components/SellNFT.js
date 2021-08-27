import React, {useState} from 'react';
import { Card, Image, Button, Row, Col, Form, Alert, Modal } from 'react-bootstrap';
import constants from '../constants';
import loader from '../assets/img/loader.svg';
import { toAddress, toBigNumber } from "@rarible/types";

export default function SellNFT(props) {
    
    const [alert, setAlert] = useState(false);
    const [message, setMessage] = useState();
    const [variant, setVariant] = useState();
    const [loading, setLoading] = useState(false);

    const [sellOrder, setSellOrder] = useState({});
    const [show, setShow] = useState(false);
    
    function handleClose(){
        if(show) setShow(false);
        else setShow(true);
    }
    
    async function createSellOrder(item){
        console.log(item.contract);
        const request = {
            makeAssetType: {
                assetClass: "ERC721",
                contract: toAddress(constants.ERC721),
                tokenId: toBigNumber(item.token.split(':')[1]),
            },
            amount: 1,
            maker: toAddress(props.address),
            originFees: [],
            payouts: [],
            price: toBigNumber('1'),
            takeAssetType: { assetClass: "ETH" },
        }
        // Create an order
        const resultOrder = await props.sdk.order.sell(request).then(a => a.runAll())
        if (resultOrder) {
            setSellOrder(resultOrder);
            setAlert(true);
            setLoading(false);
            setVariant('success');
            setMessage(`Sell order successfully submitted to the exchange. Order Hash: ${resultOrder.hash}`);
            handleClose();
        }
        
    }

    return(
        <div className="text-center" style={{marginTop:50, overflowX:'hidden'}}>
            
            <h2>Create a Sell Order</h2>
            <Modal show={show} size="lg" onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Order Information</Modal.Title>
                </Modal.Header>
                <Modal.Body><pre>{JSON.stringify(sellOrder, null, 2)}</pre></Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="success" onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(sellOrder))
                    handleClose()
                }}>
                    Copy to Clipboard
                </Button>
                </Modal.Footer>
            </Modal>
            {loading ? 
            <div style={{marginTop:100}}>
                <img src={loader} alt="Loading" style={{width:200}}></img>
                <h3>Processing...</h3>
            </div> : null}
            
                            
            {alert ? 
            <Alert variant={variant} className="text-center" style={{width:'50%', marginLeft:'25%', marginRight:'25%'}}>
                {message}
            </Alert>: null}
            <div style={{marginTop:50}}>
                <Row>
                    <Col lg={{span: 3, offset: 3}}>
                        <Card style={{ width: '100%' }}>
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
                                await createSellOrder(props.item);
                        
                            }}>Create Sell Order</Button>
                            
                        </Form>
                    </Col>
                </Row>
            </div>
        </div>
    )
}