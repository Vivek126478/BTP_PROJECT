const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting deployment...\n");

  // Deploy UserIdentity Contract
  console.log("Deploying UserIdentity Contract...");
  const UserIdentity = await hre.ethers.getContractFactory("UserIdentity");
  const userIdentity = await UserIdentity.deploy();
  await userIdentity.waitForDeployment();
  const userIdentityAddress = await userIdentity.getAddress();
  console.log("✅ UserIdentity deployed to:", userIdentityAddress);

  // Deploy RideContract
  console.log("\nDeploying RideContract...");
  const RideContract = await hre.ethers.getContractFactory("RideContract");
  const rideContract = await RideContract.deploy();
  await rideContract.waitForDeployment();
  const rideContractAddress = await rideContract.getAddress();
  console.log("✅ RideContract deployed to:", rideContractAddress);

  // Deploy Reputation Contract
  console.log("\nDeploying Reputation Contract...");
  const Reputation = await hre.ethers.getContractFactory("Reputation");
  const reputation = await Reputation.deploy();
  await reputation.waitForDeployment();
  const reputationAddress = await reputation.getAddress();
  console.log("✅ Reputation deployed to:", reputationAddress);

  // Save contract addresses and ABIs
  const contractAddresses = {
    UserIdentity: userIdentityAddress,
    RideContract: rideContractAddress,
    Reputation: reputationAddress,
    network: hre.network.name,
    deployedAt: new Date().toISOString()
  };

  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save addresses
  fs.writeFileSync(
    path.join(deploymentsDir, "contract-addresses.json"),
    JSON.stringify(contractAddresses, null, 2)
  );

  // Copy ABIs to a shared location for frontend
  const artifactsDir = path.join(__dirname, "../artifacts/contracts");
  const abisDir = path.join(__dirname, "../deployments/abis");
  
  if (!fs.existsSync(abisDir)) {
    fs.mkdirSync(abisDir, { recursive: true });
  }

  // Copy UserIdentity ABI
  const userIdentityArtifact = require(path.join(artifactsDir, "UserIdentity.sol/UserIdentity.json"));
  fs.writeFileSync(
    path.join(abisDir, "UserIdentity.json"),
    JSON.stringify(userIdentityArtifact.abi, null, 2)
  );

  // Copy RideContract ABI
  const rideContractArtifact = require(path.join(artifactsDir, "RideContract.sol/RideContract.json"));
  fs.writeFileSync(
    path.join(abisDir, "RideContract.json"),
    JSON.stringify(rideContractArtifact.abi, null, 2)
  );

  // Copy Reputation ABI
  const reputationArtifact = require(path.join(artifactsDir, "Reputation.sol/Reputation.json"));
  fs.writeFileSync(
    path.join(abisDir, "Reputation.json"),
    JSON.stringify(reputationArtifact.abi, null, 2)
  );

  console.log("\n✅ Contract addresses and ABIs saved to deployments/");
  console.log("\n📋 Deployment Summary:");
  console.log("========================");
  console.log("UserIdentity:", userIdentityAddress);
  console.log("RideContract:", rideContractAddress);
  console.log("Reputation:", reputationAddress);
  console.log("========================\n");

  // Update .env file with contract addresses
  const envPath = path.join(__dirname, "../../.env");
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, "utf8");
    envContent = envContent.replace(/USER_IDENTITY_CONTRACT_ADDRESS=.*/, `USER_IDENTITY_CONTRACT_ADDRESS=${userIdentityAddress}`);
    envContent = envContent.replace(/RIDE_CONTRACT_ADDRESS=.*/, `RIDE_CONTRACT_ADDRESS=${rideContractAddress}`);
    envContent = envContent.replace(/REPUTATION_CONTRACT_ADDRESS=.*/, `REPUTATION_CONTRACT_ADDRESS=${reputationAddress}`);
    fs.writeFileSync(envPath, envContent);
    console.log("✅ Updated .env file with contract addresses\n");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
