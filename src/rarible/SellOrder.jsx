import Constants from './contants';
import EIP712 from './EIP712'
import { RARIBLE_DEV_LINK } from '../assets/js/constants';

export async function encodeOrder(address, tokenId) {
    let body = await prepareOrder(address, tokenId);
    
    const post = await fetch(`${RARIBLE_DEV_LINK}/ethereum/order/encoder/order`, {
        method: 'POST',
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    }).then((res) => res.json());
    
    return post;
}

export async function prepareOrder(address, tokenId) {
    const salt = Math.floor(Math.random()*10000);
    let body = {
        "type": "RARIBLE_V2",
        "maker": address,
        "make": {
            "assetType": {
                "assetClass": "ERC721",
                "contract": Constants.ERC721,
                "tokenId": tokenId
            },
            "value": "1"
        },
        "take": {
            "assetType": {
                "assetClass": "ETH"
            },
            "value": "1000000000000000000"
        },
        "data": {
            "dataType": "RARIBLE_V2_DATA_V1",
            "payouts": [],
            "originFees": []
        },
        "salt": salt
            
    }

    return body;
}


export async function signOrder(provider, order, account) {

    const data = EIP712.createTypeData(order.domain, order.structType, order.struct, order.types); 
    console.log(order);
	return (await EIP712.signTypedData(provider, account, data));

}

export async function sendOrder(address, tokenId, signature) {

    let form = await prepareOrder(address, tokenId);
    form.signature = signature;
   
    let post;
    try{
        const raribleOrderUrl = `${RARIBLE_DEV_LINK}/ethereum/order/orders`;
        const raribleOrderResult = await fetch(raribleOrderUrl, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        }).then(res => res.json());
        return raribleOrderResult;
    } catch (err) {
        console.log(err);
    }
    
    
    return post;
    
}