import React, {useState, useEffect} from 'react';
import constants from '../constants';

export default function Footer(){
    return (
        <div className="text-center" style={{backgroundColor:constants.COLORS.BLUE, height:60, padding:20, overflowX:'hidden', overflowY:'hidden', width:'100%', color:'white', position:'fixed', bottom:0}}>
            <h5>&#169; 2021 Auction House</h5>
        </div>
    )
}