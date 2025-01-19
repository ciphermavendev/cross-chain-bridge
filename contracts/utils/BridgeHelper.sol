// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library BridgeHelper {
    function generateTransactionHash(
        address token,
        address sender,
        uint256 amount,
        string memory destinationChain,
        address destinationAddress,
        uint256 nonce
    ) internal pure returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                token,
                sender,
                amount,
                destinationChain,
                destinationAddress,
                nonce
            )
        );
    }

    function validateAddress(address addr) internal pure returns (bool) {
        return addr != address(0);
    }

    function validateAmount(uint256 amount) internal pure returns (bool) {
        return amount > 0;
    }

    function validateChainId(string memory chain) internal pure returns (bool) {
        return bytes(chain).length > 0;
    }
}