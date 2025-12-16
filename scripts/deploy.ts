import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying MultiSigWallet with the account:", deployer.address);

  // 1-of-1 wallet for testing
  const owners = [
    "0x3D3233E8526486C1D0713780003B15d1654c9aa0",
  ];
  const required = 1;

  console.log("Owners:", owners);
  console.log("Required confirmations:", required);

  const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
  const wallet = await MultiSigWallet.deploy(owners, required);

  await wallet.waitForDeployment();

  const address = await wallet.getAddress();
  console.log("MultiSigWallet deployed to:", address);

  // Verify the deployment
  console.log("\nDeployment complete!");
  console.log("Contract address:", address);
  console.log("\nTo use this wallet in the Farcaster miniapp:");
  console.log("1. Open the miniapp");
  console.log("2. Enter the contract address:", address);
  console.log("3. Connect your wallet");
  console.log("4. Start managing your multi-sig!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
