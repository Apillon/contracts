// SPDX-License-Identifier: MIT

pragma solidity 0.7.0;

import "./Ownable.sol";

/**
 * @dev This smart contracts stores root hashes of blocks and merkles trees calculated offchain. 
 */
contract Authtrail is Ownable {

  /**
   * @dev Mapping of addresses that are authorized to add anchors.
   */
  mapping (address => bool) public authorizedAddresses;

  /**
   * @dev Mapping of achors per application.
   */
  mapping(string => mapping (uint256 => string)) public anchors;

  /**
   * @dev Only authorized addresses can call a function with this modifier.
   */
  modifier onlyAuthorized() {
    require(authorizedAddresses[msg.sender], "Authtrail: not authorized");
    _;
  }

  /**
   * @dev Sets or revokes authorized address.
   * @param addr Address we are setting.
   * @param isAuthorized True is setting, false if we are revoking.
   */
  function setAuthorizedAddress(address addr, bool isAuthorized)
    external
    onlyOwner()
  {
    authorizedAddresses[addr] = isAuthorized;
  }

  /**
    * @dev Saves nev anchor information.
    * @param appId Identification of application for which we are creating the anchor.
    * @param height Height of the anchor data.
    * @param digest Digest of the anchor data.
    */
  function anchor(string calldata appId, uint256 height, string calldata digest)
    external
    onlyAuthorized()
  {
    require(bytes(anchors[appId][height]).length == 0, "Authtrail: anchor already exists");
    anchors[appId][height] = digest;
  }

}
