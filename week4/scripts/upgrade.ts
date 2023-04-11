const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("./helper-hardhat-config.js")
const { ethers, network, deployments, getNamedAccounts } = require("hardhat")
const { verify } = require("./helper-functions.js")


async function main() {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    log("----------------------------------------------------")

    const impl = await deploy("StandardImpl_v2", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(impl.address, [])
    }

    // Upgrade!
    // Not "the hardhat-deploy way"
    const proxyAdmin = await ethers.getContract("ProxyAdmin")
    const transparentProxy = await ethers.getContract("StandardImpl_Proxy")
    const upgradeTx = await proxyAdmin.upgrade(transparentProxy.address, impl.address)
    await upgradeTx.wait(1)
    const proxy = await ethers.getContractAt("StandardImpl_v2", transparentProxy.address)
    const version = await proxy.version()
    console.log('New version : ', version.toString())
    log("----------------------------------------------------")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })