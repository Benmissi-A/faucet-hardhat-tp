// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Token.sol";
//import "@openzeppelin/contracts/utils/Address.sol";

contract Faucet {

    Token private _token;
    string private _name;
    uint256 private _tokenAmount = 100000000000000000000 ;
    mapping (address => uint256) private _timeLapse;

    event Bought (address indexed sender, uint256 amount, uint256 timeLapse);
    event Deployed (string name);


    constructor(address tokenAddress_, string memory name_ ) {

        _token = Token(tokenAddress_);
        _name = name_;
        emit Deployed (_name);
    }

    function sendToken () public {
        if(_timeLapse[msg.sender] == 0) {
            _timeLapse[msg.sender] = block.timestamp;
        }else{
            require(block.timestamp > (_timeLapse[msg.sender] + 3 days) , "Faucet: await 3 days");
            _timeLapse[msg.sender] = block.timestamp;
        }
        _token.transferFrom(_token.owner(), msg.sender, _tokenAmount);
        emit Bought (msg.sender, _tokenAmount , _timeLapse[msg.sender]);
    }

    function allowance () public view returns (uint256){
      return  _token.allowance(_token.owner(), address(this));
    }

    function balanceOf () public view returns (uint256) {
        return _token.balanceOf(msg.sender);
    }

    function decimals () public view returns (uint256){
       return _token.decimals();
    }
    
    function name () public view returns (string memory){
       return _token.name();
    }
    
    function owner () public view returns (address){
      return  _token.owner();
    }
    
    function symbol () public view returns (string memory){
      return  _token.symbol();
    }

    function totalSupply () public view returns (uint256){
        return _token.totalSupply();
    }
}
