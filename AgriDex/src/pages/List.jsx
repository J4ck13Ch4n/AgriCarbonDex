import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Navbar from "../components/Navbar";
import { getContracts } from "../utils/contractHelpers";
import { NFTDEX_ADDRESS, CARBON_OFFSET_NFT_ADDRESS, CARBON_DEBT_NFT_ADDRESS } from "../utils/constants";
import '../style/List.css';

// --- Helper Functions ---
/**
 * Parse CID data that could be a single CID or multiple CIDs
 * @param {string|string[]} cidData - CID data from contract
 * @returns {object} - { cid: string, cids: string[] }
 */
function parseCIDData(cidData) {
    if (!cidData || cidData === 'N/A') {
        return { cid: 'N/A', cids: [] };
    }

    // If it's already an array
    if (Array.isArray(cidData)) {
        const validCids = cidData.filter(cid => cid && cid !== 'N/A' && cid.trim() !== '');
        if (validCids.length === 0) {
            return { cid: 'N/A', cids: [] };
        }
        return {
            cid: validCids[0], // For backward compatibility
            cids: validCids
        };
    }

    // If it's a string, check if it contains multiple CIDs separated by comma or semicolon
    const cidString = cidData.toString().trim();
    if (cidString.includes(',') || cidString.includes(';')) {
        const separator = cidString.includes(',') ? ',' : ';';
        const cidArray = cidString.split(separator)
            .map(cid => cid.trim())
            .filter(cid => cid && cid !== 'N/A');

        if (cidArray.length === 0) {
            return { cid: 'N/A', cids: [] };
        }

        return {
            cid: cidArray[0], // For backward compatibility
            cids: cidArray
        };
    }

    // Single CID
    return {
        cid: cidString,
        cids: [cidString]
    };
}

