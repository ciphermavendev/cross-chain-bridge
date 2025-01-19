interface ITokenBridge {
    event TokensLocked(
        address indexed token,
        address indexed sender,
        uint256 amount,
        string destinationChain,
        address destinationAddress,
        bytes32 indexed transactionHash
    );
    
    event TokensUnlocked(
        address indexed token,
        address indexed recipient,
        uint256 amount,
        string sourceChain,
        bytes32 indexed transactionHash
    );

    function lockTokens(
        address token,
        uint256 amount,
        string calldata destinationChain,
        address destinationAddress
    ) external;

    function unlockTokens(
        address token,
        address recipient,
        uint256 amount,
        string calldata sourceChain,
        bytes32 transactionHash
    ) external;

    function addSupportedToken(address token) external;
    function removeSupportedToken(address token) external;
}