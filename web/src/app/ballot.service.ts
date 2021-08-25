import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
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
      Swal.fire({
        icon: 'error',
        title: 'Non-ethereum browser detected',
        text: 'Install Metamask',
        footer: '<a href="">Why do I have this issue?</a>'
      })
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
            Swal.fire({
              icon: 'error',
              title: 'No account found',
              text: 'Try to connect to Metamask first',
              footer: '<a href="">Why do I have this issue?</a>'
            })
            reject('No accounts found.');
          }
          if (err != null) {
            Swal.fire({
              icon: 'error',
              title: 'Error retriving account',
              text: 'Please try again later',
              footer: '<a href="">Why do I have this issue?</a>'
            })
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
    return new Promise((resolve, reject) => {
      const contract = require('@truffle/contract');
      const ballotContract = contract(tokenAbi);
      ballotContract.setProvider(that.web3);
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

  register(address, currentAccount) {
    const that = this;
    return new Promise((resolve, reject) => {
      const contract = require('@truffle/contract');
      const ballotContract = contract(tokenAbi);
      ballotContract.setProvider(that.web3);
      ballotContract.deployed().then(function(instance) {
        return instance.register(
          address,
          {from: currentAccount}
        );
      }).then(function(result) {
        console.log(result);
        if (result.receipt.status)
          return resolve({status: true});
      }).catch(function(error) {
        Swal.fire({
          icon: 'error',
          title: 'Transaction reverted!',
          text: 'Account already registered',
          footer: '<a href="">Why do I have this issue?</a>'
        })
        console.log(error);
        return reject('transfer.service error');
      });
    });
  }

  getVoteResult(currentAccount) {
    const that = this;
    return new Promise((resolve, reject) => {
      const contract = require('@truffle/contract');
      const ballotContract = contract(tokenAbi);
      ballotContract.setProvider(that.web3);
      ballotContract.deployed().then(function(instance) {
        return instance.getVoteCount(
          0,
          {from: currentAccount}
        );
      }).then(function(result) {
          return resolve(result);
      }).catch(function(error) {
        Swal.fire({
          icon: 'error',
          title: 'Transaction reverted!',
          text: 'Cannot get vote result, please try later',
          footer: '<a href="">Why do I have this issue?</a>'
        })
        console.log(error);
        return reject('transfer.service error');
      });
    });
  }

  vote(index, currentAccount) {
    const that = this;
    return new Promise((resolve, reject) => {
      const contract = require('@truffle/contract');
      const ballotContract = contract(tokenAbi);
      ballotContract.setProvider(that.web3);
      ballotContract.deployed().then(function(instance) {
        return instance.vote(
          index,
          {from: currentAccount}
        );
      }).then(function(result) {
          console.log(result);
          if (result.receipt.status)
            return resolve({status: true});
      }).catch(function(error) {
        Swal.fire({
          icon: 'error',
          title: 'Transaction reverted!',
          text: 'Requirements not satisfied to vote',
          footer: '<a href="">Why do I have this issue?</a>'
        })
        console.log(error);
        return reject('transfer.service error');
      });
    });
  }
}
