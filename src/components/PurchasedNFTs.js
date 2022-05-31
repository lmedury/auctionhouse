import React, {useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import {Col, Row, Card, Modal, Alert} from 'react-bootstrap';
import constants from "../constants";
import {getTimedAuctions} from '../ethereum/web3';
import error from '../assets/img/error.jpg';
import loader from '../assets/img/loader.svg';
import { RARIBLE_DEV_LINK } from "../assets/js/constants";


export default function PurchasedNFTs(props){

    const [timedAuctionsLoaded, setTimedAuctionsLoaded] = useState(false);
    const [timedAuctions, setTimedAuctions] = useState([]);
    const [sellOrder, setOrderInformation] = useState({});
    const [show, setShow] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [alert, setAlert] = useState(false);

    
    function handleClose(){
        if(show) setShow(false);
        else setShow(true);
    }

    async function loadTimedAuctions(){
        const auctions = await getTimedAuctions();
        
        for(let i=0; i<auctions.length; i++){
            const token = auctions[i][0];
            if(auctions[i][4]!==props.address || auctions[i][6] === true) continue;
            
            let meta = await fetch(`${RARIBLE_DEV_LINK}/items/ETHEREUM:${constants.ERC721}:${token}`)
            .then((res) => res.json());
            
            meta.token = token;
            for(let key in meta.image) {
                for(let url in meta.image[key]){
                    const imageUrl = meta.image[key][url];
                    
                    if(imageUrl.split('/')[0] === 'ipfs:'){
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
    
    if(!timedAuctionsLoaded){
        loadTimedAuctions();
        setTimedAuctionsLoaded(true); 
    }

    async function claim(){
        setProcessing(true);
        try{
            await props.sdk.order.fill(sellOrder, {amount: '1'}).then(a => a.runAll());
            setAlert(true);
        }catch(err){
            setProcessing(false);
        }
        
    }

    async function getSellOrder(token){
        let collectionContract = constants.ERC721;
        let sellOrders = await fetch(`${RARIBLE_DEV_LINK}/ethereum/order/orders/sell/byItem?contract=${collectionContract}&tokenId=${token}&sort=LAST_UPDATE`);
        sellOrders = await sellOrders.json();
        if(sellOrders.orders.length>0){
            sellOrders = sellOrders.orders[0];
            console.log(sellOrders);
        }
        setOrderInformation(sellOrders);
        handleClose();
        setLoaded(true);
    }

    return (
        <div className="text-center" style={{overflowX:'hidden'}}>
            <h2>NFTs Purchased Through Auction House</h2>
            {loaded ? 
            <Modal show={show} size="lg" onHide={handleClose}>
                <Modal.Header >
                <Modal.Title>Sell Order Information</Modal.Title>
                </Modal.Header>
                <div className="text-center">
                    <h3>Fill Order Information</h3>
                </div>
                {sellOrder.maker ? 
                <div style={{marginLeft:20, marginTop:30}}>
                    <p>Contract: {sellOrder.make.assetType.contract || 'Contract'}</p>
                    <p>Token Id: {sellOrder.make.assetType.tokenId || 'Token'}</p>
                    <p>Owner: {sellOrder.maker || 'Maker'}</p>
                    <p>Price: {sellOrder.take.value || 'Value'} wei</p>
                    <hr/>
                    <h6>Additional Information:</h6>
                    
                    <p>Salt: {sellOrder.salt || 'Salt'}</p>
                    
                </div> : 
                <div className="text-center">
                    <img src={error} alt="loader" style={{width:'20%'}}></img>
                    <h5>No sell orders available at the moment</h5>
                </div> }
               
                
                <p></p>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="success" disabled={!sellOrder.maker} onClick={() => {
                    claim();
                    handleClose();
                }}>
                    Fill Order
                </Button>
                </Modal.Footer>
            </Modal> : null}

            
            <Modal show={processing} size="lg" onHide={handleClose}>
                <Modal.Header >
                <Modal.Title>Sell Order Information</Modal.Title>
                </Modal.Header>
                <div className="text-center">
                    <h3>Submitted Transaction</h3>
                    {alert ? 
                    <Alert variant="success" style={{margin:30}}>
                        Congratulations! You have received your NFT. You can check the NFTs you have in My NFTs
                        
                    </Alert>: null}
                
                <img src={loader} alt="loader" style={{width:'30%'}}></img>
                </div>
                <p></p>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setProcessing(false)}>
                    Close
                </Button>
                <Button variant="success" onClick={() => {
                    setProcessing(false);
                }}>
                    Thank you!
                </Button>
                </Modal.Footer>
            </Modal> 
            
            <Row style={{marginLeft:50}}>
            {timedAuctions.map((item) => 
                <Col lg={6} key={item.token}>

                <div  style={{textAlign:'left'}} >

                  <Card className="card-class" style={{ width: '40vw',height:'100%', marginTop: 20}}>
                    <Card.Body>
                      
                      <div style={{width:'50%', display:'inline-block', verticalAlign:'top'}}>
                          <img src={item.imageUrl} alt={item.name} style={{width:'95%', height:250, borderRadius:10}}></img>
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
                          
                          {!false ? <Button variant="success" style={{width:'100%'}} onClick={() => {
                              handleClose();
                              getSellOrder(item.token);
                            }}>Claim NFT</Button> : null}
                          
                    
                      </div>   
                      
                    </Card.Body>
                    <Card.Footer>
                        <div style={{display:'inline'}}>
                            <p style={{display:'inline'}}>Creator: <a target="_blank" rel="noreferrer" href={`https://ropsten.etherscan.io/address/${item.owner}`}>{item.owner}</a></p>
                            <a target="_blank" rel="noreferrer" href={item.imageUrl}><Button variant="warning" style={{marginLeft:30}}>View Image on IPFS</Button></a>
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