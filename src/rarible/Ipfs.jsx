
const ipfsAPI = require('ipfs-http-client');
//const ipfs = ipfsAPI({host: 'ipfs.infura.io', port: '5001', protocol: 'https' });
const ipfs = ipfsAPI.create('https://ipfs.infura.io:5001');

export async function ipfsAdd() {
    const buffalo = {
        "description": "It's actually a bison?",
        "external_url": "https://austingriffith.com/portfolio/paintings/",
        "image": "https://austingriffith.com/images/paintings/buffalo.jpg",
        "name": "Buffalo",
        "attributes": [
            {
                "trait_type": "BackgroundColor",
                "value": "green"
            },
            {
                "trait_type": "Eyes",
                "value": "googly"
            },
            {
                "trait_type": "Stamina",
                "value": 42
            }
        ]
    }
    
    const uploaded = await ipfs.add(JSON.stringify(buffalo));

    return uploaded.path;

}
