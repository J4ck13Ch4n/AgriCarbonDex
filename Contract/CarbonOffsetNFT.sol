// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonOffsetNFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    struct CarbonMetadata {
        string ipfsCid;
        string did;
        string co2Amount; // đơn vị gram * 100 (ví dụ: 3.75kg → 375000)
    }

    mapping(uint256 => CarbonMetadata) public carbonData;

    constructor() ERC721("Carbon Offset NFT", "CO-NFT") Ownable(msg.sender) {}

    /// @notice Mint nhiều NFT một lần, mỗi CID có giá trị CO2 riêng
    /// @param to Địa chỉ người nhận
    /// @param ipfsCids Mảng IPFS CID
    /// @param did DID dùng chung
    /// @param tokenURIs Mảng tokenURI cho metadata
    /// @param co2Amounts Mảng lượng CO₂ tương ứng (đơn vị: gram * 100)
    function Mint(
        address to,
        string[] memory ipfsCids,
        string memory did,
        string[] memory tokenURIs,
        string[] memory co2Amounts
    ) public onlyOwner {
        require(
            ipfsCids.length == tokenURIs.length &&
                ipfsCids.length == co2Amounts.length,
            "Data's Length is Invalid"
        );

        for (uint256 i = 0; i < ipfsCids.length; i++) {
            uint256 tokenId = nextTokenId++;
            _mint(to, tokenId);
            _setTokenURI(tokenId, tokenURIs[i]);
            carbonData[tokenId] = CarbonMetadata({
                ipfsCid: ipfsCids[i],
                did: did,
                co2Amount: co2Amounts[i]
            });
        }
    }

    /// @notice Truy xuất metadata NFT: CID, DID, CO₂
    function getCarbonMetadata(
        uint256 tokenId
    ) public view returns (string memory, string memory, string memory) {
        ownerOf(tokenId); // revert nếu không tồn tại
        CarbonMetadata memory data = carbonData[tokenId];
        return (data.ipfsCid, data.did, data.co2Amount);
    }
}
