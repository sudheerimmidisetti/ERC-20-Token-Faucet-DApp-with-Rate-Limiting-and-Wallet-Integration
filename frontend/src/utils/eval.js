import { ethers } from 'ethers';
import { getContracts } from './contracts';

window.__EVAL__ = {
  connectWallet: async () => {
    if (!window.ethereum) throw new Error("No wallet found");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    return accounts[0];
  },

  requestTokens: async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const { faucet } = await getContracts(signer);
    
    try {
      const tx = await faucet.requestTokens();
      await tx.wait(); 
      return tx.hash;
    } catch (error) {
      throw new Error(error.reason || error.message);
    }
  },

  getBalance: async (address) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const { token } = await getContracts(provider);
    const balance = await token.balanceOf(address);
    return balance.toString(); 
  },

  canClaim: async (address) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const { faucet } = await getContracts(provider);
    return await faucet.canClaim(address); 
  },

  getRemainingAllowance: async (address) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const { faucet } = await getContracts(provider);
    const allowance = await faucet.remainingAllowance(address);
    return allowance.toString(); 
  },

  getContractAddresses: async () => {
    return {
      token: import.meta.env.VITE_TOKEN_ADDRESS,
      faucet: import.meta.env.VITE_FAUCET_ADDRESS
    };
  }
};