// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/// @title Faucet
/// @author Stella, Guillaume, Amine, Sarah from Hardfork Alyra
/// @notice You can use this contract to get 100 Token once every 3 days
/// @dev You can the Token of your chose and enter its address at deployment 

import "./Token.sol";

contract Faucet {

    Token private _token;
    string private _name;
    uint256 private _tokenAmount = 100000000000000000000 ;
    mapping (address => uint256) private _timeLapse;

    ///@param sender the address that gets the Tokens
    ///@param amount the amount of Token transfered : 100
    ///@param timeLapse the timestamp of an address' last purchase, overwise 0
    event Bought (address indexed sender, uint256 amount, uint256 timeLapse);

    ///@param name of the contract to test deployment
    event Deployed (string name);

    ///@notice determine the Token to be used and its details
    ///@param tokenAddress_ the address of the Token Contract
    ///@param name_ the name of the Token
    constructor(address tokenAddress_, string memory name_ ) {

        _token = Token(tokenAddress_);
        _name = name_;
        emit Deployed (_name);
    }

    ///@notice you must not have used this function for 3 days to be able to use it again
    ///@dev timeLapse equals 0 at first use and is reassigned each time. Reverts if last used less than 3 days before. Emits event Bought.
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

    ///@notice allows to get the allowance of Token for this contract
    function allowance () public view returns (uint256){
      return  _token.allowance(_token.owner(), address(this));
    }

    ///@notice allows to get the balance of the address that calls this function
    function balanceOf () public view returns (uint256) {
        return _token.balanceOf(msg.sender);
    }

    ///@notice gets the decimals to convert in Ether
    function decimals () public view returns (uint256){
       return _token.decimals();
    }
    
    ///@notice gets the name of the Token
    function name () public view returns (string memory){
       return _token.name();
    }
    
    ///@notice gets the address of the owner of the Token
    function owner () public view returns (address){
      return  _token.owner();
    }
    
    ///@notice gets the symbol of the Token
    function symbol () public view returns (string memory){
      return  _token.symbol();
    }

    ///@notice gets the initial supply of Token
    function totalSupply () public view returns (uint256){
        return _token.totalSupply();
    }
}
