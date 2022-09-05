pragma solidity ^0.4.17;
contract Lottery
{
    address public manager;
    address[] public players;
    function Lottery() public 
    {
       //provide the owner of the contract
       manager=msg.sender;
    }
    function enter() public payable
    {
       require(msg.value>0.01 ether);
       //Every player have to call enter method to join this Lotery
       players.push(msg.sender);
    } 
    function random() private  view returns(uint)
    {
        //pick players randomly with block difficulty
        return uint(keccak256(block.difficulty,now,players));
    }
    function pickWinner()  public restricted{
        //code below get excuted only if the pick winner called manager.
        require(manager==msg.sender);
        uint index=random() % players.length;
        players[index].transfer(this.balance);
        players=new address[](0);
    }
    //modifier is used to reduce the amount of repetitive code
    //it solves dry problem
    modifier restricted()
    {
        require(manager==msg.sender);
        _;
    }
    //Return Players
    function getPlayers() public view returns(address[])
    {
        return  players;
    }
}