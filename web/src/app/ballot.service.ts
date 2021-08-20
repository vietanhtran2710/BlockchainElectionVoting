import { Injectable } from '@angular/core';
import Web3 from 'web3'

declare let require: any;
declare let window: any;
const tokenAbi = require('../../../build/contracts/Ballot.json');

@Injectable({
  providedIn: 'root'
})
export class BallotService {
  private account: any = null;
  private readonly web3: any;
  private enable: any;

  constructor() { 
    if (window.ethereum === undefined) {
      alert('Non-Ethereum browser detected. Install MetaMask');
    } else {
      if (typeof window.web3 !== 'undefined') {
        this.web3 = window.web3.currentProvider;
      } else {
        this.web3 = new Web3.providers.HttpProvider('http://localhost:8545');
      }
      console.log('transfer.service :: constructor :: window.ethereum');
      window.web3 = new Web3(window.ethereum);
      console.log('transfer.service :: constructor :: this.web3');
      console.log(this.web3);
      this.enable = this.enableMetaMaskAccount();
    }
  }

  private async enableMetaMaskAccount(): Promise<any> {
    let enable = false;
    await new Promise((resolve, reject) => {
      enable = window.ethereum.enable();
    });
    return Promise.resolve(enable);
  }

  public async getAccount(): Promise<any> {
    console.log('transfer.service :: getAccount :: start');
    if (this.account == null) {
      this.account = await new Promise((resolve, reject) => {
        console.log('transfer.service :: getAccount :: eth');
        console.log(window.web3.eth);
        window.web3.eth.getAccounts((err, retAccount) => {
          console.log('transfer.service :: getAccount: retAccount');
          console.log(retAccount);
          if (retAccount.length > 0) {
            this.account = retAccount[0];
            resolve(this.account);
          } else {
            alert('transfer.service :: getAccount :: no accounts found.');
            reject('No accounts found.');
          }
          if (err != null) {
            alert('transfer.service :: getAccount :: error retrieving account');
            reject('Error retrieving account');
          }
        });
      }) as Promise<any>;
    }
    return Promise.resolve(this.account);
  }

  public async getUserBalance(): Promise<any> {
    const account = await this.getAccount();
    return new Promise((resolve, reject) => {
      window.web3.eth.getBalance(account, function(err, balance) {
        if (!err) {
          const retVal = {
            account: account,
            balance: balance
          };
          console.log(retVal);
          resolve(retVal);
        } else {
          reject({account: 'error', balance: 0});
        }
      });
    }) as Promise<any>;
  }

  getChairman(currentAccount) {
    const that = this;
    console.log('account: ', that.account);
    return new Promise((resolve, reject) => {
      console.log('transfer.service :: transferEther :: tokenAbi');
      console.log(tokenAbi);
      const contract = require('@truffle/contract');
      const ballotContract = contract(tokenAbi);
      ballotContract.setProvider(that.web3);
      console.log('transfer.service :: transferEther :: transferContract');
      console.log(ballotContract);
      ballotContract.deployed().then(function(instance) {
        return instance.getChairPerson(
          0,
          {from: currentAccount}
        );
      }).then(function(result) {
        console.log(result);
        return resolve(result);
      }).catch(function(error) {
        alert("Transaction reverted");
        console.log(error);
        return reject('transfer.service error');
      });
    });
  }
}
