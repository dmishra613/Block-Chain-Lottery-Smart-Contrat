const HDWalletProvider=require('@truffle/hdwallet-provider');
const Web3=require('Web3');
const {interface,bytecode}=require('./compile');
//HDWallet Provider require account numenoics and Infura endpoint
const provider=
new HDWalletProvider('decrease horn culture absorb donor address chunk start deliver undo remain club',
'https://rinkeby.infura.io/v3/19308820742542f68f24737d4b207635');
const web3=new Web3(provider);

const deploy=async()=>
{
  const accounts=await web3.eth.getAccounts();
  console.log('Attempting to deploy from account',accounts[0]);
  const result=await new web3.eth.Contract(JSON.parse(interface))
  .deploy({data:bytecode})
  .send({from:accounts[0],gas:'1000000'});
  console.log('Contract deployed to',result.options.address);
};
deploy();