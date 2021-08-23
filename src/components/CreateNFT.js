import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import {Col, Container, Row, Image, Form, Card, Modal} from 'react-bootstrap';
import constants from "../constants";
import rarible from '../assets/img/rarible.png';
import { toAddress } from "@rarible/types";
import ipfsImage from '../assets/img/ipfs.png';
import metamask from '../assets/img/metamask.svg';

const ipfsAPI = require('ipfs-http-client');
//const ipfs = ipfsAPI({host: 'ipfs.infura.io', port: '5001', protocol: 'https' });
const ipfs = ipfsAPI.create('https://ipfs.infura.io:5001');



const JSON_BODY = {
  description: "It's actually a bison?",
  external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
  image: "https://austingriffith.com/images/paintings/buffalo.jpg",
  name: "Buffalo",
  attributes: [
    {
      trait_type: "BackgroundColor",
      value: "green",
    },
    {
      trait_type: "Eyes",
      value: "googly",
    },
  ],
};

export default function CreateNFT(props) {

    const [fileLoaded, setFileLoaded] = useState(false);
    const [filePath, setFilePath] = useState('');
    const [title, setTitle] = useState('Title');
    const [description, setDescription] = useState('Description');
    const [show, setShow] = useState(false);

    function handleClose () {
        if(show) setShow(false);
        else setShow(true);
    }

    async function uploadFile(e) {
        const file = e.target.files[0];
        const added = await ipfs.add(file);
        const url = `https://ipfs.infura.io/ipfs/${added.path}`
        setFileLoaded(true);
        setFilePath(url);
    }

    async function create() {
        
        let doc = JSON_BODY;
        doc.description = description;
        doc.name = title;
        doc.image = filePath;
        doc.external_url = filePath;
        const docHash = await ipfs.add(JSON.stringify(doc));
        console.log(docHash.path);
        console.log(props.address); 
        try{
            const item = await props.sdk?.nft.mintLazy({
                '@type': 'ERC721', // type of NFT to mint
                contract: toAddress('0xB0EA149212Eb707a1E5FC1D2d3fD318a8d94cf05'), // rinkeby default Rarible collection
                uri: `/ipfs/${docHash.path}`, // tokenUri, url to media that nft stores
                creators: [{ account: toAddress(props.address), value: 10000 }], // list of creators
                royalties: [], // royalties
            });
            console.log(item);
        }catch(err){
            console.log(err);
        }
        
        handleClose();
    }

    return (
        <Container>
            <Row>
                <div className="text-center" style={{alignContent:'center'}}>
                <div style={{marginBottom:50}}>
                    <h3 style={{marginBottom: 50, display:'inline'}}>List your NFT on </h3><Image src={rarible} style={{display:'inline', width:50}} />
                </div>
                    {fileLoaded ? 
                    <Row>
                        <Col lg="6">
                            <Card style={{ width: 600 }}>
                                <Card.Body>
                                    <Image src={filePath} rounded style={{width:550}} />  
                                </Card.Body>
                                <div className="text-center" style={{ height:'100%', backgroundColor:constants.COLORS.BLUE}}>
                                    <h3 style={{color:'white', flexGrow:1}}>{title}</h3>
                                    <p style={{color:'white', flexGrow:1}}>{description}</p>
                                </div>
                            </Card>
                        </Col>

                        <Col lg="6">
                            <Form>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    
                                    <Form.Control type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                    <Form.Control as="textarea" rows={3} placeholder="Description" onChange={(e) => setDescription(e.target.value)}  />
                                </Form.Group>
                            </Form>
                            <Button variant="success" onClick={create}>Create</Button>
                        </Col>
                    </Row>
                :
                <Form.Group controlId="formFile" className="mb-3">
                    <div style={{textAlign:'left'}}>
                        <h3>How is an NFT Created?</h3>
                        <Row className="text-center" style={{marginTop:30, fontFamily:'Montserrat'}}>
                            <Col lg="4">
                                <Card style={{backgroundColor:constants.COLORS.GREY, padding:20, height:400,borderColor:constants.COLORS.ORANGE, borderWidth:3}}>   
                                    <h5><strong>Upload Art</strong></h5>
                                    <img src={ipfsImage} alt="IPFS" style={{width:150, marginLeft:'30%', marginBottom:20, marginTop:20}}></img>
                                    <p>The art image you select is initially uploaded to IPFS, a Decentralized Peer-to-peer file storage system
                                        
                                    </p>
                                </Card>
                            </Col>
                            <Col lg={{span:"4"}} >
                                <Card style={{backgroundColor:constants.COLORS.GREY, padding:20, height:400,borderColor:constants.COLORS.ORANGE, borderWidth:3}}>    
                                    <h5><strong>Set Title and Description</strong></h5>    
                                    <img src={rarible} alt="Rarible" style={{width:150, marginLeft:'30%', marginBottom:20, marginTop:20}}></img>
                                    <p>Give your Art a cool name and description. Be as creative and descriptive as possible! This NFT will be listed on <strong>Rarible</strong>.</p>
                                </Card>
                            </Col>
                            <Col lg={{span:"4"}}>
                                <Card style={{backgroundColor:constants.COLORS.GREY, padding:20, height:400,borderColor:constants.COLORS.ORANGE, borderWidth:3}}>
                                    <h5><strong>Sign Mint721 Transaction</strong></h5>
                                    <img src={metamask} alt="Metamask" style={{width:150, marginLeft:'30%', marginBottom:20, marginTop:20}}></img>
                                    <p>With Lazy Minting, you're essentially deferring the blockchain transaction costs to mint an NFT until a buyer purchases your NFT.
                                        This is especially useful if you're unsure whether your NFT will be sold or not.
                                    </p>
                                </Card>
                            </Col>
                        </Row>
                        <h6 style={{fontFamily:'Montserrat', marginTop:50}}><strong>Get started by selecting your art here:</strong></h6>
                        <Form.Control type="file" onChange={uploadFile}/>
                    </div>
                    
                </Form.Group> }
                
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header>
                    <Modal.Title>Congratulations!</Modal.Title>
                    </Modal.Header>
                    <div style={{textAlign:'center'}}>
                        <Modal.Body> 
                            <h5 style={{fontFamily:'Montserrat'}}>Woohoo, you've successfully created your <strong>NFT</strong>!</h5>
                            <Image src='https://uxwing.com/wp-content/themes/uxwing/download/48-checkmark-cross/success-green-check-mark.png' style={{width:300, margin:50}} />
                        </Modal.Body>
                    </div>
                    
                    <Modal.Footer>
                    
                    <Button variant="success" onClick={handleClose}>
                        Thank You
                    </Button>
                    </Modal.Footer>
                </Modal>
                    
                </div>
            </Row>
        </Container>
    )

}