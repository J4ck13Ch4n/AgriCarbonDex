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

const Trade = () => {
    const [listedNfts, setListedNfts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [buyingNftInfo, setBuyingNftInfo] = useState({ id: null, loading: false, error: null, message: '' }); // For buy process feedback

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
                            items.push({
                                listingId: i,
                                seller: listing.seller,
                                nftContract: listing.nftContract,
                                tokenId: listing.tokenId.toString(),
                                erc20Token: listing.erc20Token,
                                price: ethers.formatUnits(listing.price, 18),
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
        <div style={{ background: '#111214', minHeight: '100vh', color: 'white' }}>
            <Navbar />
            <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px 8px' }}>
                <div style={{ display: 'flex', gap: '10px', minHeight: '400px' }}>
                    <div style={{ flex: '1 1 25%', minWidth: 340, display: 'flex', flexDirection: 'column', alignItems: 'stretch', marginRight: 12 }}>
                        <OrderForm data={[]} />
                    </div>
                    <div style={{ flex: '1 1 75%', minWidth: 800, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', gap: '24px', flex: 1, minHeight: 400 }}>
                            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                                <PriceChart />
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                                <OrderBook />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', marginLeft: -14 }}>
                            <TabPanel
                                listedNfts={listedNfts}
                                loadingNfts={loading}
                                nftsError={error}
                            />
                        </div>
                    </div>
                </div>

                {/* Section to display listed NFTs */}
                <div style={{ marginTop: '20px', padding: '20px', background: '#1a1b1e', borderRadius: '8px', color: 'white' /* Thêm màu chữ để dễ thấy */ }}>
                    <h2>NFTs For Sale</h2>
                    {/* TẠM THỜI COMMENT CÁC ĐIỀU KIỆN LOADING/ERROR */}
                    {/* {loading && <p>Loading listed NFTs...</p>} */}
                    {/* {error && <p style={{ color: 'red' }}>Error: {error}</p>} */}

                    {listedNfts.length === 0 && (
                        <p>No NFTs are currently listed for sale (or data still loading/error).</p>
                    )}
                    {listedNfts.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                            {listedNfts.map((nft) => (
                                <div key={nft.listingId} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', background: '#222327' }}>
                                    <p><strong>Listing ID:</strong> {nft.listingId}</p>
                                    <p><strong>Token ID:</strong> {nft.tokenId}</p>
                                    <p><strong>NFT Contract:</strong> {nft.nftContract}</p>
                                    <p><strong>Seller:</strong> {nft.seller}</p>
                                    <p><strong>Price:</strong> {nft.price} CCT</p>
                                    <button
                                        onClick={() => handleBuyNft(nft)}
                                        disabled={buyingNftInfo.loading && buyingNftInfo.id === nft.listingId}
                                        style={{ marginTop: '10px', padding: '8px 12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        {buyingNftInfo.loading && buyingNftInfo.id === nft.listingId ? 'Processing...' : 'Buy NFT'}
                                    </button>
                                    {buyingNftInfo.id === nft.listingId && buyingNftInfo.message && (
                                        <p style={{ marginTop: '5px', fontSize: '0.9em', color: 'lightgreen' }}>{buyingNftInfo.message}</p>
                                    )}
                                    {buyingNftInfo.id === nft.listingId && buyingNftInfo.error && (
                                        <p style={{ marginTop: '5px', fontSize: '0.9em', color: 'red' }}>Error: {buyingNftInfo.error}</p>
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
