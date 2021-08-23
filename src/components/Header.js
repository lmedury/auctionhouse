import React, { useState } from 'react';
import styles from '../styles.js';
import logo from '../assets/img/AuctionHouse.png';
import { Button } from 'react-bootstrap';

export default function Header(props) {

    const [itemState, setItemState] = useState(false);
    const [createState, setCreateState] = useState(false);
    const [auctionState, setAuctionState] = useState(false);
    const [purchasedState, setPurchasedState] = useState(false);


    return (
        <div style={styles.HEADER}>
            <img src={logo} alt="Auction House" onClick={() => {
                setItemState(false);
                setCreateState(false);
                setAuctionState(false);
                setPurchasedState(false);
                props.changeRoute('Home');
                
            }} style={{width:250, marginLeft:30}}></img>
            <div style={{marginLeft:'55%', display:'inline', justifyContent:'space-between'}}>
                {itemState ? <Button variant="warning">My Items</Button> :
                <a href="/#" style={{textDecoration:'none'}}>
                <p style={{color:'white', display:'inline'}} onClick={() => {
                    setItemState(true);
                    setCreateState(false);
                    setAuctionState(false);
                    setPurchasedState(false);
                    props.changeRoute('MyItems')
                }}>My NFTs</p></a> }
                {createState ? <Button variant="warning" style={{marginLeft:10}} >Create NFT</Button>  : 
                <a href="/#" style={{textDecoration:'none'}}>
                <p style={{color:'white', display:'inline', marginLeft:30}} onClick={() => {
                    setItemState(false);
                    setCreateState(true);
                    setAuctionState(false);
                    setPurchasedState(false);
                    props.changeRoute('Create');
                }}>Create NFT</p></a>}
                {auctionState ? <Button variant="warning" style={{marginLeft:10}}>Auctions</Button>  : 
                <a href="/#" style={{textDecoration:'none'}}>
                <p style={{color:'white', display:'inline', marginLeft:30}} onClick={() => {
                    setItemState(false);
                    setCreateState(false);
                    setAuctionState(true);
                    setPurchasedState(false);
                    props.changeRoute('List');
                }}>Auctions</p></a>
                }
                {purchasedState ? <Button variant="warning" style={{marginLeft:10}} >Purchased NFTs</Button> :
                <a href="/#" style={{textDecoration:'none'}}>
                <p style={{color:'white', display:'inline', marginLeft:30}} onClick={() => {
                    setItemState(false);
                    setCreateState(false);
                    setAuctionState(false);
                    setPurchasedState(true);
                    props.changeRoute('Purchased')
                }}>Purchased NFTs</p></a>
                }
                  
                     
            </div>
            
        </div>
    )
}