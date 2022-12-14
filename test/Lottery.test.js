const assert=require('assert');
const ganache=require('ganache-cli');
const Web3=require('Web3');
const web3=new Web3(ganache.provider());

const {interface,bytecode}=require('../compile');

let accounts;
let lottery;

beforeEach(async()=>{
//Get a list of accounts....
//All every method for web3 is asynchronus in nature
accounts=await web3.eth.getAccounts();
//Use one of those accounts to deploy
//the contract
lottery=await new web3.eth.Contract(JSON.parse(interface))
.deploy({data:bytecode})
.send({from:accounts[0],gas:'1000000'})
//inbox javascript object of smart contract and instance of a contract.
});

describe('Lottery Contract',()=>{
it('deploys a contract',()=>{
    assert.ok(lottery.options.address);
});

it('allows one account to enter',async()=>{
await lottery.methods.enter().send({
    from:accounts[0],
    value:web3.utils.toWei('0.02','ether')
});
const players=await lottery.methods.getPlayers().call({
    from:accounts[0]
});
assert.equal(accounts[0],players[0]);
assert.equal(1,players.length);
});

it('allows multiple account to enter',async()=>{
    await lottery.methods.enter().send({
        from:accounts[0],
        value:web3.utils.toWei('0.02','ether')
    });
    await lottery.methods.enter().send({
        from:accounts[1],
        value:web3.utils.toWei('0.02','ether')
    });

    await lottery.methods.enter().send({
        from:accounts[2],
        value:web3.utils.toWei('0.02','ether')
    });
    const players=await lottery.methods.getPlayers().call({
        from:accounts[0]
    });
    assert.equal(accounts[0],players[0]);
    assert.equal(accounts[1],players[1]);
    assert.equal(accounts[2],players[2]);
    assert.equal(3,players.length);
    });

it('it requires a minimum amount of ether to enter',async()=>{
    try
    {    
        await lottery.methods.enter().send({
            from:accounts[0],
            value:0
        });
        assert(false);
    }
    catch(err)
    {
       assert(err);
    }
});

it('only manager can pick winner',async()=>
{
    try
    {
        await lottery.methods.pickWinner().send({from:accounts[1]});
        assert(false);
    }
    catch(err)
    {
        assert(err);
    }
});

it('sends money to the winner and resets the player array',async()=>{
    await lottery.methods.enter().send({
        from:accounts[0],
        value:web3.utils.toWei('2','ether')
    });
    const initialBal=await web3.eth.getBalance(accounts[0]);
    
    await lottery.methods.pickWinner().send({from:accounts[0]});
    const finalBal=await web3.eth.getBalance(accounts[0]);

    const diff=finalBal-initialBal;

    assert(diff>web3.utils.toWei('1.8','ether'));
})
});