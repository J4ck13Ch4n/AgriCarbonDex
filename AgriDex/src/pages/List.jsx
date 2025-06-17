import React, { useEffect, useState } from "react";
import { getContracts } from "../utils/contractHelpers";
import { NFTDEX_ADDRESS } from "../utils/constants";

function ApproveButton({ tokenId }) {
    const handleApprove = async () => {
        const { offsetNFT } = await getContracts();
        try {
            const tx = await offsetNFT.approve(NFTDEX_ADDRESS, tokenId);
            await tx.wait();
            alert("Approve thành công!");
        } catch (err) {
            alert("Approve thất bại: " + err.message);
        }
    };

    return <button onClick={handleApprove}>Approve NFT {tokenId} cho DEX</button>;
}

function ListNFTForm({ tokenId, userAddress }) {
    const [price, setPrice] = useState("");

    const handleList = async () => {
        if (!userAddress) {
            alert("Vui lòng kết nối ví!");
            return;
        }
        if (!price || parseFloat(price) <= 0) {
            alert("Vui lòng nhập giá hợp lệ!");
            return;
        }
        // Gửi request lên backend (giả sử có API /api/list-nft)
        const res = await fetch("http://localhost:3001/api/list-nft", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                actualSeller: userAddress, // Sử dụng userAddress từ props
                tokenId,
                price, // số lượng CCT
            }),
        });
        if (res.ok) {
            alert("List NFT thành công!");
        } else {
            const errorData = await res.json();
            alert("List NFT thất bại: " + (errorData.error || res.statusText));
        }
    };

    return (
        <div>
            <input
                type="number"
                placeholder="Nhập giá CCT"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />
            <button onClick={handleList}>List lên sàn</button>
        </div>
    );
}

const MyNFTs = () => {
    const [nfts, setNfts] = useState([]);
    const [address, setAddress] = useState("");

    useEffect(() => {
        const fetchNFTs = async () => {
            const { offsetNFT, signer } = await getContracts();
            const userAddress = await signer.getAddress();
            setAddress(userAddress);

            // Lấy tổng số NFT đã mint
            const nextTokenId = await offsetNFT.nextTokenId();
            const nftList = [];
            for (let tokenId = 0; tokenId < nextTokenId; tokenId++) {
                try {
                    const owner = await offsetNFT.ownerOf(tokenId);
                    if (owner.toLowerCase() === userAddress.toLowerCase()) {
                        const tokenURI = await offsetNFT.tokenURI(tokenId);
                        nftList.push({ tokenId: tokenId.toString(), tokenURI });
                    }
                } catch (err) {
                    // tokenId chưa mint hoặc đã bị burn, bỏ qua
                }
            }
            setNfts(nftList);
        };

        fetchNFTs();
    }, []);

    return (
        <div>
            <h2>NFT bạn sở hữu ({address})</h2>
            <ul>
                {nfts.map((nft) => (
                    <li key={nft.tokenId}>
                        Token ID: {nft.tokenId} <br />
                        Token URI: {nft.tokenURI} <br />
                        <ApproveButton tokenId={nft.tokenId} />
                        <ListNFTForm tokenId={nft.tokenId} userAddress={address} /> {/* Truyền address vào userAddress */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MyNFTs;