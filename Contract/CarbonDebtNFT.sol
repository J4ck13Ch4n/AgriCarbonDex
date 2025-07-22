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
        string co2Amount; // tính bằng miligam CO2 hoặc gram * 100 (tuỳ theo cách bạn quy đổi từ Python)
    }

    mapping(uint256 => CarbonDebtMetadata) public debtMetadata;

    constructor(
        address initialOwner
    ) ERC721("Carbon Debt NFT", "CDNFT") Ownable(initialOwner) {}

    /// @notice Mint nhiều NFT "nợ carbon" 1 lần — mỗi CID có CO2 riêng, dùng chung DID
    /// @param recipient Người nhận NFT
    /// @param ipfsCids Danh sách CID IPFS
    /// @param did DID dùng chung
    /// @param tokenURIs Danh sách metadata URI
    /// @param co2Amounts Danh sách lượng CO2 ứng với mỗi CID (ví dụ: tính bằng gram * 100 hoặc *1000 từ Python)
    function MintDebtNFT(
        address recipient,
        string[] memory ipfsCids,
        string memory did,
        string[] memory tokenURIs,
        string[] memory co2Amounts
    ) public onlyOwner {
        require(
            ipfsCids.length == tokenURIs.length &&
                ipfsCids.length == co2Amounts.length,
            "Data's Lenght is Invalid"
        );

        for (uint256 i = 0; i < ipfsCids.length; i++) {
            uint256 newTokenId = _tokenIds;
            _safeMint(recipient, newTokenId);
            _setTokenURI(newTokenId, tokenURIs[i]);

            debtMetadata[newTokenId] = CarbonDebtMetadata({
                did: did,
                ipfsCid: ipfsCids[i],
                tokenURI: tokenURIs[i],
                co2Amount: co2Amounts[i]
            });

            _tokenIds++;
        }
    }

    /// @notice Truy xuất metadata theo tokenId
    function getDebtMetadata(
        uint256 tokenId
    )
        public
        view
        returns (
            string memory did,
            string memory ipfsCid,
            string memory tokenURI,
            string memory co2Amount
        )
    {
        ownerOf(tokenId); // đảm bảo token tồn tại, nếu không sẽ revert
        CarbonDebtMetadata memory meta = debtMetadata[tokenId];
        return (meta.did, meta.ipfsCid, meta.tokenURI, meta.co2Amount);
    }

    /// 🔒 Ngăn chuyển nhượng NFT nợ (non-transferable)
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        require(
            from == address(0) || to == address(0),
            "Transfers are disabled for CarbonDebtNFT"
        );
        return super._update(to, tokenId, auth);
    }
}
