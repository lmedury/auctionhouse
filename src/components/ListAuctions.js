import React, {useState} from 'react';
import { Card,  Button, Row, Col, Form, Modal, Alert, Dropdown } from 'react-bootstrap';
import constants from '../constants';
import { listAuctions, getTimedAuctions, bidOnTimedAuction, closeTimedAuction } from '../ethereum/web3';
import loader from '../assets/img/loader.svg';
import soldicon from '../assets/img/Sold.png';
import likes from '../assets/img/likes.png';
import { RARIBLE_DEV_LINK } from '../assets/js/constants';

export default function ListAuctions(props){
    
    const [countLoaded, setCountLoaded] = useState(false);
    const [timedAuctionsLoaded, setTimedAuctionsLoaded] = useState(false);
    const [auctionCount, setAuctionCount] = useState({});
    const [timedAuctions, setTimedAuctions] = useState([]);
    const [bid, setBid] = useState();
    const [show, setShow] = useState(false);
    const [auctionItem, setAuctionItem] = useState();
    const [loading, setLoading] = useState(false);
    const [sold, setSold] = useState(false);
    const [dropdownValue, setDropdownValue] = useState('Timed Auction');    
    const [processing, setProcessing] = useState(false);
    
    function handleClose(){
        if(show) setShow(false);
        else setShow(true);
    }
    
    function closeModal(){
        if(processing) setProcessing(false);
        else setProcessing(true);
    }

    async function loadCount(){
        const counts = await listAuctions();
        const timed = counts.timed !=="0" ? counts.timed : Math.floor(Math.random()*30);
        const reserved = counts.reserved !=="0" ? counts.reserved : Math.floor(Math.random()*30);
        const open = counts.open !=="0" ? counts.reserved : Math.floor(Math.random()*30);
        const vickery = counts.vickery !=="0" ? counts.reserved : Math.floor(Math.random()*30);
        setAuctionCount({
            timed: timed ,
            reserved: reserved,
            open: open,
            vickery: vickery
        });
        setCountLoaded(true);
    }

    async function loadTimedAuctions(){
        const auctions = await getTimedAuctions();
        let nfts = [];
        try{
            for(let i=0; i<auctions.length; i++){
                const token = auctions[i][0];
                let meta = await fetch(`${RARIBLE_DEV_LINK}/items/ETHEREUM:${constants.ERC721}:${token}`)
                meta = await meta.json();
                
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
                        meta.likes = Math.floor(Math.random()*10);
                        
                    }
                    break;
                }
                nfts.push(meta);
                
            }
        } catch(err) {

        }
        setTimedAuctions(nfts.reverse());    
    }
    
    if(!countLoaded){
        loadCount();
    }   
    if(!timedAuctionsLoaded){
        loadTimedAuctions();
        setTimedAuctionsLoaded(true); 
    }
    
    return(
        <div className="text-center" style={{marginLeft:'5%', overflowX:'hidden'}}>
            <h2><strong>NFT Auctions</strong></h2>
            <Row style={{marginTop:50, marginRight:50}}>
                <Col lg={3}>
                    <Card className='card-class'>
                        <Card.Body>
                            <h5><strong>Timed Auctions: </strong>{auctionCount.timed}</h5>
                            <p><em>Timed auctions don’t have an auctioneer calling the bids – there’s just a bidding window and whoever bids highest during it wins (as long as the reserve’s met of course). You'll know it's a timed auction as the end time will be displaced on the lot page.</em>
                                <br/>Source: <a href="https://support.the-saleroom.com/hc/en-gb/articles/115000058754-What-s-the-difference-between-live-and-timed-auctions-">Link</a>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={3} >
                    <Card className='card-class'>
                        <Card.Body >
                            <h5><strong>Reserved Auctions: </strong>{auctionCount.reserved}</h5>
                            <p><em>This is an auction where the final bid for an item can be rejected by the seller if it is not high enough to satisfy them. They may set a particular fixed reserve, or they may alter the reserve over the course of the auction in response to the bids placed. Bidders are often unaware of the reserve price.</em>
                                <br/>Source: <a href="https://www.sensibledevelopment.com/auction-glossary/auction-types/what-is-a-reserve-auction">Link</a>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={3}>
                    <Card className='card-class'>
                        <Card.Body >
                            <h5><strong>Open Auctions: </strong>{auctionCount.open}</h5>
                            <p><em>This is an auction where bidding is public, and every bidder has full knowledge of the value of all the other bids. </em>
                                <br/>Source: <a href="https://www.sensibledevelopment.com/auction-glossary/auction-types/what-are-open-bid-sealed-bid-auctions">Link</a>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={3}>
                    <Card className='card-class'>
                        <Card.Body >
                            <h5><strong>Vickery Auctions: </strong>{auctionCount.vickery}</h5>
                            <p><em>A Vickrey auction is a type of sealed-bid auction. Bidders submit written bids without knowing the bid of the other people in the auction. The highest bidder wins but the price paid is the second-highest bid. </em>
                                <br/>Source: <a href="https://en.wikipedia.org/wiki/Vickrey_auction">Link</a>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <div style={{textAlign:'left', marginTop:30}}>
                <h3 style={{textAlign:'left', display:'inline'}}>Type of Auction:</h3>
                <Dropdown style={{marginBottom:30, width:200, display:'inline', marginLeft:30}}>
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                        {dropdownValue}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        
                        <Dropdown.Item onClick={(e) => {
                            setDropdownValue(e.target.innerHTML);
                            
                        }}>Timed Auction</Dropdown.Item>
                        <Dropdown.Item onClick={(e) => {
                            setDropdownValue(e.target.innerHTML);
                            
                        }}>Reserved Auction</Dropdown.Item>
                        <Dropdown.Item onClick={(e) => {
                            setDropdownValue(e.target.innerHTML);
                            
                        }}>Open Auction</Dropdown.Item>
                        <Dropdown.Item onClick={(e) => {
                            setDropdownValue(e.target.innerHTML);
                            
                        }}>Vickery Auction</Dropdown.Item>
                        
                    </Dropdown.Menu>
                </Dropdown>
                </div>
            <Row>
            {timedAuctions.map((item) => 
                <Col lg={{span:6}} key={item.token}>

                <div  style={{textAlign:'left'}} >

                  <Card className='card-class' style={{width:'43vw', marginTop: 20}}>
                    <Card.Body>
                    {item.isOpen ? null
                    : <h5 style={{fontFamily:'Montserrat', color:'green', marginTop:10}}>
                    Winner: {item.highestBidder} <img style={{width:80, marginLeft:30}} alt="Sold" src={soldicon}></img>
                    </h5> }
                      <div style={{width:'50%', display:'inline-block', verticalAlign:'top'}}>
                          <img src={item.imageUrl} alt={item.name} style={{width:'95%', height:350, borderRadius:10}}></img>
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
                          
                          <h5 style={{fontFamily:'Montserrat'}}>Image:  <a href={item.imageUrl} rel="noreferrer" target="_blank">Link</a></h5>
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
                                <Form.Control type="number" placeholder="Your Bid" onChange={(e) => setBid(e.target.value)} disabled={!item.isOpen || (new Date(item.deadline) < new Date())} />
                            </Form.Group>
                          </div>
                          {item.highestBidder === props.address ? 
                            <p style={{color:'green', marginTop:10}}>You are currently the highest bidder</p>
                          : null}
                          
                          
                      </div>   
                      
                      
                    </Card.Body>
                    <Card.Footer>
                        <Row>
                            <Col lg="8" md="12">
                                <p style={{display:'inline'}}>Creator: <a target="_blank" rel="noreferrer" href={`https://ropsten.etherscan.io/address/${item.owner}`}>{item.owner}</a></p>
                            </Col>
                            <Col lg="3">
                                <Row>
                                    <Col lg="5">
                                        <p style={{display:'inline'}}><img src={likes} alt="Likes" style={{width:30,display:'inline', marginRight:5}}></img>{item.likes}</p>
                                    </Col>
                                    <Col lg="6">
                                        {item.owner === props.address ? 
                                        <Button variant="danger" style={{width:150}} disabled={!item.isOpen} onClick={async () => {
                                            handleClose();
                                            setAuctionItem(item);
                                        }}>Close Auction</Button>
                                        : 
                                        <Button variant="success" style={{width:150}} disabled={!item.isOpen || (new Date(item.deadline) < new Date())} onClick={async () => {
                                            
                                            await bidOnTimedAuction(item.id, bid);
                                            setProcessing(true);
                                            
                                        }}>{item.highestBidder === props.address ? 'Increase Bid': 'Bid'}</Button>  }
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        
                    </Card.Footer>
                  </Card>

                    </div>
                </Col>
                
                
                
            )}
            </Row>
            <Modal show={show} size="lg" onHide={handleClose}>
                <Modal.Header >
                <Modal.Title>Closing Auction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {sold ? <Alert variant="success" className="text-center">
                    You have successfully closed the auction!
                </Alert> : null }
                
                {!loading && auctionItem ? 
                    
                    <Row>
                        <Col lg={6}>
                            <img src={auctionItem.imageUrl} alt={auctionItem.name} style={{width:350}}></img>
                        </Col>
                        <Col lg={6}>
                            <h3 style={{fontFamily:'Montserrat'}}><strong>{auctionItem.name}</strong></h3>
                            <h6 style={{fontFamily:'Montserrat'}}>{auctionItem.description}</h6>
                            <h5 style={{fontFamily:'Montserrat', marginTop:120, color:'green'}}><strong>Final Bid: {auctionItem.highestBid} wei</strong></h5>
                        </Col>
                        
                    </Row>
                    
                : 
                    <div className="text-center">
                        <img src={loader} alt="Loading" style={{width:200}}></img>
                        <p><strong>Processing...</strong></p>
                    </div>
                }
                
    
                </Modal.Body>
                <Modal.Footer>
                
                <Button variant="secondary" onClick={handleClose}>
                    Back
                </Button>
                <Button variant="danger" onClick={async () => {
                    setLoading(true);
                    const res = await closeTimedAuction(auctionItem.id);
                    if(res.success){
                        setLoading(false);
                        setSold(true);
                    }
                }}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={processing}>
                <Modal.Header>
                <Modal.Title>Congratulations!</Modal.Title>
                </Modal.Header>
                <div style={{textAlign:'center'}}>
                    <Modal.Body> 
                        <h5 style={{fontFamily:'Montserrat'}}>Congratulations, you've successfully submitted your bid of <strong>{bid}</strong> wei!</h5>
                        <img alt="success" src='https://uxwing.com/wp-content/themes/uxwing/download/48-checkmark-cross/success-green-check-mark.png' style={{width:300, margin:50}} />
                    </Modal.Body>
                </div>
                
                <Modal.Footer>
                
                <Button variant="success" onClick={closeModal}>
                    Thank You
                </Button>
                </Modal.Footer>
            </Modal>

        </div>
        
    )
}