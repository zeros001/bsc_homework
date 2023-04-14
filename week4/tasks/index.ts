import { task, types } from "hardhat/config";


task("getVersion").setAction(async (_, hre) => {
  //const { network } = hre;
  //const [dev] = await hre.ethers.getSigners();

  const transparentProxy = await hre.ethers.getContract("StandardImpl_Proxy")

  //hre.ethers  也可以如下直接写成ethers
  const proxy = await ethers.getContractAt("StandardImpl_v2", transparentProxy.address)
  const version = await proxy.version()

  //不能这样调用，会出错
  //TypeError: transparentProxy.version is not a function
  //const version = await transparentProxy.version()

  console.log('version : ', version.toString())
});


task("getValue").setAction(async (_, hre) => {

  const transparentProxy = await hre.ethers.getContract("StandardImpl_Proxy")

  const proxy = await hre.ethers.getContractAt("StandardImpl_v2", transparentProxy.address)
  const value = await proxy.value()

  //这样调用会打印出一个js函数定义来
  //const value = await proxy.value

  console.log('value : ', value.toString())
});


task("setValue")
  .addParam("val", "The value to set", undefined, types.int)
  .setAction(async (taskArgs, hre) => {

    const transparentProxy = await hre.ethers.getContract("StandardImpl_Proxy")

    const proxy = await hre.ethers.getContractAt("StandardImpl_v2", transparentProxy.address)
    let value = await proxy.value()
    console.log('oldValue : ', value.toString())

    //set new value
    const tx = await proxy.setValue(taskArgs.val);
    console.log("tx: ", await tx.wait());

    value = await proxy.value()
    console.log('newValue : ', value.toString())
  });