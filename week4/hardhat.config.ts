import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import "hardhat-deploy";

import "./tasks";

import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
      localhost: 0,
    },
  },
  // Default network when you don't specify "--network {network_name}"
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    localhost: {
      url: "http://localhost:8545",
    },
    bsctest: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts:
        //process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      {
       mnemonic: process.env.MNEMONIC,
       //count: 1,
      },
      saveDeployments: true,
      chainId: 97,
    },
  },

  etherscan: {
    // npx hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
    apiKey: process.env.BSCSCAN_API_KEY,
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 20000,
  },
};

export default config;