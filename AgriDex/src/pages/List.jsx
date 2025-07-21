import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';
import Navbar from "../components/Navbar";
import { getContracts } from "../utils/contractHelpers";
import { NFTDEX_ADDRESS } from "../utils/constants";
import '../style/List.css';

// --- NFT Card Component ---
function NFTCard({ nft, userAddress }) {
    const [price, setPrice] = useState("");
    const [isApproving, setIsApproving] = useState(false);
    const [isListing, setIsListing] = useState(false);
    const [message, setMessage] = useState("");

    const handleApprove = async () => {
        setIsApproving(true);
        setMessage("Requesting approval...");
        try {
            const { offsetNFT } = await getContracts();
            const tx = await offsetNFT.approve(NFTDEX_ADDRESS, nft.tokenId);
            await tx.wait();
            setMessage("Approval successful!");
        } catch (err) {
            setMessage("Error: " + (err.reason || err.message));
        }
        setIsApproving(false);
    };

    const handleList = async () => {
        if (!price || parseFloat(price) <= 0) {
            setMessage("Please enter a valid price.");
            return;
        }
        setIsListing(true);
        setMessage("Listing NFT...");
        try {
            const res = await fetch("http://localhost:3001/api/list-nft", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    actualSeller: userAddress,
                    tokenId: nft.tokenId,
                    price,
                }),
            });
            if (res.ok) {
                setMessage("NFT listed successfully!");
            } else {
                const errorData = await res.json();
                throw new Error(errorData.error || res.statusText);
            }
        } catch (err) {
            setMessage("Error: " + err.message);
        }
        setIsListing(false);
    };

    return (
        <div style={{ minWidth: 340, maxWidth: 420, background: '#232426', borderRadius: 12, padding: 24, color: '#fff', boxShadow: '0 2px 8px #0002', display: 'flex', flexDirection: 'column', marginBottom: 16, border: '1px solid #333' }}>
            <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 4, color: '#fff' }}>CarbonNFT #{nft.tokenId}</div>
            <div style={{ margin: '12px 0 0 0', fontSize: 15 }}>
                <div style={{ marginBottom: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#aaa' }}>Contract Address:</span>
                    <span style={{ color: '#00ffae', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }} title={nft.contractAddress}>
                        {nft.contractAddress ? nft.contractAddress.slice(0, 6) + '...' + nft.contractAddress.slice(-4) : 'N/A'}
                        {nft.contractAddress && (
                            <button
                                onClick={() => navigator.clipboard.writeText(nft.contractAddress)}
                                title="Copy contract address"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    marginLeft: 4,
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: '#00ffae',
                                    fontSize: 18
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00ffae" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
                            </button>
                        )}
                    </span>
                </div>
                <div style={{ marginBottom: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#aaa' }}>Token ID:</span>
                    <span style={{ color: '#fff' }}>{nft.tokenId}</span>
                </div>
                <div style={{ marginBottom: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#aaa' }}>Token Standard:</span>
                    <span style={{ color: '#fff' }}>ERC721</span>
                </div>
                <div style={{ marginBottom: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#aaa' }}>Owner:</span>
                    <span style={{ color: '#00ffae', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }} title={userAddress}>
                        {userAddress.slice(0, 6) + '...' + userAddress.slice(-4)}
                        <button
                            onClick={() => navigator.clipboard.writeText(userAddress)}
                            title="Copy owner address"
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                marginLeft: 4,
                                padding: 0,
                                display: 'flex',
                                alignItems: 'center',
                                color: '#00ffae',
                                fontSize: 18
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00ffae" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
                        </button>
                    </span>
                </div>
                <div style={{ marginBottom: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#aaa' }}>CID:</span>
                    <span style={{
                        color: nft.cid !== 'N/A' ? '#00ffae' : '#666',
                        cursor: nft.cid !== 'N/A' ? 'pointer' : 'default',
                        display: 'inline-flex',
                        alignItems: 'center',
                        maxWidth: '200px'
                    }}
                        title={nft.cid}>
                        {nft.cid !== 'N/A' ? (nft.cid.length > 20 ? nft.cid.slice(0, 8) + '...' + nft.cid.slice(-8) : nft.cid) : 'N/A'}
                        {nft.cid !== 'N/A' && (
                            <button
                                onClick={() => navigator.clipboard.writeText(nft.cid)}
                                title="Copy CID"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    marginLeft: 4,
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: '#00ffae',
                                    fontSize: 18
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00ffae" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
                            </button>
                        )}
                    </span>
                </div>
                <div style={{ marginBottom: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#aaa' }}>DID:</span>
                    <span style={{
                        color: nft.did !== 'N/A' ? '#00ffae' : '#666',
                        cursor: nft.did !== 'N/A' ? 'pointer' : 'default',
                        display: 'inline-flex',
                        alignItems: 'center',
                        maxWidth: '200px'
                    }}
                        title={nft.did}>
                        {nft.did !== 'N/A' ? (nft.did.length > 20 ? nft.did.slice(0, 8) + '...' + nft.did.slice(-8) : nft.did) : 'N/A'}
                        {nft.did !== 'N/A' && (
                            <button
                                onClick={() => navigator.clipboard.writeText(nft.did)}
                                title="Copy DID"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    marginLeft: 4,
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: '#00ffae',
                                    fontSize: 18
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00ffae" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
                            </button>
                        )}
                    </span>
                </div>
                {nft.isListed && (
                    <div style={{ marginBottom: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#aaa' }}>Listed Price:</span>
                        <span style={{ color: '#ffe066', fontWeight: 600 }}>{nft.listingPrice} CCT</span>
                    </div>
                )}
                <div style={{ marginBottom: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#aaa' }}>Status:</span>
                    <span style={{
                        color: nft.isListed ? '#00ffae' : '#666',
                        fontWeight: 600,
                        fontSize: 13,
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: nft.isListed ? 'rgba(0, 255, 174, 0.1)' : 'rgba(102, 102, 102, 0.1)',
                        border: nft.isListed ? '1px solid rgba(0, 255, 174, 0.2)' : '1px solid rgba(102, 102, 102, 0.2)'
                    }}>
                        {nft.isListed ? 'LISTED ON DEX' : 'NOT LISTED'}
                    </span>
                </div>
            </div>

            {!nft.isListed ? (
                <div style={{ marginTop: 18, background: '#1a1b1e', borderRadius: 8, padding: 16, border: '1px solid #333' }}>
                    <div style={{ marginBottom: 12 }}>
                        <input
                            type="number"
                            placeholder="Price (CCT)"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            disabled={isApproving || isListing}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                background: '#232426',
                                border: '1px solid #333',
                                borderRadius: '6px',
                                color: '#fff',
                                fontSize: '14px',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button
                            onClick={handleApprove}
                            disabled={isApproving || isListing}
                            style={{
                                flex: 1,
                                padding: '10px 0',
                                background: '#333',
                                color: '#fff',
                                border: '1px solid #444',
                                borderRadius: '6px',
                                fontWeight: 600,
                                fontSize: 14,
                                cursor: 'pointer',
                                opacity: (isApproving || isListing) ? 0.7 : 1,
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {isApproving ? "Processing..." : "Approve"}
                        </button>
                        <button
                            onClick={handleList}
                            disabled={isApproving || isListing}
                            style={{
                                flex: 1,
                                padding: '10px 0',
                                background: '#00ffae',
                                color: '#111',
                                border: '1px solid #00ffae',
                                borderRadius: '6px',
                                fontWeight: 700,
                                fontSize: 14,
                                cursor: 'pointer',
                                opacity: (isApproving || isListing) ? 0.7 : 1,
                                fontFamily: 'Roboto Mono, monospace',
                                letterSpacing: 1,
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {isListing ? "Listing..." : "List NFT"}
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{
                    marginTop: 18,
                    background: 'rgba(0, 255, 174, 0.05)',
                    borderRadius: 8,
                    padding: 16,
                    border: '1px solid rgba(0, 255, 174, 0.2)',
                    textAlign: 'center'
                }}>
                    <div style={{ color: '#00ffae', fontWeight: 600, marginBottom: 4 }}>
                        ✓ Listed on Marketplace
                    </div>
                    <div style={{ color: '#aaa', fontSize: 13 }}>
                        Listing ID: #{nft.listingId}
                    </div>
                </div>
            )}

            {message && (
                <div style={{
                    marginTop: '12px',
                    fontSize: '14px',
                    color: message.includes('Error') ? '#ef4444' : '#00ffae',
                    textAlign: 'center',
                    padding: '8px',
                    background: message.includes('Error') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0, 255, 174, 0.1)',
                    borderRadius: '6px',
                    border: message.includes('Error') ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(0, 255, 174, 0.2)'
                }}>
                    {message}
                </div>
            )}
        </div>
    );
}

// --- Main List Page Component ---
const MyNFTs = () => {
    const [nfts, setNfts] = useState([]);
    const [address, setAddress] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [connecting, setConnecting] = useState(false);

    const handleConnect = async () => {
        setConnecting(true);
        try {
            if (window.ethereum && window.ethereum.request) {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts.length > 0) {
                    setAddress(accounts[0]);
                }
            }
        } catch (err) {
            console.error("Wallet connection error:", err);
        }
        setConnecting(false);
    };

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    if (accounts.length > 0) {
                        setAddress(accounts[0]);
                    }
                } catch (err) {
                    console.error("Unable to get accounts:", err);
                }

                window.ethereum.on('accountsChanged', (accounts) => {
                    setAddress(accounts.length > 0 ? accounts[0] : "");
                });
            }
        };
        init();
        return () => {
            if (window.ethereum && window.ethereum.removeListener) {
                window.ethereum.removeListener('accountsChanged', () => { });
            }
        };
    }, []);

    useEffect(() => {
        const fetchNFTs = async () => {
            if (!address) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            try {
                const { offsetNFT, provider, dex } = await getContracts();
                const nextTokenId = await offsetNFT.nextTokenId();
                const nftList = [];

                // Lấy thông tin listings từ DEX
                let listingsMap = {};
                try {
                    const counter = await dex.listingIdCounter();
                    const listingsCount = parseInt(counter.toString());

                    for (let i = 1; i <= listingsCount; i++) {
                        try {
                            const listing = await dex.listings(i);
                            if (listing.seller !== ethers.ZeroAddress) {
                                const key = `${listing.nftContract.toLowerCase()}_${listing.tokenId.toString()}`;
                                listingsMap[key] = {
                                    price: ethers.formatUnits(listing.price, 18),
                                    listingId: i,
                                    isListed: true
                                };
                            }
                        } catch (listingError) {
                            console.log(`Error fetching listing ${i}:`, listingError.message);
                        }
                    }
                } catch (dexError) {
                    console.log("Error fetching DEX listings:", dexError.message);
                }

                for (let i = 0; i < nextTokenId; i++) {
                    try {
                        const owner = await offsetNFT.ownerOf(i);
                        if (owner.toLowerCase() === address.toLowerCase()) {
                            const tokenURI = await offsetNFT.tokenURI(i);

                            // Lấy thông tin CID và DID từ NFT contract
                            let cid = 'N/A';
                            let did = 'N/A';
                            let contractAddress = offsetNFT.target || offsetNFT.address;

                            try {
                                // Thử nhiều loại contract khác nhau
                                const nftContract = new ethers.Contract(contractAddress, [
                                    "function getDebtMetadata(uint256 tokenId) view returns (string, string, string)",
                                    "function getCarbonMetadata(uint256 tokenId) view returns (string, string)",
                                    "function getCID(uint256 tokenId) view returns (string)",
                                    "function getDID(uint256 tokenId) view returns (string)",
                                    "function tokenURI(uint256 tokenId) view returns (string)"
                                ], provider);

                                // Thử method 1: getDebtMetadata (cho CarbonDebtNFT)
                                try {
                                    const metadata = await nftContract.getDebtMetadata(i);
                                    did = metadata[0] || 'N/A'; // meta.did
                                    cid = metadata[1] || 'N/A'; // meta.ipfsCid
                                    console.log(`NFT ${i} metadata (getDebtMetadata):`, { did, cid });
                                } catch (debtError) {
                                    console.log(`getDebtMetadata failed for token ${i}:`, debtError.message);

                                    // Thử method 2: getCarbonMetadata (cho CarbonOffsetNFT)
                                    try {
                                        const carbonMetadata = await nftContract.getCarbonMetadata(i);
                                        cid = carbonMetadata[0] || 'N/A'; // data.ipfsCid
                                        did = carbonMetadata[1] || 'N/A'; // data.did
                                        console.log(`NFT ${i} metadata (getCarbonMetadata):`, { cid, did });
                                    } catch (carbonError) {
                                        console.log(`getCarbonMetadata failed for token ${i}:`, carbonError.message);

                                        // Thử method 3: getCID và getDID riêng biệt
                                        try {
                                            cid = await nftContract.getCID(i);
                                            console.log(`CID found: ${cid}`);
                                        } catch (cidError) {
                                            console.log(`getCID failed for token ${i}:`, cidError.message);
                                        }

                                        try {
                                            did = await nftContract.getDID(i);
                                            console.log(`DID found: ${did}`);
                                        } catch (didError) {
                                            console.log(`getDID failed for token ${i}:`, didError.message);
                                        }

                                        // Nếu vẫn không lấy được, thử lấy từ tokenURI
                                        if (cid === 'N/A' && did === 'N/A') {
                                            try {
                                                const tokenURIData = await nftContract.tokenURI(i);
                                                console.log(`TokenURI found: ${tokenURIData}`);
                                                // Có thể parse tokenURI để lấy metadata nếu cần
                                                if (tokenURIData && tokenURIData.includes('ipfs://')) {
                                                    cid = tokenURIData.replace('ipfs://', '');
                                                }
                                            } catch (uriError) {
                                                console.log(`tokenURI failed for token ${i}:`, uriError.message);
                                            }
                                        }
                                    }
                                }
                            } catch (contractError) {
                                console.log(`Could not connect to NFT contract for metadata:`, contractError.message);
                            }

                            // Kiểm tra xem NFT có được list không
                            const listingKey = `${contractAddress.toLowerCase()}_${i.toString()}`;
                            const listingInfo = listingsMap[listingKey];

                            nftList.push({
                                tokenId: i.toString(),
                                tokenURI,
                                cid: cid,
                                did: did,
                                contractAddress: contractAddress,
                                listingPrice: listingInfo ? listingInfo.price : null,
                                listingId: listingInfo ? listingInfo.listingId : null,
                                isListed: !!listingInfo
                            });
                        }
                    } catch {
                        // Skip burned or non-existent tokens
                    }
                }
                setNfts(nftList);
            } catch (error) {
                console.error("Error fetching NFTs:", error);
            }
            setIsLoading(false);
        };

        fetchNFTs();
    }, [address]);

    const renderContent = () => {
        if (!address) {
            return <p style={{ color: '#aaa', textAlign: 'center', padding: '40px' }}>Please connect your wallet to view your NFTs.</p>;
        }
        if (isLoading) {
            return <p style={{ color: '#aaa', textAlign: 'center', padding: '40px' }}>Loading your NFTs...</p>;
        }
        if (nfts.length === 0) {
            return <p style={{ color: '#aaa', textAlign: 'center', padding: '40px' }}>You don't own any NFTs.</p>;
        }
        return (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
                {nfts.map((nft) => (
                    <NFTCard key={nft.tokenId} nft={nft} userAddress={address} />
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen" style={{ background: '#111214', color: '#fff', paddingTop: '80px' }}>
            <Navbar account={address} connecting={connecting} onConnect={handleConnect} />
            <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px 8px' }}>
                <h2 style={{ color: '#fff', marginBottom: '8px', fontSize: '1.5rem', fontWeight: '600' }}>Your NFTs</h2>
                <p style={{ color: '#aaa', marginBottom: '20px' }}>Approve and set a price to list your NFTs on the marketplace.</p>
                <div>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default MyNFTs;
