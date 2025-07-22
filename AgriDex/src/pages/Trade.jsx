import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Navbar from '../components/Navbar';
import OrderForm from '../components/OrderForm';
import PriceChart from '../components/PriceChart';
import OrderBook from '../components/OrderBook';
import TabPanel from '../components/TabPanel';
import { NFTDEX_ADDRESS, CARBON_OFFSET_NFT_ADDRESS } from '../utils/constants';
import NFTDEX_ABI from '../abi/NFTDEX.json';
import ERC20_ABI from '../abi/CarbonCreditToken.json'; // Import ERC20 ABI from CarbonCreditToken.json
import { getContracts } from '../utils/contractHelpers';
import { connectMetamask } from '../utils/metamask';

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

const Trade = () => {
    const [account, setAccount] = useState(null);
    const [connecting, setConnecting] = useState(false);
    const [listedNfts, setListedNfts] = useState([]);
    const [_loading, setLoading] = useState(true);
    const [_error, setError] = useState(null);
    const [buyingNftInfo, setBuyingNftInfo] = useState({ id: null, loading: false, error: null, message: '' }); // For buy process feedback

    const handleConnect = async () => {
        setConnecting(true);
        try {
            const acc = await connectMetamask();
            setAccount(acc);
        } catch {
            alert('Failed to connect MetaMask!');
        }
        setConnecting(false);
    };

    // Luôn kiểm tra trạng thái đăng nhập MetaMask khi load trang
    useEffect(() => {
        const checkMetamask = async () => {
            if (window.ethereum && window.ethereum.selectedAddress) {
                setAccount(window.ethereum.selectedAddress);
            } else if (window.ethereum && window.ethereum.request) {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    if (accounts && accounts.length > 0) {
                        setAccount(accounts[0]);
                    }
                } catch {
                    // Không làm gì nếu không lấy được tài khoản
                }
            }
            // Lắng nghe sự kiện thay đổi tài khoản
            if (window.ethereum && window.ethereum.on) {
                const handleAccountsChanged = (accounts) => {
                    setAccount(accounts && accounts.length > 0 ? accounts[0] : null);
                };
                window.ethereum.on('accountsChanged', handleAccountsChanged);
                return () => {
                    window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                };
            }
        };
        checkMetamask();
    }, []);

    useEffect(() => {
        const fetchListedNfts = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log("Attempting to fetch listed NFTs..."); // Log bắt đầu

                const { dex, provider } = await getContracts();

                if (!dex || !provider) {
                    setError("Failed to connect to contracts or provider. Please ensure your wallet is connected and on the correct network.");
                    setLoading(false);
                    console.error("Dex contract or provider is missing."); // Log lỗi
                    return;
                }

                const counter = await dex.listingIdCounter();
                const listingsCount = parseInt(counter.toString());
                console.log("Listing ID Counter from contract:", listingsCount); // Log số lượng counter

                const items = [];
                if (listingsCount > 0) {
                    for (let i = 1; i <= listingsCount; i++) {
                        console.log(`Fetching listing with ID: ${i}`); // Log ID đang fetch
                        const listing = await dex.listings(i);
                        console.log(`Listing ${i} data:`, listing); // Log dữ liệu listing thô

                        if (listing.seller !== ethers.ZeroAddress) {
                            console.log(`Listing ${i} is active. Seller: ${listing.seller}`); // Log listing active

                            // Get CO2 amount directly from DEX contract listing
                            let co2_amount = 'N/A';
                            if (listing.length >= 6 && listing[5]) {
                                try {
                                    // Convert from Wei-like format back to decimal kg
                                    const co2BigInt = listing[5];
                                    const co2Decimal = ethers.formatUnits(co2BigInt, 18);
                                    co2_amount = co2Decimal;
                                    console.log(`[Trade - DEX] CO2 amount from DEX listing ${i}: ${co2_amount} (raw: ${co2BigInt.toString()})`);
                                } catch (parseError) {
                                    console.log(`[Trade - DEX] Error parsing CO2 amount: ${parseError.message}`);
                                    co2_amount = 'N/A';
                                }
                            } else {
                                console.log(`[Trade - DEX] CO2 amount not found in listing ${i}, set to N/A`);
                            }

                            // Lấy thông tin CID và DID từ NFT contract (chỉ CID và DID)
                            let cid = 'N/A';
                            let did = 'N/A';
                            let multipleCids = []; // For storing multiple CIDs

                            // Determine NFT type based on contract address (same as List.jsx logic)
                            const nftType = listing.nftContract.toLowerCase() === CARBON_OFFSET_NFT_ADDRESS.toLowerCase() ? 'offset' : 'debt';
                            console.log(`[Trade - Debug] NFT Type for token ${listing.tokenId}: ${nftType}`);

                            try {
                                const nftContract = new ethers.Contract(listing.nftContract, [
                                    "function getDebtMetadata(uint256 tokenId) view returns (string, string, string, uint256)",
                                    "function getCarbonMetadata(uint256 tokenId) view returns (string, string, string)",
                                    "function carbonData(uint256 tokenId) view returns (string, string, string)",
                                    "function ownerOf(uint256 tokenId) view returns (address)"
                                ], provider);

                                try {
                                    await nftContract.ownerOf(listing.tokenId);
                                } catch {
                                    console.log(`Token ${listing.tokenId} does not exist, skipping.`);
                                    continue;
                                }

                                // Use same conditional logic as List.jsx - only call appropriate function for NFT type
                                // But only fetch CID and DID, not CO2 amount since we get it from DEX
                                if (nftType === 'offset') {
                                    // Try carbon offset metadata first (like in List.jsx)
                                    try {
                                        const carbonMeta = await nftContract.getCarbonMetadata(listing.tokenId);
                                        console.log(`[Trade - Debug] Raw getCarbonMetadata result for token ${listing.tokenId}:`, carbonMeta);
                                        // Access tuple elements by index
                                        if (carbonMeta && carbonMeta.length >= 2) {
                                            const rawCid = carbonMeta[0] || 'N/A';
                                            const cidInfo = parseCIDData(rawCid);
                                            cid = cidInfo.cid;
                                            did = carbonMeta[1] || 'N/A';

                                            // Store multiple CIDs info for later use
                                            multipleCids = cidInfo.cids;
                                            console.log(`[Trade - Offset NFT] Token ID: ${listing.tokenId}, CID: ${cid}, CIDs: ${JSON.stringify(cidInfo.cids)}, DID: ${did}`);
                                        } else {
                                            console.error(`getCarbonMetadata for offset token ${listing.tokenId} returned insufficient data:`, carbonMeta);
                                            cid = 'N/A';
                                            did = 'N/A';
                                        }
                                    } catch (e) {
                                        console.error(`getCarbonMetadata failed for offset token ${listing.tokenId}:`, e);
                                    }
                                }
                                if (nftType === 'debt') {
                                    // Try debt metadata as fallback
                                    try {
                                        const debtMeta = await nftContract.getDebtMetadata(listing.tokenId);
                                        console.log(`[Trade - Debug] Raw getDebtMetadata result for token ${listing.tokenId}:`, debtMeta);
                                        // With the correct ABI, we can access properties by name
                                        if (debtMeta && typeof debtMeta.co2Amount !== 'undefined') {
                                            did = debtMeta.did || 'N/A';
                                            const rawCid = debtMeta.ipfsCid || 'N/A';
                                            const cidInfo = parseCIDData(rawCid);
                                            cid = cidInfo.cid;
                                            console.log(`[Trade - Debt NFT] Token ID: ${listing.tokenId}, CID: ${cid}, CIDs: ${JSON.stringify(cidInfo.cids)}`);

                                            // Store multiple CIDs info for debt NFTs too
                                            multipleCids = cidInfo.cids;
                                        } else {
                                            console.error(`getDebtMetadata for debt token ${listing.tokenId} returned an invalid or incomplete result:`, debtMeta);
                                        }
                                    } catch (e) {
                                        console.error(`getDebtMetadata failed for debt token ${listing.tokenId}:`, e);
                                    }
                                }
                            } catch (contractError) {
                                console.log(`Error creating contract instance for metadata:`, contractError.message);
                            }

                            items.push({
                                listingId: i,
                                seller: listing.seller,
                                nftContract: listing.nftContract,
                                tokenId: listing.tokenId.toString(),
                                erc20Token: listing.erc20Token,
                                price: ethers.formatUnits(listing.price, 18),
                                cid: cid,
                                cids: multipleCids.length > 0 ? multipleCids : [cid !== 'N/A' ? cid : 'N/A'],
                                did: did,
                                co2_amount: co2_amount // Use CO2 amount fetched from DEX contract
                            });
                        } else {
                            console.log(`Listing ${i} is NOT active or already sold/cancelled. Seller: ${listing.seller}`);
                        }
                    }
                } else {
                    console.log("No listings found based on counter (counter is 0).");
                }

                console.log("Final items to be set as listedNfts:", items); // Log mảng items cuối cùng
                setListedNfts(items);

            } catch (err) {
                console.error("Detailed error fetching listed NFTs:", err); // Log lỗi chi tiết
                if (err.message.includes("MetaMask") || err.message.includes("wallet")) {
                    setError("Wallet connection error. Please check MetaMask.");
                } else if (err.code === 'NETWORK_ERROR') {
                    setError("Network error. Please check your internet connection and blockchain network.");
                } else {
                    setError("Failed to fetch listed NFTs. Check console for detailed error.");
                }
            } finally {
                setLoading(false);
                console.log("Finished fetching listed NFTs attempt."); // Log kết thúc
            }
        };

        fetchListedNfts();
    }, []);


    {/*Chức năng mua NFT */ }
    const handleBuyNft = async (listing) => {
        setBuyingNftInfo({ id: listing.listingId, loading: true, error: null, message: 'Checking CCT balance...' });
        try {
            const { signer } = await getContracts();
            if (!signer) {
                setBuyingNftInfo({ id: listing.listingId, loading: false, error: "Wallet not connected. Please connect your wallet.", message: '' });
                alert("Wallet not connected. Please connect your wallet.");
                return;
            }

            const cctContract = new ethers.Contract(listing.erc20Token, ERC20_ABI, signer);
            const priceInWei = ethers.parseUnits(listing.price.toString(), 18);
            const buyerAddress = await signer.getAddress();

            // Check if buyer has enough CCT balance
            const buyerBalance = await cctContract.balanceOf(buyerAddress);
            console.log("Debug info:");
            console.log("CCT Contract Address:", listing.erc20Token);
            console.log("Buyer Address:", buyerAddress);
            console.log("Buyer Balance (wei):", buyerBalance.toString());
            console.log("Buyer Balance (CCT):", ethers.formatUnits(buyerBalance, 18));
            console.log("Required Price (wei):", priceInWei.toString());
            console.log("Required Price (CCT):", listing.price);

            if (buyerBalance < priceInWei) {
                setBuyingNftInfo({ id: listing.listingId, loading: false, error: `Insufficient CCT balance. You have ${ethers.formatUnits(buyerBalance, 18)} CCT but need ${listing.price} CCT.`, message: '' });
                alert(`Insufficient CCT balance. You have ${ethers.formatUnits(buyerBalance, 18)} CCT but need ${listing.price} CCT.`);
                return;
            }

            setBuyingNftInfo({ id: listing.listingId, loading: true, error: null, message: 'Approving CCT spending...' });

            // Check allowance and approve if needed
            const currentAllowance = await cctContract.allowance(buyerAddress, NFTDEX_ADDRESS);
            if (currentAllowance < priceInWei) {
                const approveTx = await cctContract.approve(NFTDEX_ADDRESS, priceInWei);
                await approveTx.wait();
            }

            setBuyingNftInfo({ id: listing.listingId, loading: true, error: null, message: 'Calling backend to buy NFT...' });

            // Gọi API backend
            const response = await fetch('http://localhost:3001/api/buy-nft', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ buyer: buyerAddress, listingId: listing.listingId }),
            });
            const data = await response.json();

            if (data.success) {
                setBuyingNftInfo({ id: listing.listingId, loading: false, error: null, message: 'NFT purchased successfully!' });
                alert(`NFT (Listing ID: ${listing.listingId}) purchased successfully!`);
                // Optionally, refresh listed NFTs
            } else {
                throw new Error(data.error || 'Unknown backend error');
            }
        } catch (err) {
            console.error("Error buying NFT:", err);
            const errorMessage = err.reason || err.message || "An unknown error occurred during purchase.";
            setBuyingNftInfo({ id: listing.listingId, loading: false, error: errorMessage, message: '' });
            alert(`Error buying NFT: ${errorMessage}`);
        }
    };

    // Function to request CCT minting
    const _handleRequestCCT = async () => {
        try {
            if (!account) {
                alert("Please connect your wallet first.");
                return;
            }

            const amount = prompt("Enter the amount of CCT to request:", "100");
            if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
                alert("Invalid amount entered.");
                return;
            }

            const response = await fetch('http://localhost:3001/api/request-mint-cct', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: account, amount: parseFloat(amount) }),
            });

            const data = await response.json();
            if (data.success) {
                alert(`Successfully requested ${amount} CCT! Transaction: ${data.txHash}`);
            } else {
                alert(`Failed to request CCT: ${data.error}`);
            }
        } catch (error) {
            console.error("Error requesting CCT:", error);
            alert("Error requesting CCT. Check console for details.");
        }
    };

    return (
        <div className="min-h-screen" style={{ background: '#111214', color: '#fff', paddingTop: '80px' }}>
            <Navbar account={account} connecting={connecting} onConnect={handleConnect} />
            <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px 8px' }}>

                {/* Section to display listed NFTs */}
                <div>
                    <h2 style={{ color: '#fff', margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>NFTs For Sale</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        {/*
                        {account && (
                            <button
                                onClick={handleRequestCCT}
                                style={{
                                    padding: '10px 20px',
                                    background: '#007acc',
                                    color: '#fff',
                                    border: '1px solid #007acc',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                Request CCT
                            </button>
                        )}
                            */}
                    </div>
                    {/* TẠM THỜI COMMENT CÁC ĐIỀU KIỆN LOADING/ERROR */}
                    {/* {loading && <p>Loading listed NFTs...</p>} */}
                    {/* {error && <p style={{ color: 'red' }}>Error: {error}</p>} */}
                    {listedNfts.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
                            {listedNfts.map((nft) => (
                                <div key={nft.listingId} className="nft-card-trade" style={{ minWidth: 340, maxWidth: 420, background: '#232426', borderRadius: 12, padding: 24, color: '#fff', boxShadow: '0 2px 8px #0002', display: 'flex', flexDirection: 'column', marginBottom: 16, border: '1px solid #333' }}>
                                    <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 4, color: '#fff' }}>CarbonNFT #{nft.listingId}</div>
                                    <div style={{ margin: '12px 0 0 0', fontSize: 15 }}>
                                        <div style={{ marginBottom: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ color: '#aaa' }}>Contract Address:</span>
                                            <span style={{ color: '#00ffae', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }} title={nft.nftContract}>
                                                {nft.nftContract.slice(0, 6) + '...' + nft.nftContract.slice(-4)}
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(nft.nftContract)}
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
                                                        // Value from DEX is already in the correct unit (kg from Wei-like format)
                                                        return `${numericAmount.toFixed(10)} kg`;
                                                    } catch {
                                                        return 'N/A';
                                                    }
                                                })()}
                                            </span>
                                        </div>
                                        <div style={{ marginBottom: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ color: '#aaa' }}>Owner:</span>
                                            <span style={{ color: '#00ffae', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }} title={nft.seller}>
                                                {nft.seller.slice(0, 6) + '...' + nft.seller.slice(-4)}
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(nft.seller)}
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
                                            <span style={{ color: '#aaa' }}>Price:</span>
                                            <span style={{ color: '#ffe066', fontWeight: 600 }}>{nft.price} CCT</span>
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
                                    </div>
                                    <button
                                        onClick={() => handleBuyNft(nft)}
                                        disabled={
                                            (buyingNftInfo.loading && buyingNftInfo.id === nft.listingId) ||
                                            nft.nftContract.toLowerCase() !== CARBON_OFFSET_NFT_ADDRESS.toLowerCase()
                                        }
                                        className="trade-buy-btn"
                                        style={{
                                            marginTop: 18,
                                            padding: '12px 0',
                                            background: nft.nftContract.toLowerCase() === CARBON_OFFSET_NFT_ADDRESS.toLowerCase() ? '#00ffae' : '#444',
                                            color: nft.nftContract.toLowerCase() === CARBON_OFFSET_NFT_ADDRESS.toLowerCase() ? '#111' : '#888',
                                            border: `1px solid ${nft.nftContract.toLowerCase() === CARBON_OFFSET_NFT_ADDRESS.toLowerCase() ? '#00ffae' : '#555'}`,
                                            borderRadius: '8px',
                                            fontWeight: 700,
                                            fontSize: 16,
                                            cursor: nft.nftContract.toLowerCase() === CARBON_OFFSET_NFT_ADDRESS.toLowerCase() ? 'pointer' : 'not-allowed',
                                            opacity: (buyingNftInfo.loading && buyingNftInfo.id === nft.listingId) || nft.nftContract.toLowerCase() !== CARBON_OFFSET_NFT_ADDRESS.toLowerCase() ? 0.7 : 1,
                                            fontFamily: 'Roboto Mono, monospace',
                                            letterSpacing: 1,
                                            minWidth: 120,
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {buyingNftInfo.loading && buyingNftInfo.id === nft.listingId
                                            ? 'Processing...'
                                            : nft.nftContract.toLowerCase() === CARBON_OFFSET_NFT_ADDRESS.toLowerCase()
                                                ? 'Buy NFT'
                                                : 'Unavailable'}
                                    </button>
                                    {nft.nftContract.toLowerCase() !== CARBON_OFFSET_NFT_ADDRESS.toLowerCase() && (
                                        <p style={{
                                            marginTop: '8px',
                                            fontSize: '0.9em',
                                            color: '#ff6b6b',
                                            textAlign: 'center',
                                            padding: '8px',
                                            background: 'rgba(255, 107, 107, 0.1)',
                                            borderRadius: '6px',
                                            border: '1px solid rgba(255, 107, 107, 0.2)'
                                        }}>
                                            Only CarbonOffsetNFT can be purchased
                                        </p>
                                    )}
                                    {buyingNftInfo.id === nft.listingId && buyingNftInfo.message && (
                                        <p style={{ marginTop: '8px', fontSize: '1em', color: '#00ffae', textAlign: 'center', padding: '8px', background: 'rgba(0, 255, 174, 0.1)', borderRadius: '6px', border: '1px solid rgba(0, 255, 174, 0.2)' }}>{buyingNftInfo.message}</p>
                                    )}
                                    {buyingNftInfo.id === nft.listingId && buyingNftInfo.error && (
                                        <p style={{ marginTop: '8px', fontSize: '1em', color: '#ef4444', textAlign: 'center', padding: '8px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>Error: {buyingNftInfo.error}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Trade;