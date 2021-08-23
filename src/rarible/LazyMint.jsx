import Constants from './contants';

export async function getToken (account) {
    const res = await fetch(`https://api-dev.rarible.com/protocol/v0.1/ethereum/nft/collections/${Constants.ERC721}/generate_token_id?minter=${account}`)
    .then((res) => res.json());
    let token = res.tokenId;
    return token;
}

export async function createLazyMint(provider, path, account) {
    const tokenId = getToken(account);

    const lazyMintBody = {
        "@type": "ERC721",
        "contract": `${Constants.ERC721}`,
        "tokenId": tokenId,
        "tokenURI": `/ipfs/${path}`,
        "creators": [
            { 
                account: account, 
                value: "10000" 
            }
        ],
        "royalties": [
            { 
                account: account, 
                value: 2000 
            }
        ],
    };

    const ds = {
        "types": {
            "EIP712Domain": [
            {
                type: "string",
                name: "name",
            },
            {
                type: "string",
                name: "version",
            },
            {
                type: "uint256",
                name: "chainId",
            },
            {
                type: "address",
                name: "verifyingContract",
            }
            ],
            "Mint721": [
                { name: "tokenId", type: "uint256" },
                { name: "tokenURI", type: "string" },
                { name: "creators", type: "Part[]" },
                { name: "royalties", type: "Part[]" }
            ],
            "Part": [
                { name: "account", type: "address" },
                { name: "value", type: "uint96" }
            ]
        },
        "domain": {
            name: "Mint721",
            version: "1",
            chainId: 3,
            verifyingContract: "0xB0EA149212Eb707a1E5FC1D2d3fD318a8d94cf05"
        },
        "primaryType": "Mint721",
        "message": {
            ...lazyMintBody
        }
    };

    const sig = signTypedData(provider, account, ds);
    const thisStruct = ds.message;
    thisStruct.signatures = [`${sig.result}`];
    const uri = thisStruct.tokenURI;
    delete thisStruct.tokenURI;
    thisStruct.uri = uri;

    console.log(thisStruct);
    const result = await putLazyMint(thisStruct);
    console.log(result);
    return result;
}

export async function signTypedData(web3Provider, from, dataStructure) {
   
  const msgData = JSON.stringify(dataStructure);
  const sig = await web3Provider.currentProvider.send("eth_signTypedData_v4", [from, msgData]);
  
  return sig;

}

export async function putLazyMint(form) {
   
  const raribleMintUrl = "https://api-dev.rarible.com/protocol/v0.1/ethereum/nft/mints"
  let raribleMintResult = await fetch(raribleMintUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });
  raribleMintResult = await raribleMintResult.json();
  console.log(raribleMintResult);
  return raribleMintResult;

}