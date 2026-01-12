import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getContracts } from './utils/contracts';
import './utils/eval'; // IMPORT EVAL HERE

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [canClaim, setCanClaim] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
    }
  };

  const loadData = async () => {
    if (!account) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const { token, faucet } = await getContracts(provider);
    
    const bal = await token.balanceOf(account);
    setBalance(ethers.formatEther(bal));
    
    const claimable = await faucet.canClaim(account);
    setCanClaim(claimable);
  };

  useEffect(() => {
    loadData();
    // Refresh every 10s
    const interval = setInterval(loadData, 10000); 
    return () => clearInterval(interval);
  }, [account]);

  const handleClaim = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const { faucet } = await getContracts(signer);
      const tx = await faucet.requestTokens();
      await tx.wait();
      await loadData();
    } catch (err) {
      setError(err.reason || err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Token Faucet</h1>
      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected: {account}</p>
          <p>Balance: {balance} DVT</p>
          <button 
            onClick={handleClaim} 
            disabled={!canClaim || loading}
            style={{ padding: "10px 20px", fontSize: "16px" }}
          >
            {loading ? "Processing..." : canClaim ? "Claim Tokens" : "Cooldown Active"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}
    </div>
  );
}

export default App;