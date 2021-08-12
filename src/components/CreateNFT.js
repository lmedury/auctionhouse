import React, { useCallback, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import {Col, Container, Row, Image, Form, Card, Modal} from 'react-bootstrap';
import constants from "../constants";
import rarible from '../assets/img/rarible.png';
import { createLazyMint } from "../rarible/LazyMint";
import { toAddress } from "@rarible/types";

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
    const [ipfsHash, setIpfsHash] = useState('');
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
                <div className="text-center" style={{alignContent:'center', marginTop:30}}>
                <div style={{marginBottom:100}}>
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
                            <Button onClick={create}>Create</Button>
                        </Col>
                    </Row>
                :
                <Form.Group controlId="formFile" className="mb-3">
                    <div style={{textAlign:'left', marginTop:50}}>
                        <h6 style={{fontFamily:'Montserrat'}}>Select your art here:</h6>
                        <Form.Control type="file" onChange={uploadFile}/>
                    </div>
                    
                </Form.Group> }
                
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
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