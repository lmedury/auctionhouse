
import {toAddress} from '@rarible/types';
const config = require('./config.json');
const Web3 = require('web3');


let web3 = new Web3(window.ethereum);
let contract;
let address;

window.ethereum.enable().then(function(){
    web3.eth.getAccounts((err, accounts) => {
        address = accounts[0]
        contract = new web3.eth.Contract(config.AUCTION_CONTRACT_ABI, config.AUCTION_CONTRACT);
    })

});

export default async function createTimedAuction(tokenId, reservePrice, date, time){
    const deadline = new Date(`${date} ${time}`).getTime();
    tokenId = tokenId.split(':')[1];
    reservePrice = parseInt(reservePrice);
    console.log(tokenId, reservePrice);
    try{
        const txn = await contract.methods.createTimedAuction(tokenId, reservePrice, deadline).send({from: toAddress(address), gas: 400000});
        return({txn:txn, success:true})
    }catch(err){
        return({err:err, success:false})
    }
    
}

export async function listAuctions(){
    
    try{
        const count = await contract.methods.getCountOfAuctions().call();
        const timed = count[0];
        const reserved = count[1];
        const open = count[2];
        const vickery = count[3];
        return ({success:true, timed:timed, reserved:reserved, open:open, vickery:vickery})
    }catch(err){
        return({err:err, success:false})
    }
    
}

export async function getTimedAuctions(){
    let auctions = [];
    const count = await listAuctions();
    for(let i=1; i<=count.timed; i++){
        try{
            const auction = await contract.methods.getTimedAuctions(i).call();
            auctions.push(auctions)
        }catch(err){
            console.log(err);
        }
    }
    return auctions;
    
}