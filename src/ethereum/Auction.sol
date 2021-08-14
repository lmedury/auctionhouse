pragma solidity ^0.8.1;

contract Auction {
    
    uint count_timed_auctions;
    uint count_reserved_auctions;
    uint count_vickery_auctions;
    uint count_open_auctions;
    
    constructor () public {
        count_timed_auctions = 0;
        count_open_auctions = 0;
        count_vickery_auctions = 0;
        count_reserved_auctions = 0;
    }   
    
   
    modifier tokenExists(uint256 _token) {
        require(tokens[_token].isAuctioned, "Token is not available for auction");
        _;
    }
    
    modifier tokenNotExists(uint256 _token) {
        require(!tokens[_token].isAuctioned, "Token is already available for auction");
        _;
    }
    
    modifier isCreator(uint256 _token) {
        require(tokens[_token].owner == msg.sender, "This address is not the creator of this NFT");
        _;
    }
    
    modifier isTimedAuctionOpen(uint _id) {
        require(timed_auctions[_id].isOpen, "This auction is closed");
        _;
    }
    
    modifier isReserveAuctionOpen(uint _id) {
        require(reserved_auctions[_id].isOpen, "This auction is closed");
        _;
    }
    
    modifier isOpenAuctionOpen(uint _id) {
        require(open_auctions[_id].isOpen, "This auction is closed");
        _;
    }
    
    modifier isVickeryAuctionOpen(uint _id) {
        require(vickery_auctions[_id].isOpen, "This auction is closed");
        _;
    }
    
    struct token {
        uint256 tokenId;
        bool isAuctioned;
        address owner;
    }
    
    
    mapping (uint256 => token) tokens;
    
    struct timed_auction {
        uint256 tokenId;
        address owner;
        uint256 reservePrice;
        uint256 deadline;
        mapping(address => bool) bids;
        uint highestBid;
        address highestBidder;
        bool isOpen;
    }
    
    mapping(uint => timed_auction) timed_auctions;
    
    struct reserved_auction {
        uint256 tokenId;
        address owner;
        uint reservePrice;
        uint highestBid;
        address highestBidder;
        bool isOpen;
    }
    
    mapping(uint => reserved_auction) reserved_auctions;
    
    
    struct open_auction {
        uint256 tokenId;
        address owner;
        uint reservePrice;
        mapping(address => bool) bids;
        uint highestBid;
        address highestBidder;
        bool isOpen;
    }
    
    mapping(uint => open_auction) open_auctions;
    
    struct vickery_auction {
        uint256 tokenId;
        address owner;
        uint reservePrice;
        mapping(address => uint256) bids;
        bool isOpen;
    }
    
    mapping(uint => vickery_auction) vickery_auctions;
    
    
    
    function createToken(uint256 _tokenId, address _owner) public {
        tokens[_tokenId].tokenId = _tokenId;
        tokens[_tokenId].owner = _owner;
        tokens[_tokenId].isAuctioned = true;
    }
    
    function createTimedAuction(uint256 _tokenId, uint256 _reservePrice, uint256 _deadline) tokenNotExists(_tokenId) public {
        require(_deadline > block.timestamp, "Deadline has already passed");
        createToken(_tokenId, msg.sender);
        count_timed_auctions++;
        timed_auctions[count_timed_auctions].tokenId=_tokenId;
        
        timed_auctions[count_timed_auctions].owner=msg.sender;
        timed_auctions[count_timed_auctions].reservePrice=_reservePrice;
        timed_auctions[count_timed_auctions].deadline=_deadline;
        timed_auctions[count_timed_auctions].isOpen = true;
    }
    
    function createReservedAuction(uint256 _tokenId,  uint256 _reservePrice) tokenNotExists(_tokenId) public {
        createToken(_tokenId, msg.sender);
        count_reserved_auctions++;
        reserved_auctions[count_reserved_auctions].tokenId=_tokenId;
        
        reserved_auctions[count_reserved_auctions].owner=msg.sender;
        reserved_auctions[count_reserved_auctions].reservePrice=_reservePrice;
        reserved_auctions[count_reserved_auctions].isOpen=true;
    }
    
    function createOpenAuction(uint256 _tokenId, uint256 _reservePrice) tokenNotExists(_tokenId) public {
        createToken(_tokenId, msg.sender);
        count_open_auctions++;
        open_auctions[count_open_auctions].tokenId=_tokenId;
        open_auctions[count_open_auctions].owner=msg.sender;
        open_auctions[count_open_auctions].reservePrice=_reservePrice;
        open_auctions[count_open_auctions].isOpen = true;
    }
    
    function createVickeryAuction(uint256 _tokenId, uint256 _reservePrice) tokenNotExists(_tokenId) public {
        createToken(_tokenId, msg.sender);
        count_vickery_auctions++;
        vickery_auctions[count_vickery_auctions].tokenId=_tokenId;
        
        vickery_auctions[count_vickery_auctions].owner=msg.sender;
        vickery_auctions[count_vickery_auctions].reservePrice=_reservePrice;
        vickery_auctions[count_vickery_auctions].isOpen = true;
    }
    
    function bidOnTimedAuction(uint _id) isTimedAuctionOpen(_id) public payable {
        require(msg.value > timed_auctions[_id].reservePrice, "Must be higher than reserve price");
        require(msg.value > timed_auctions[_id].highestBid, "Must outbid the current highest bid");
        timed_auctions[_id].highestBid = msg.value;
        timed_auctions[_id].highestBidder = msg.sender;
        timed_auctions[_id].bids[msg.sender] = true;
    }
    
    function bidOnReservedAuction(uint _id) isReserveAuctionOpen(_id) public payable {
        require(msg.value > reserved_auctions[_id].reservePrice, "Must be higher than reserve price");
        require(msg.value > reserved_auctions[_id].highestBid, "Must outbid the current highest bid");
        reserved_auctions[_id].highestBid = msg.value;
        reserved_auctions[_id].highestBidder = msg.sender;
    }
    
    function bidOnOpenAuction(uint _id) isOpenAuctionOpen(_id) public payable {
        require(msg.value > open_auctions[_id].reservePrice, "Must be higher than reserve price");
        require(msg.value > open_auctions[_id].highestBid, "Must outbid the current highest bid");
        open_auctions[_id].highestBid = msg.value;
        open_auctions[_id].highestBidder = msg.sender;
    }
    
    function bidOnVickeryAuction(uint _id) isVickeryAuctionOpen(_id) public payable {
        require(msg.value > vickery_auctions[_id].reservePrice, "Must be higher than reserve price");
        vickery_auctions[_id].bids[msg.sender] = msg.value;
    }
    
    function closeTimedAuction (uint _id) isTimedAuctionOpen(_id) public {
        require(timed_auctions[_id].owner == msg.sender, "This address is not the owner of this auction");
        timed_auctions[_id].isOpen = false;
    }
    
    function closeReservedAuction (uint _id) isReserveAuctionOpen(_id) public {
        require(timed_auctions[_id].owner == msg.sender, "This address is not the owner of this auction");
        timed_auctions[_id].isOpen = false;
    }
    
    function closeOpenAuction (uint _id) isOpenAuctionOpen(_id) public {
        require(timed_auctions[_id].owner == msg.sender, "This address is not the owner of this auction");
        timed_auctions[_id].isOpen = false;
    }
    
    function closeVickeryAuction (uint _id) isVickeryAuctionOpen(_id) public {
        require(timed_auctions[_id].owner == msg.sender, "This address is not the owner of this auction");
        timed_auctions[_id].isOpen = false;
    }
    
    function getCountOfAuctions () public view returns (uint, uint, uint, uint) {
        return (count_timed_auctions, count_reserved_auctions, count_open_auctions, count_vickery_auctions);
    }
    
    function getTimedAuctions(uint _id) public view returns (uint256, address, uint, uint, address, uint){
        require(_id <= count_timed_auctions, "The auction does not exist");
        return (timed_auctions[_id].tokenId, timed_auctions[_id].owner, timed_auctions[_id].reservePrice, timed_auctions[_id].deadline, timed_auctions[_id].highestBidder, timed_auctions[_id].highestBid);
    }
    
    function getReservedAuctions(uint _id) public view returns (uint256, address, uint, address, uint){
        require(_id <= count_reserved_auctions, "The auction does not exist");
        return (reserved_auctions[_id].tokenId, reserved_auctions[_id].owner, reserved_auctions[_id].reservePrice, reserved_auctions[_id].highestBidder, reserved_auctions[_id].highestBid);
    }
    
    function getVickeryAuctions(uint _id) public view returns (uint256,address, uint){
        require(_id <= count_vickery_auctions, "The auction does not exist");
        return (vickery_auctions[_id].tokenId, vickery_auctions[_id].owner, vickery_auctions[_id].reservePrice);
    }
    
    function getOpenAuctions(uint _id) public view returns (uint256, address, uint, address, uint){
        require(_id <= count_open_auctions, "The auction does not exist");
        return (open_auctions[_id].tokenId, open_auctions[_id].owner, open_auctions[_id].reservePrice, open_auctions[_id].highestBidder, open_auctions[_id].highestBid);
    }
    
    function getToken (uint256 _id) public view returns (uint256, address) {
        return (tokens[_id].tokenId, tokens[_id].owner);
    }
    
    
}