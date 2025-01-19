const hre = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);

    // Deploy Validator
    const BridgeValidator = await ethers.getContractFactory("BridgeValidator");
    const validator = await BridgeValidator.deploy(1); // Initial threshold of 1
    await validator.deployed();
    console.log("BridgeValidator deployed to:", validator.address);

    // Deploy Bridge
    const TokenBridge = await ethers.getContractFactory("TokenBridge");
    const bridge = await TokenBridge.deploy(validator.address);
    await bridge.deployed();
    console.log("TokenBridge deployed to:", bridge.address);

    // Deploy test token on test networks
    if (["hardhat", "localhost", "testnet"].includes(hre.network.name)) {
        const TestToken = await ethers.getContractFactory("TestToken");
        const testToken = await TestToken.deploy("Test Token", "TST");
        await testToken.deployed();
        console.log("TestToken deployed to:", testToken.address);

        // Add test token to bridge
        await bridge.addSupportedToken(testToken.address);
        console.log("TestToken added to supported tokens");

        // Mint some test tokens
        const mintAmount = ethers.utils.parseEther("1000000");
        await testToken.mint(deployer.address, mintAmount);
        console.log("Minted test tokens to deployer");
    }

    // Verify contracts on supported networks
    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
        console.log("Waiting for block confirmations...");
        await bridge.deployTransaction.wait(6);
        await validator.deployTransaction.wait(6);

        console.log("Verifying contracts...");
        try {
            await hre.run("verify:verify", {
                address: validator.address,
                constructorArguments: [1],
            });

            await hre.run("verify:verify", {
                address: bridge.address,
                constructorArguments: [validator.address],
            });
        } catch (error) {
            console.error("Error verifying contracts:", error);
        }
    }

    // Return deployed contract addresses
    return {
        validator: validator.address,
        bridge: bridge.address,
    };
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });