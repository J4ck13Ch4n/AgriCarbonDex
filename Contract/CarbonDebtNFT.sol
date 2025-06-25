// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonDebtNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    struct CarbonDebtMetadata {
        string did;
        string ipfsCid;
        string tokenURI;
    }

    mapping(uint256 => CarbonDebtMetadata) public debtMetadata;

    constructor(address initialOwner) ERC721("Carbon Debt NFT", "CDNFT") Ownable(initialOwner) {}

    /// @notice Mint nhiều NFT "nợ carbon" 1 lần — dùng chung DID
    function MintDebtNFT(
        address recipient,
        string[] memory ipfsCids,
        string memory did,
        string[] memory tokenURIs
    ) public onlyOwner {
        require(ipfsCids.length == tokenURIs.length, "CIDs and URIs length mismatch");

        for (uint256 i = 0; i < ipfsCids.length; i++) {
            uint256 newTokenId = _tokenIds;
            _safeMint(recipient, newTokenId);
            _setTokenURI(newTokenId, tokenURIs[i]);
            debtMetadata[newTokenId] = CarbonDebtMetadata(did, ipfsCids[i], tokenURIs[i]);
            _tokenIds++;
        }
    }

    function getDebtMetadata(uint256 tokenId) public view returns (string memory, string memory, string memory) {
        ownerOf(tokenId); // revert nếu tokenId không tồn tại
        CarbonDebtMetadata memory meta = debtMetadata[tokenId];
        return (meta.did, meta.ipfsCid, meta.tokenURI);
    }

    /// 🔒 Ngăn chuyển nhượng NFT nợ (non-transferable)
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        require(
            from == address(0) || to == address(0),
            "Transfers are disabled for CarbonDebtNFT"
        );
        return super._update(to, tokenId, auth);
    }
}
