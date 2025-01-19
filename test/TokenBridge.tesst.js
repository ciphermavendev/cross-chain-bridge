const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenBridge", function () {
    let TokenBridge;
    let BridgeValidator;
    let TestToken;
    let bridge;
    let validator;
    let token;
    let owner;
    let user;
    let validator2;
    let validator3;

    beforeEach(async function () {
        [owner, user, validator2, validator3] = await ethers.getSigners();

        // Deploy test token
        TestToken = await ethers.getContractFactory("TestToken");
        token = await TestToken.deploy("Test Token", "TST");
        await token.deployed();

        // Deploy validator
        BridgeValidator = await ethers.getContractFactory("BridgeValidator");
        validator = await BridgeValidator.deploy(2); // Require 2 validations
        await validator.deployed();

        // Add additional validators
        await validator.addValidator(validator2.address);
        await validator.addValidator(validator3.address);

        // Deploy bridge
        TokenBridge = await ethers.getContractFactory("TokenBridge");
        bridge = await TokenBridge.deploy(validator.address);
        await bridge.deployed();

        // Setup
        await bridge.addSupportedToken(token.address);
        await token.mint(user.address, ethers.utils.parseEther("1000"));
        await token.connect(user).approve(bridge.address, ethers.utils.parseEther("1000"));
    });

    describe("Token Management", function () {
        it("Should add supported token", async function () {
            const newToken = await TestToken.deploy("New Token", "NEW");
            await bridge.addSupportedToken(newToken.address);
            expect(await bridge.supportedTokens(newToken.address)).to.be.true;
        });

        it("Should remove supported token", async function () {
            await bridge.removeSupportedToken(token.address);
            expect(await bridge.supportedTokens(token.address)).to.be.false;
        });

        it("Should revert when non-owner adds token", async function () {
            await expect(
                bridge.connect(user).addSupportedToken(token.address)
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });

    describe("Bridge Operations", function () {
        const amount = ethers.utils.parseEther("100");
        const destinationChain = "BSC";
        let transactionHash;

        it("Should lock tokens", async function () {
            const tx = await bridge.connect(user).lockTokens(
                token.address,
                amount,
                destinationChain,
                user.address
            );

            const receipt = await tx.wait();
            const event = receipt.events.find(e => e.event === 'TokensLocked');
            transactionHash = event.args.transactionHash;

            expect(await token.balanceOf(bridge.address)).to.equal(amount);
            expect(await token.balanceOf(user.address)).to.equal(
                ethers.utils.parseEther("900")
            );
        });

        it("Should unlock tokens with sufficient validations", async function () {
            // First lock tokens
            const lockTx = await bridge.connect(user).lockTokens(
                token.address,
                amount,
                destinationChain,
                user.address
            );
            const receipt = await lockTx.wait();
            const event = receipt.events.find(e => e.event === 'TokensLocked');
            transactionHash = event.args.transactionHash;

            // Validate transaction
            await validator.connect(validator2).validateTransaction(
                transactionHash,
                token.address,
                user.address,
                amount,
                "Ethereum"
            );
            await validator.connect(validator3).validateTransaction(
                transactionHash,
                token.address,
                user.address,
                amount,
                "Ethereum"
            );

            // Unlock tokens
            await bridge.unlockTokens(
                token.address,
                user.address,
                amount,
                "Ethereum",
                transactionHash
            );

            expect(await token.balanceOf(user.address)).to.equal(
                ethers.utils.parseEther("1000")
            );
        });

        it("Should revert unlock without sufficient validations", async function () {
            const lockTx = await bridge.connect(user).lockTokens(
                token.address,
                amount,
                destinationChain,
                user.address
            );
            const receipt = await lockTx.wait();
            const event = receipt.events.find(e => e.event === 'TokensLocked');
            transactionHash = event.args.transactionHash;

            // Only one validation
            await validator.connect(validator2).validateTransaction(
                transactionHash,
                token.address,
                user.address,
                amount,
                "Ethereum"
            );

            await expect(
                bridge.unlockTokens(
                    token.address,
                    user.address,
                    amount,
                    "Ethereum",
                    transactionHash
                )
            ).to.be.revertedWith("Invalid transaction");
        });
    });
});