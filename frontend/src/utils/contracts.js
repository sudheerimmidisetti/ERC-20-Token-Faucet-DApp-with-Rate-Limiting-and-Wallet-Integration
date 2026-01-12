import { ethers } from 'ethers';
// Note: Make sure these JSON files exist in src/artifacts! 
// If not, copy them from ../artifacts/contracts/...
import TokenABI from '../artifacts/Token.json';
import FaucetABI from '../artifacts/TokenFaucet.json';

const TOKEN_ADDR = import.meta.env.VITE_TOKEN_ADDRESS;
const FAUCET_ADDR = import.meta.env.VITE_FAUCET_ADDRESS;

export const getContracts = async (signerOrProvider) => {
    // If no signer/provider is passed, use a default read-only provider
    let provider = signerOrProvider;
    if (!provider) {
        provider = new ethers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);
    }
    
    const token = new ethers.Contract(TOKEN_ADDR, TokenABI.abi, provider);
    const faucet = new ethers.Contract(FAUCET_ADDR, FaucetABI.abi, provider);
    
    return { token, faucet, addresses: { token: TOKEN_ADDR, faucet: FAUCET_ADDR } };
};