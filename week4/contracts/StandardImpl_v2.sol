// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

contract StandardImpl_v2 {
    uint256 public constant VERSION = 2;

    bool public initialized;

    uint256 public value;

    modifier initializer() {
        require(!initialized, "Only initialize once");
        _;
        initialized = true;
    }

    function initialize(uint256 _initValue) public initializer {
        value = _initValue;
    }

    function setValue(uint256 _newValue) public {
        value = _newValue;
    }

    function incrValue() public {
        value = value + 1;
    }

    function decrValue() public {
        value = value - 1;
    }

    function version() public pure returns (uint256) {
        return 2;
    }
}