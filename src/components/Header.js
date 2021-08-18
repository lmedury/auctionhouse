import React from 'react';
import styles from '../styles.js';
import logo from '../assets/img/AuctionHouse.png';
import { Button } from 'react-bootstrap';

export default function (props) {
    return (
        <div style={styles.HEADER}>
            <img src={logo} onClick={() => props.changeRoute('Home')} style={{width:250, marginLeft:30}}></img>
            <div style={{marginLeft:'55%', display:'inline', justifyContent:'space-between'}}>
                <Button variant="warning" onClick={() => props.changeRoute('MyItems')}>My Items</Button>
                <Button variant="warning" style={{marginLeft:10}} onClick={() => props.changeRoute('Create')}>Create NFT</Button>   
                <Button variant="warning" style={{marginLeft:10}} onClick={() => props.changeRoute('List')}>Auctions</Button>   
                <Button variant="warning" style={{marginLeft:10}} onClick={() => props.changeRoute('Purchased')}>Purchased NFTs</Button>      
            </div>
            
        </div>
    )
}