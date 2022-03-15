// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

contract NextCoffee {
    event Log(address indexed sender, string method, uint256 ts);

    // index is partnership id
    string[] public partnerships;
    function getPartnerships() public view returns (string[] memory){
        return partnerships;
    }

    // flips between 1 and 2
    mapping(string => uint) private whoOwes;

    mapping(string => address[]) private registeredKeys;

    // eg. alec-bryson, 0xd7A3352b42526e89D882E4183ee2C4583ED87329, 0x830de16731c4AF8623de7Bbb26d40BfBfef450ee 
    // register the partnership
    function register(string memory partnership, address keyA, address keyB) public returns (uint) {        
        require(whoOwes[partnership] == 0, "partnership already exists");
        partnerships.push(partnership);
        whoOwes[partnership] = 1;
        registeredKeys[partnership] = [keyA, keyB];
        emit Log(msg.sender, "register", block.timestamp);
        return partnerships.length;
    }

    // eg. alec-bryson, 0xfaba8299b6e66df356c74fadea3611bfdfda95b97fa36c851f913cbe7b75e2dc, 27, 0xedfcb911574bf7b30659a4147c68bb9365e0739089094809012b0cee8d110e6d, 0x6fd71a970b1c39f138cf2ab0319995f77b6b138be766395e31999d0875d6af11
    // flipOwer - flip who owes next
    function flipOwer(string memory partnership, bytes32 _hashedMsg, uint8 _v, bytes32 _r, bytes32 _s) public {
        require(whoOwes[partnership] != 0, "partnership does not exist");

        bytes32 prefixedHashMessage = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _hashedMsg));
        address signer = ecrecover(prefixedHashMessage, _v, _r, _s);
        if (signer != registeredKeys[partnership][0] && signer != registeredKeys[partnership][1]) {
            require(true==false, "incorrect signature");
        }

        if (whoOwes[partnership] == 1) {
            whoOwes[partnership] = 2;
        } else {
            whoOwes[partnership] = 1;
        }
        emit Log(msg.sender, "flipOwer", block.timestamp);
    }

    function getWhoOwes(string memory partnership) public view returns (uint) {
        require(whoOwes[partnership] != 0, "partnership does not exist");
        return whoOwes[partnership];
    }

    function healthCheck() public pure returns(uint) {
        return 5;
    }
}

