import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Navbar from '../components/Navbar';
import OrderForm from '../components/OrderForm';
import PriceChart from '../components/PriceChart';
import OrderBook from '../components/OrderBook';
import TabPanel from '../components/TabPanel';
import { NFTDEX_ADDRESS } from '../utils/constants';
import NFTDEX_ABI from '../abi/NFTDEX.json';
import ERC20_ABI from '../abi/CarbonCreditToken.json'; // Import ERC20 ABI from CarbonCreditToken.json
import { getContracts } from '../utils/contractHelpers';
import { connectMetamask } from '../utils/metamask';

const Trade = () => {
    const [account, setAccount] = useState(null);
    const [connecting, setConnecting] = useState(false);
    const [listedNfts, setListedNfts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [buyingNftInfo, setBuyingNftInfo] = useState({ id: null, loading: false, error: null, message: '' }); // For buy process feedback

    const handleConnect = async () => {
        setConnecting(true);
        try {
            const acc = await connectMetamask();
            setAccount(acc);
        } catch (e) {
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
                } catch (err) {
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

                const { dex, provider, signer } = await getContracts();

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

                            // Lấy thông tin CID và DID từ NFT contract
                            let cid = 'N/A';
                            let did = 'N/A';
                            let co2_amount = '0'; // Default to '0'
                            try {
                                const nftContract = new ethers.Contract(listing.nftContract, [
                                    "function getDebtMetadata(uint256 tokenId) view returns (string, string, string, uint256)",
                                    "function getCarbonMetadata(uint256 tokenId) view returns (string, string, uint256)",
                                    "function ownerOf(uint256 tokenId) view returns (address)"
                                ], provider);

                                try {
                                    await nftContract.ownerOf(listing.tokenId);
                                } catch (ownerError) {
                                    console.log(`Token ${listing.tokenId} does not exist, skipping.`);
                                    continue;
                                }

                                try {
                                    const metadata = await nftContract.getDebtMetadata(listing.tokenId);
                                    did = metadata[0] || 'N/A';
                                    cid = metadata[1] || 'N/A';
                                    co2_amount = metadata[3] ? metadata[3].toString() : '0';
                                } catch (debtError) {
                                    try {
                                        const carbonMetadata = await nftContract.getCarbonMetadata(listing.tokenId);
                                        cid = carbonMetadata[0] || 'N/A';
                                        did = carbonMetadata[1] || 'N/A';
                                        co2_amount = carbonMetadata[2] ? carbonMetadata[2].toString() : '0';
                                    } catch (carbonError) {
                                        console.log(`Could not get metadata for token ${listing.tokenId}`);
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
                                did: did,
                                co2_amount: co2_amount
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
        setBuyingNftInfo({ id: listing.listingId, loading: true, error: null, message: 'Approving CCT spending...' });
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

    return (
        <div className="min-h-screen" style={{ background: '#111214', color: '#fff', paddingTop: '80px' }}>
            <Navbar account={account} connecting={connecting} onConnect={handleConnect} />
            <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px 8px' }}>

                {/* Section to display listed NFTs */}
                <div className="card-dark" style={{ marginTop: '20px', padding: '20px', background: '#1a1b1e', borderRadius: '12px', color: '#fff', border: '1px solid #333' }}>
                    <h2 style={{ color: '#fff', marginBottom: '20px', fontSize: '1.5rem', fontWeight: '600' }}>NFTs For Sale</h2>
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
                                                    try {
                                                        const co2String = nft.co2_amount ? nft.co2_amount.toString() : 'N/A';

                                                        if (co2String === 'N/A') {
                                                            return 'N/A';
                                                        }
                                                        if (co2String === '0') {
                                                            return '0.00 kg';
                                                        }

                                                        const amountInGramsX100 = BigInt(co2String);
                                                        const amountInGrams = amountInGramsX100 / 100n;
                                                        const amountInKg = Number(amountInGrams) / 1000;
                                                        return `${amountInKg.toFixed(2)} kg`;
                                                    } catch (e) {
                                                        console.error("Error parsing co2_amount:", nft.co2_amount, e);
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
                                    </div>
                                    <button
                                        onClick={() => handleBuyNft(nft)}
                                        disabled={buyingNftInfo.loading && buyingNftInfo.id === nft.listingId}
                                        className="trade-buy-btn"
                                        style={{
                                            marginTop: 18,
                                            padding: '12px 0',
                                            background: '#00ffae',
                                            color: '#111',
                                            border: '1px solid #00ffae',
                                            borderRadius: '8px',
                                            fontWeight: 700,
                                            fontSize: 16,
                                            cursor: 'pointer',
                                            opacity: (buyingNftInfo.loading && buyingNftInfo.id === nft.listingId) ? 0.7 : 1,
                                            fontFamily: 'Roboto Mono, monospace',
                                            letterSpacing: 1,
                                            minWidth: 120,
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {buyingNftInfo.loading && buyingNftInfo.id === nft.listingId ? 'Processing...' : 'Buy NFT'}
                                    </button>
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