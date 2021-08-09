import React, {useState, useEffect} from 'react';
import constants from '../constants';
import styles from '../styles.js';

export default function (props) {
    return (
        <div style={styles.HEADER}>
            <h1 style={{marginLeft: 20, display:'inline', marginTop:100}}>Auction House</h1>
            <h5 style={{textAlign:'right', display:'inline', marginLeft:'50%'}}>Your address: {props.address}</h5>
        </div>
    )
}