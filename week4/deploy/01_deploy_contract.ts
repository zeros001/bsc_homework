import { DeployFunction, ProxyOptions } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../scripts/helper-hardhat-config.js")
const { verify } = require("../scripts/helper-functions.js")
import { ethers } from "hardhat";


//https://www.npmjs.com/package/hardhat-deploy

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  console.log("Deploying My Contract with account:", deployer);


  const proxyOptions: ProxyOptions = {
    proxyContract: "TransparentUpgradeableProxy",
    viaAdminContract: "ProxyAdmin",
    execute: {
      // 只在初始化时执行
      init: {
        // 执行initialize方法
        methodName: "initialize",
        // 参数
        args: [1],
      },
    },
  };

  const myContract = await deploy("StandardImpl", {
    contract: "StandardImpl",
    from: deployer,
    proxy: proxyOptions,
    args: [],
    log: true,
  });

  console.log("Proxy deployed to:", myContract.address);
  console.log("Implementation deployed to:", myContract.implementation);


  // Be sure to check out the hardhat-deploy examples to use UUPS proxies!
    // https://github.com/wighawag/template-ethereum-contracts

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
      log("Verifying...")
      const impl = (await ethers.getContract("StandardImpl_Implementation")).address;
      await verify(impl, [])
  }
  log("----------------------------------------------------")


};

// npx hardhat deploy --network {network} --tags {Tag}
func.tags = ["MyContract"];
export default func;