import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getContracts } from "../utils/contractHelpers";
import { NFTDEX_ADDRESS } from "../utils/constants";
import '../style/List.css'; // Import file CSS mới

// --- NFT Card Component ---
function NFTCard({ nft, userAddress }) {
    const [price, setPrice] = useState("");
    const [isApproving, setIsApproving] = useState(false);
    const [isListing, setIsListing] = useState(false);
    const [message, setMessage] = useState("");

    const handleApprove = async () => {
        setIsApproving(true);
        setMessage("Đang yêu cầu approve...");
        try {
            const { offsetNFT } = await getContracts();
            const tx = await offsetNFT.approve(NFTDEX_ADDRESS, nft.tokenId);
            await tx.wait();
            setMessage("Approve thành công!");
        } catch (err) {
            setMessage("Lỗi: " + (err.reason || err.message));
        }
        setIsApproving(false);
    };

    const handleList = async () => {
        if (!price || parseFloat(price) <= 0) {
            setMessage("Vui lòng nhập giá hợp lệ.");
            return;
        }
        setIsListing(true);
        setMessage("Đang list NFT...");
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
                setMessage("List NFT thành công!");
            } else {
                const errorData = await res.json();
                throw new Error(errorData.error || res.statusText);
            }
        } catch (err) {
            setMessage("Lỗi: " + err.message);
        }
        setIsListing(false);
    };

    return (
        <div className="nft-card">
            <div className="nft-card-image-placeholder">NFT #{nft.tokenId}</div>
            <div className="nft-card-info">
                <p>Token ID: {nft.tokenId}</p>
                {/* <p>URI: {nft.tokenURI}</p> */}
            </div>
            <div className="nft-card-actions">
                <button onClick={handleApprove} disabled={isApproving || isListing}>
                    {isApproving ? "Đang xử lý..." : "Approve cho DEX"}
                </button>
                <div className="list-form">
                    <input
                        type="number"
                        placeholder="Giá (CCT)"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        disabled={isApproving || isListing}
                    />
                    <button onClick={handleList} disabled={isApproving || isListing}>
                        {isListing ? "Đang list..." : "List"}
                    </button>
                </div>
            </div>
            {message && <p className="nft-card-message">{message}</p>}
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
            console.error("Lỗi kết nối ví:", err);
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
                    console.error("Không thể lấy tài khoản:", err);
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
            };
            setIsLoading(true);
            try {
                const { offsetNFT } = await getContracts();
                const nextTokenId = await offsetNFT.nextTokenId();
                const nftList = [];
                for (let i = 0; i < nextTokenId; i++) {
                    try {
                        const owner = await offsetNFT.ownerOf(i);
                        if (owner.toLowerCase() === address.toLowerCase()) {
                            const tokenURI = await offsetNFT.tokenURI(i);
                            nftList.push({ tokenId: i.toString(), tokenURI });
                        }
                    } catch (err) {
                        // Bỏ qua token đã bị burn hoặc không tồn tại
                    }
                }
                setNfts(nftList);
            } catch (error) {
                console.error("Lỗi khi tải NFTs:", error);
            }
            setIsLoading(false);
        };

        fetchNFTs();
    }, [address]);

    const renderContent = () => {
        if (!address) {
            return <p className="list-message">Vui lòng kết nối ví để xem NFT của bạn.</p>;
        }
        if (isLoading) {
            return <p className="list-message">Đang tải danh sách NFT...</p>;
        }
        if (nfts.length === 0) {
            return <p className="list-message">Bạn không sở hữu NFT nào.</p>;
        }
        return (
            <div className="nft-grid">
                {nfts.map((nft) => (
                    <NFTCard key={nft.tokenId} nft={nft} userAddress={address} />
                ))}
            </div>
        );
    };

    return (
        <div className="list-container">
            <Navbar account={address} connecting={connecting} onConnect={handleConnect} />
            <div className="list-header">
                <h1>NFT Của Bạn</h1>
                <p>Approve và đặt giá để list NFT của bạn lên sàn giao dịch.</p>
            </div>
            <div className="list-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default MyNFTs;