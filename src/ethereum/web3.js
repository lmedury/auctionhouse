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
    const txn = await contract.methods.createTimedAuction(tokenId, reservePrice, deadline).send({from: toAddress(address), gas: 300000});
    console.log(txn);
    
    
}