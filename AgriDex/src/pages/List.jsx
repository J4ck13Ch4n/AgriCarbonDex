import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getContracts } from "../utils/contractHelpers";
import { NFTDEX_ADDRESS, CARBON_OFFSET_NFT_ADDRESS, CARBON_DEBT_NFT_ADDRESS } from "../utils/constants";
import '../style/List.css';

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
                                // Value from contract is grams * 100. To get kg, divide by 100 * 1000 = 100000.
                                const kgAmount = numericAmount / 100000;
                                return `${kgAmount.toFixed(2)} kg`;
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
                const { offsetNFT, debtNFT } = await getContracts();

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
                        const tokenId = event.args.tokenId;

                        if (processedTokenIds.has(tokenId.toString())) {
                            continue; // Skip if we've already processed this tokenId
                        }

                        try {
                            const currentOwner = await nftContract.ownerOf(tokenId);
                            // Check if the current owner is the user, this handles cases where the NFT was transferred away
                            if (currentOwner.toLowerCase() === address.toLowerCase()) {
                                let tokenUri = '';
                                let cid = 'N/A', did = 'N/A', co2_amount = '0';

                                try {
                                    tokenUri = await nftContract.tokenURI(tokenId);
                                } catch (uriError) {
                                    // console.log(`Could not get tokenURI for token ${tokenId}:`, uriError.message);
                                }

                                if (typeof nftContract.getCarbonMetadata === 'function') {
                                    try {
                                        const carbonMeta = await nftContract.getCarbonMetadata(tokenId);
                                        cid = carbonMeta[0] || 'N/A';
                                        did = carbonMeta[1] || 'N/A';
                                        co2_amount = carbonMeta[2] ? carbonMeta[2].toString() : '0';
                                    } catch (e) {
                                        // console.log(`getCarbonMetadata failed for ${tokenId}:`, e.message);
                                    }
                                }

                                if (co2_amount === '0' && typeof nftContract.getDebtMetadata === 'function') {
                                    try {
                                        const debtMeta = await nftContract.getDebtMetadata(tokenId);
                                        did = debtMeta[0] || 'N/A';
                                        cid = debtMeta[1] || 'N/A';
                                        co2_amount = debtMeta[3] ? debtMeta[3].toString() : '0';
                                    } catch (e) {
                                        // console.log(`getDebtMetadata failed for ${tokenId}:`, e.message);
                                    }
                                }

                                nftList.push({
                                    tokenId: tokenId.toString(),
                                    contractAddress: contractAddress,
                                    tokenUri: tokenUri,
                                    nftType: type,
                                    cid: cid,
                                    did: did,
                                    co2_amount: co2_amount,
                                    isListed: false,
                                    listingPrice: null
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
