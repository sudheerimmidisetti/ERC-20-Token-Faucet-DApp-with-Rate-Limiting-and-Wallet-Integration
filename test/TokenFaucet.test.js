const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenFaucet", function () {
  let Token, token, Faucet, faucet, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    
    // Deploy Token
    Token = await ethers.getContractFactory("FaucetToken");
    token = await Token.deploy();
    
    // Deploy Faucet
    Faucet = await ethers.getContractFactory("TokenFaucet");
    faucet = await Faucet.deploy(await token.getAddress());
    
    // Grant Minter Role
    const MINTER_ROLE = await token.MINTER_ROLE();
    await token.grantRole(MINTER_ROLE, await faucet.getAddress());
  });

  it("Should set the right owner", async function () {
    expect(await faucet.owner()).to.equal(owner.address);
  });

  it("Should allow a user to request tokens", async function () {
    await faucet.connect(addr1).requestTokens();
    const balance = await token.balanceOf(addr1.address);
    expect(balance).to.equal(ethers.parseEther("100"));
  });

  it("Should prevent requesting again before cooldown", async function () {
    await faucet.connect(addr1).requestTokens();
    await expect(faucet.connect(addr1).requestTokens()).to.be.revertedWith("Claim not allowed");
  });
});