// --- NFT Card Component ---
function NFTCard({ nft, userAddress, nftType }) {
    const [price, setPrice] = useState("");
    const [isApproving, setIsApproving] = useState(false);
    const [isListing, setIsListing] = useState(false);
    const [message, setMessage] = useState("");

    const handleApprove = async () => {
        if (nftType !== 'offset') {
            setMessage("Debt NFT cannot be listed");
            return;
        }
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
        if (nftType !== 'offset') {
            setMessage("Debt NFT cannot be listed");
            return;
        }
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
                    nftContract: nft.contractAddress
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
            <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 4, color: '#fff' }}>
                {`${nftType === 'offset' ? 'Carbon Offset NFT' : 'Carbon Debt NFT'} #${nft.tokenId}`}
            </div>
            <div style={{ margin: '12px 0 0 0', fontSize: 15 }}>
                {/* Contract Address */}
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
                {/* Token ID */}
                <div style={{ marginBottom: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#aaa' }}>Token ID:</span>
                    <span style={{ color: '#fff' }}>{nft.tokenId}</span>
                </div>
                {/* Token Standard */}
                <div style={{ marginBottom: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#aaa' }}>Token Standard:</span>
                    <span style={{ color: '#fff' }}>ERC721</span>
                </div>
                {/* CO2 Amount */}
                <div style={{ marginBottom: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#aaa' }}>CO₂ Amount:</span>
                    <span style={{ color: '#00ffae', fontWeight: 600 }}>
                        {(() => {
                            if (nft.co2_amount === 'N/A' || nft.co2_amount === undefined || nft.co2_amount === null) {
                                return 'N/A';
                            }
                            try {
                                const numericAmount = parseFloat(nft.co2_amount.toString());
                                if (isNaN(numericAmount)) {
                                    return 'N/A';
                                }
                                // Value from contract is in grams, convert to kg
                                const gramAmount = numericAmount;
                                const kgAmount = gramAmount;
                                return `${kgAmount.toFixed(10)} kg`;
                            } catch {
                                return 'N/A';
                            }
                        })()}
                    </span>
                </div>
                {/* Owner */}
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
                {/* CID(s) - Support for multiple CIDs */}
                <div style={{ marginBottom: 2 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Array.isArray(nft.cids) && nft.cids.length > 1 ? 4 : 0 }}>
                        <span style={{ color: '#aaa' }}>
                            {Array.isArray(nft.cids) && nft.cids.length > 1 ? 'CIDs:' : 'CID:'}
                        </span>
                        {/* Single CID or fallback display */}
                        {(!Array.isArray(nft.cids) || nft.cids.length <= 1) && (
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
                        )}
                    </div>
                    {/* Multiple CIDs display */}
                    {Array.isArray(nft.cids) && nft.cids.length > 1 && (
                        <div style={{ maxHeight: '120px', overflowY: 'auto', marginLeft: 0 }}>
                            {/* Copy All CIDs button */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 6,
                                padding: '4px 8px',
                                background: 'rgba(0, 255, 174, 0.1)',
                                borderRadius: 4,
                                border: '1px solid rgba(0, 255, 174, 0.2)'
                            }}>
                                <span style={{ color: '#00ffae', fontSize: 12, fontWeight: 600 }}>
                                    {nft.cids.length} CIDs Total
                                </span>
                                <button
                                    onClick={() => {
                                        const allCids = nft.cids.join('\n');
                                        navigator.clipboard.writeText(allCids);
                                    }}
                                    title="Copy all CIDs (one per line)"
                                    style={{
                                        background: 'rgba(0, 255, 174, 0.2)',
                                        border: '1px solid rgba(0, 255, 174, 0.3)',
                                        borderRadius: 3,
                                        cursor: 'pointer',
                                        padding: '2px 6px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: '#00ffae',
                                        fontSize: 11,
                                        fontWeight: 600
                                    }}
                                >
                                    Copy All
                                </button>
                            </div>
                            {nft.cids.map((cid, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: index < nft.cids.length - 1 ? 4 : 0,
                                    padding: '2px 8px',
                                    background: index % 2 === 0 ? 'rgba(0, 255, 174, 0.05)' : 'transparent',
                                    borderRadius: 3
                                }}>
                                    <span style={{ color: '#888', fontSize: 12, minWidth: 24 }}>#{index + 1}:</span>
                                    <span style={{
                                        color: cid !== 'N/A' ? '#00ffae' : '#666',
                                        cursor: cid !== 'N/A' ? 'pointer' : 'default',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        fontSize: 13,
                                        maxWidth: '180px'
                                    }}
                                        title={cid}>
                                        {cid !== 'N/A' ? (cid.length > 18 ? cid.slice(0, 6) + '...' + cid.slice(-6) : cid) : 'N/A'}
                                        {cid !== 'N/A' && (
                                            <button
                                                onClick={() => navigator.clipboard.writeText(cid)}
                                                title={`Copy CID #${index + 1}`}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    marginLeft: 4,
                                                    padding: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    color: '#00ffae',
                                                    fontSize: 16
                                                }}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00ffae" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
                                            </button>
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
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

            {/* Only show approve/list for offset NFTs and not listed */}
            {nftType === 'offset' && !nft.isListed && (
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
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={handleApprove}
                            disabled={isApproving || isListing}
                            style={{
                                flex: 1,
                                padding: '10px',
                                background: '#333',
                                border: '1px solid #444',
                                borderRadius: '6px',
                                color: '#fff',
                                cursor: 'pointer',
                                opacity: isApproving ? 0.6 : 1
                            }}
                        >
                            {isApproving ? 'Approving...' : 'Approve'}
                        </button>
                        <button
                            onClick={handleList}
                            disabled={isApproving || isListing}
                            style={{
                                flex: 1,
                                padding: '10px',
                                background: '#00ffae',
                                border: 'none',
                                borderRadius: '6px',
                                color: '#111',
                                fontWeight: '600',
                                cursor: 'pointer',
                                opacity: isListing ? 0.6 : 1
                            }}
                        >
                            {isListing ? 'Listing...' : 'List NFT'}
                        </button>
                    </div>
                    {message && <p style={{ marginTop: 12, fontSize: 13, color: '#aaa', textAlign: 'center' }}>{message}</p>}
                </div>
            )}
        </div>
    );
}

// --- Main Component for My NFTs Page ---
const MyNFTs = () => {
    const [offsetNfts, setOffsetNfts] = useState([]);
    const [debtNfts, setDebtNfts] = useState([]);
    const [otherNfts] = useState([]);
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
            if (!address) return;
            setIsLoading(true);
            try {
                const { offsetNFT, debtNFT, dex } = await getContracts();

                const fetchNftsForContract = async (nftContract, type, contractAddress) => {
                    if (!nftContract || !address) {
                        console.error("nftContract or address is not available for type:", type);
                        return [];
                    }

                    // Create a filter to find all 'Transfer' events where the 'to' address is the user's address
                    const filter = nftContract.filters.Transfer(null, address);
                    const events = await nftContract.queryFilter(filter);

                    const nftList = [];
                    const processedTokenIds = new Set();

                    // The events are iterated in reverse to process the most recent transfers first.
                    for (let i = events.length - 1; i >= 0; i--) {
                        const event = events[i];

                        if (!event.args || !event.args.tokenId) {
                            continue;
                        }

                        const tokenId = event.args.tokenId;

                        if (processedTokenIds.has(tokenId.toString())) {
                            continue;
                        }

                        try {
                            const currentOwner = await nftContract.ownerOf(tokenId);
                            if (currentOwner.toLowerCase() === address.toLowerCase()) {
                                let tokenUri = '';
                                let cid = 'N/A', did = 'N/A', co2_amount = '0'; // Default to N/A
                                let multipleCids = []; // For storing multiple CIDs

                                try {
                                    tokenUri = await nftContract.tokenURI(tokenId);
                                } catch {
                                    // Token URI not available
                                }

                                if (type === 'offset' && typeof nftContract.getCarbonMetadata === 'function') {
                                    try {
                                        const carbonMeta = await nftContract.getCarbonMetadata(tokenId);
                                        // Access tuple elements by index
                                        if (carbonMeta && carbonMeta.length >= 2) {
                                            const rawCid = carbonMeta[0] || 'N/A';
                                            const cidInfo = parseCIDData(rawCid);
                                            cid = cidInfo.cid;
                                            did = carbonMeta[1] || 'N/A';

                                            // Check if CO2 amount is available at index 2
                                            if (carbonMeta.length >= 3 && carbonMeta[2]) {
                                                co2_amount = carbonMeta[2].toString();
                                            } else {
                                                // Try to get CO2 amount from carbonData mapping directly
                                                try {
                                                    if (typeof nftContract.carbonData === 'function') {
                                                        const carbonData = await nftContract.carbonData(tokenId);
                                                        // carbonData might have co2Amount as the third field
                                                        if (carbonData && carbonData.length >= 3 && carbonData[2]) {
                                                            co2_amount = carbonData[2].toString();
                                                        } else {
                                                            co2_amount = 'N/A';
                                                        }
                                                    } else {
                                                        co2_amount = 'N/A';
                                                    }
                                                } catch {
                                                    co2_amount = 'N/A';
                                                }
                                            }

                                            // Store multiple CIDs info for later use
                                            multipleCids = cidInfo.cids;
                                        } else {
                                            console.error(`getCarbonMetadata for offset token ${tokenId} returned insufficient data:`, carbonMeta);
                                            cid = 'N/A';
                                            did = 'N/A';
                                            co2_amount = 'N/A';
                                        }
                                    } catch (e) {
                                        console.error(`getCarbonMetadata failed for offset token ${tokenId}:`, e);
                                        co2_amount = 'N/A';
                                    }
                                }
                                if (type === 'debt' && typeof nftContract.getDebtMetadata === 'function') {
                                    try {
                                        const debtMeta = await nftContract.getDebtMetadata(tokenId);
                                        // With the correct ABI, we can access properties by name
                                        if (debtMeta && typeof debtMeta.co2Amount !== 'undefined') {
                                            did = debtMeta.did || 'N/A';
                                            const rawCid = debtMeta.ipfsCid || 'N/A';
                                            const cidInfo = parseCIDData(rawCid);
                                            cid = cidInfo.cid;
                                            co2_amount = debtMeta.co2Amount.toString();

                                            // Store multiple CIDs info for debt NFTs too
                                            multipleCids = cidInfo.cids;
                                        } else {
                                            console.error(`getDebtMetadata for debt token ${tokenId} returned an invalid or incomplete result:`, debtMeta);
                                            co2_amount = 'N/A';
                                        }
                                    } catch (e) {
                                        console.error(`getDebtMetadata failed for debt token ${tokenId}:`, e);
                                        co2_amount = 'N/A';
                                    }
                                }

                                // Check if NFT is already listed on DEX
                                let isListed = false;
                                let listingPrice = null;

                                try {
                                    // Get total listing counter
                                    const counter = await dex.listingIdCounter();
                                    const listingsCount = parseInt(counter.toString());

                                    // Check each listing to see if our NFT is listed
                                    for (let listingId = 1; listingId <= listingsCount; listingId++) {
                                        const listing = await dex.listings(listingId);

                                        // Check if this listing matches our NFT and is active
                                        if (listing.nftContract.toLowerCase() === contractAddress.toLowerCase() &&
                                            listing.tokenId.toString() === tokenId.toString() &&
                                            listing.seller !== '0x0000000000000000000000000000000000000000') {
                                            isListed = true;
                                            listingPrice = ethers.formatUnits(listing.price, 18);
                                            break;
                                        }
                                    }
                                } catch (listingError) {
                                    console.error(`Error checking listing for token ${tokenId}:`, listingError.message);
                                }

                                nftList.push({
                                    tokenId: tokenId.toString(),
                                    contractAddress: contractAddress,
                                    tokenUri: tokenUri,
                                    nftType: type,
                                    cid: cid,
                                    cids: multipleCids.length > 0 ? multipleCids : [cid !== 'N/A' ? cid : 'N/A'],
                                    did: did,
                                    co2_amount: co2_amount,
                                    isListed: isListed,
                                    listingPrice: listingPrice
                                });

                                processedTokenIds.add(tokenId.toString());
                            }
                        } catch (error) {
                            console.error(`Could not process token ${tokenId} in ${type} contract:`, error);
                        }
                    }
                    return nftList;
                };

                const offsetNfts = await fetchNftsForContract(offsetNFT, 'offset', CARBON_OFFSET_NFT_ADDRESS);
                const debtNfts = await fetchNftsForContract(debtNFT, 'debt', CARBON_DEBT_NFT_ADDRESS);

                setOffsetNfts(offsetNfts);
                setDebtNfts(debtNfts);
            } catch (error) {
                console.error("Error fetching NFTs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (address) {
            fetchNFTs();
        }
    }, [address]);

    const renderContent = () => {
        if (!address) {
            return <p style={{ color: '#aaa', textAlign: 'center', padding: '40px' }}>Please connect your wallet to view your NFTs.</p>;
        }
        if (isLoading) {
            return <p style={{ color: '#aaa', textAlign: 'center', padding: '40px' }}>Loading your NFTs...</p>;
        }
        if (offsetNfts.length === 0 && debtNfts.length === 0 && otherNfts.length === 0) {
            return <p style={{ color: '#aaa', textAlign: 'center', padding: '40px' }}>You don't own any NFTs.</p>;
        }

        return (
            <>
                {offsetNfts.length > 0 && (
                    <div style={{ marginBottom: '40px' }}>
                        <h3 style={{ color: '#00ffae', marginBottom: '16px', fontSize: '1.25rem', fontWeight: '600', borderBottom: '1px solid #333', paddingBottom: '8px' }}>Carbon Offset NFTs (Listable)</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
                            {offsetNfts.map((nft) => (
                                <NFTCard key={`offset-${nft.tokenId}`} nft={nft} userAddress={address} nftType={nft.nftType} />
                            ))}
                        </div>
                    </div>
                )}
                {debtNfts.length > 0 && (
                    <div style={{ marginBottom: '40px' }}>
                        <h3 style={{ color: '#ff7b7b', marginBottom: '16px', fontSize: '1.25rem', fontWeight: '600', borderBottom: '1px solid #333', paddingBottom: '8px' }}>Carbon Debt NFTs (Not Listable)</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
                            {debtNfts.map((nft) => (
                                <NFTCard key={`debt-${nft.tokenId}`} nft={nft} userAddress={address} nftType={nft.nftType} />
                            ))}
                        </div>
                    </div>
                )}
                {otherNfts.length > 0 && (
                    <div>
                        <h3 style={{ color: '#ffd700', marginBottom: '16px', fontSize: '1.25rem', fontWeight: '600', borderBottom: '1px solid #333', paddingBottom: '8px' }}>Other NFTs (Not Listable)</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
                            {otherNfts.map((nft) => (
                                <NFTCard key={`other-${nft.tokenId}`} nft={nft} userAddress={address} nftType="other" />
                            ))}
                        </div>
                    </div>
                )}
            </>
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
