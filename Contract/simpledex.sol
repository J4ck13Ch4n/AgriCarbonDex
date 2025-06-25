// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTDEX is Ownable {
    address public carbonOffsetNFTContract;

    struct Listing {
        address seller;
        address nftContract;
        uint256 tokenId;
        address erc20Token;
        uint256 price;
    }

    uint256 public listingIdCounter;
    mapping(uint256 => Listing) public listings;

    event NFTListed(
        uint256 indexed listingId,
        address indexed seller,
        address nftContract,
        uint256 tokenId,
        address erc20Token,
        uint256 price
    );
    event NFTPurchased(uint256 indexed listingId, address indexed buyer);
    event NFTListingCancelled(
        uint256 indexed listingId,
        address indexed seller
    ); // Added event

    constructor(address _carbonOffsetNFTContract) Ownable(msg.sender) {
        carbonOffsetNFTContract = _carbonOffsetNFTContract;
    }

    // New function for backend to list NFT on behalf of a user
    function listNFTForUser(
        address actualSeller, // The actual owner and seller of the NFT
        address nftContract,
        uint256 tokenId,
        address erc20Token,
        uint256 price
    ) external onlyOwner {
        // Only contract owner (backend) can call this
        require(
            nftContract == carbonOffsetNFTContract,
            "Only CarbonOffsetNFT can be listed"
        );
        IERC721 nft = IERC721(nftContract);

        // Verify ownership by the actualSeller
        require(
            nft.ownerOf(tokenId) == actualSeller,
            "actualSeller is not the owner of the NFT"
        );

        // Verify that the actualSeller has approved this contract to manage this NFT
        // This approval must be done by actualSeller via frontend/MetaMask before calling this
        require(
            nft.isApprovedForAll(actualSeller, address(this)) ||
                nft.getApproved(tokenId) == address(this),
            "DEX contract not approved by actualSeller for this NFT"
        );

        listingIdCounter++;
        listings[listingIdCounter] = Listing({
            seller: actualSeller, // Store the actualSeller's address
            nftContract: nftContract,
            tokenId: tokenId,
            erc20Token: erc20Token,
            price: price
        });

        emit NFTListed(
            listingIdCounter,
            actualSeller, // Emit event with actualSeller
            nftContract,
            tokenId,
            erc20Token,
            price
        );
    }

    // New function for backend to execute NFT purchase on behalf of a user
    function buyNFTForUser(
        address actualBuyer, // The actual buyer of the NFT
        uint256 listingId
    ) external onlyOwner {
        // Only contract owner (backend) can call this
        Listing storage listing = listings[listingId]; // Use storage to allow modification/deletion
        require(
            listing.seller != address(0),
            "Listing does not exist or already sold"
        );
        require(
            listing.seller != actualBuyer,
            "actualBuyer cannot buy their own listed NFT"
        );
        require(
            listing.nftContract == carbonOffsetNFTContract,
            "Only CarbonOffsetNFT can be bought"
        );

        IERC20 erc20 = IERC20(listing.erc20Token);

        // Transfer ERC20 tokens from actualBuyer to the seller
        // The actualBuyer must have approved this DEX contract to spend their ERC20 tokens
        // This approval must be done by actualBuyer via frontend/MetaMask before calling this
        require(
            erc20.transferFrom(actualBuyer, listing.seller, listing.price),
            "ERC20 transfer from actualBuyer to seller failed"
        );

        IERC721 nft = IERC721(listing.nftContract);
        // Transfer the NFT from the seller to the actualBuyer
        // The seller (listing.seller) must have approved this DEX contract (during listNFTForUser)
        nft.safeTransferFrom(listing.seller, actualBuyer, listing.tokenId);

        delete listings[listingId]; // Remove the listing after successful purchase

        emit NFTPurchased(listingId, actualBuyer); // Emit event with actualBuyer
    }

    // Optional: Function to allow a seller to cancel their listing
    // This also needs to be mediated by the backend or ensure only seller can call
    function cancelListingForUser(
        address actualSeller,
        uint256 listingId
    ) external onlyOwner {
        Listing storage listing = listings[listingId];
        require(listing.seller != address(0), "Listing does not exist");
        require(
            listing.seller == actualSeller,
            "Only the seller can cancel this listing"
        );

        // No tokens are moved, just delete the listing
        delete listings[listingId];
        emit NFTListingCancelled(listingId, actualSeller); // Emit event
    }
}
