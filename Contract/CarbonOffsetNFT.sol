// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonOffsetNFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    struct CarbonMetadata {
        string ipfsCid;
        string did;
    }

    mapping(uint256 => CarbonMetadata) public carbonData;

    constructor() ERC721("Carbon Offset NFT", "CO-NFT") Ownable(msg.sender) {}

    /// @notice Mint nhiều NFT một lần, chia sẻ chung một DID
    /// @param to Địa chỉ người nhận
    /// @param ipfsCids Mảng các IPFS CID
    /// @param did DID của tổ chức/người dùng
    /// @param tokenURIs Mảng các tokenURI tương ứng với mỗi CID
    function Mint(
        address to,
        string[] memory ipfsCids,
        string memory did,
        string[] memory tokenURIs
    ) public onlyOwner {
        require(ipfsCids.length == tokenURIs.length, "Mismatch between CIDs and URIs");

        for (uint256 i = 0; i < ipfsCids.length; i++) {
            uint256 tokenId = nextTokenId++;
            _mint(to, tokenId);
            _setTokenURI(tokenId, tokenURIs[i]);
            carbonData[tokenId] = CarbonMetadata(ipfsCids[i], did);
        }
    }

    function getCarbonMetadata(uint256 tokenId) public view returns (string memory, string memory) {
        ownerOf(tokenId); // revert nếu không tồn tại
        CarbonMetadata memory data = carbonData[tokenId];
        return (data.ipfsCid, data.did);
    }
}
