import React, {useState, useEffect} from 'react';
import constants from '../constants';

export default function MyItems(props) {
    
    const [items, setItems] = useState(false);
    const address = '0xDb9F310D544b58322aBA88881f6bAA4F7B4AD666'

    async function getItems(){
        const res = await fetch(`https://api-dev.rarible.com/protocol/v0.1/ethereum/nft/items/byOwner?owner=${address}`)
        .then((res) => res.json());
        
        let items = [];
        res.items.forEach(function({id}){
        items.push(id);
        })
        for(let i=0; i<items.length; i++){
            const token = items[i];
            const meta = await fetch(`https://api-dev.rarible.com/protocol/v0.1/ethereum/nft/items/${token}/meta`)
            .then((res) => res.json());
            
        }
        
    }

    if(!items) {
        getItems();
        setItems(true);
    }
    

    return (
        <h2>My Items</h2>
    )
    
    
}