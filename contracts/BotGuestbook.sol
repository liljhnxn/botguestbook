// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title BotGuestbook
 * @notice A simple, lightweight on-chain guestbook for Botchain Testnet.
 */
contract BotGuestbook {
    struct Message {
        address sender;
        string text;
        uint256 timestamp;
    }

    uint256 public constant MAX_MESSAGE_LENGTH = 280;

    Message[] public messages;

    event MessageAdded(
        address indexed sender,
        string text,
        uint256 timestamp
    );

    /**
     * @notice Records a new guestbook message to the blockchain.
     * @param text The message string to store (1 - 280 characters).
     */
    function addMessage(string calldata text) external {
        uint256 length = bytes(text).length;
        require(length > 0, "Message cannot be empty");
        require(length <= MAX_MESSAGE_LENGTH, "Message exceeds maximum length");

        messages.push(Message({
            sender: msg.sender,
            text: text,
            timestamp: block.timestamp
        }));

        emit MessageAdded(msg.sender, text, block.timestamp);
    }

    /**
     * @notice Returns the total count of messages recorded.
     */
    function getMessageCount() external view returns (uint256) {
        return messages.length;
    }

    /**
     * @notice Returns a single message by index.
     * @param index Zero-based message index.
     */
    function getMessage(uint256 index) external view returns (
        address sender,
        string memory text,
        uint256 timestamp
    ) {
        Message storage m = messages[index];
        return (m.sender, m.text, m.timestamp);
    }

    /**
     * @notice Returns all messages stored in the guestbook.
     */
    function getAllMessages() external view returns (Message[] memory) {
        return messages;
    }
}
