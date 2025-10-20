import { Web3 } from 'web3';
import fs from 'fs';
import path from 'path';

// Set up a connection to the Ethereum network
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8551'));
web3.eth.Contract.handleRevert = true;

async function interact() {
	//fetch all the available accounts
	const accounts = await web3.eth.getAccounts();
	console.log(accounts);

	let balance1, balance2;
	//The initial balances of the accounts should be 100 Eth (10^18 wei)
	balance1 = await web3.eth.getBalance(accounts[0]);
	balance2 = await web3.eth.getBalance(accounts[1]);

	console.log(balance1, balance2);

	//create a transaction sending 1 Ether from account 0 to account 1
	const transaction = {
		from: accounts[0],
		to: accounts[1],
		// value should be passed in wei. For easier use and to avoid mistakes,
		//	we utilize the auxiliary `toWei` function:
		value: web3.utils.toWei('1', 'ether'),
	};
	// see the updated balances
	console.log(balance1, balance2);

	// irrelevant with the actual transaction, just to know the gasPrice
	const gasPrice = await web3.eth.getGasPrice();
	console.log(gasPrice);
}

(async () => {
	await interact();
})();
