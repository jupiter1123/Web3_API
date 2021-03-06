import React, { useEffect } from "react";
import Web3 from "web3";
// import Tx from "ethereumjs-tx";
import "./App.css";

import mainAbi from "./abis/mainAbi.json";

const tokenAddress = "0x7f56619e1faaf6c06b96225e6c8c737f0bbc91c5";

const mainAddress = "0x83698950B13d0B8B1eAF37D6f0f584E6D71D4964";

const accountPublicKey = "565b5dd34138dd49e5d3c2a43fc700ceeceab5d9"; //Your account address
const privateKey =
  "ff73526d70ce29f3f90fc19f61e36bd534dd1d149225cdc1330c43bf1e430fb3"; //private key

function App() {
  const [isProgress, setProgress] = React.useState(false);

  const [contract, setContract] = React.useState(null);

  const [web3, setWeb3] = React.useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();

        setContract(new web3.eth.Contract(mainAbi, mainAddress));
        setWeb3(web3);
        return true;
      } else if (window.web3) {
        const web3 = new Web3(window.web3.currentProvider);

        setContract(new web3.eth.Contract(mainAbi, mainAddress));
        setWeb3(web3);
        return true;
      } else {
        window.alert(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
        return false;
      }
    };

    fetchData();
  }, [window.ethereum]);

  const automateDeposit = async () => {
    setProgress(true);
    approve().then((data) => {
      deposit().then((data) => {
        setProgress(false);
      });
    });
  };

  const withdraw = () => {
    var withdraw = contract.methods.withdraw(accountPublicKey, 1000);
      var encodedABI = withdraw.encodeABI();

      var tx = {
        from: accountPublicKey,
        to: mainAddress,
        gas: 2000000,
        data: encodedABI,
      };

      web3.eth.accounts.signTransaction(tx, privateKey).then((signed) => {
        var tran = web3.eth.sendSignedTransaction(signed.rawTransaction);

        tran.on("transactionHash", (hash) => {
          console.log("hash");
          console.log(hash);
        });

        tran.on("receipt", (receipt) => {
          console.log("reciept");
        });

        tran.on("error", console.log);
      });
  }

  const approve = () => {
    return new Promise((resolve) => {
      var approve = contract.methods.sweep(tokenAddress);
      var encodedABI = approve.encodeABI();

      var tx = {
        from: accountPublicKey,
        to: mainAddress,
        gas: 2000000,
        data: encodedABI,
      };

      web3.eth.accounts.signTransaction(tx, privateKey).then((signed) => {
        var tran = web3.eth.sendSignedTransaction(signed.rawTransaction);

        tran.on("transactionHash", (hash) => {
          console.log("hash");
          console.log(hash);
        });

        tran.on("receipt", (receipt) => {
          console.log("reciept");
          resolve(receipt);
        });

        tran.on("error", (err) => resolve(err));
      });
    });
  };

  const deposit = () => {
    return new Promise((resolve) => {
      var approve = contract.methods.deposit(1000);
      var encodedABI = approve.encodeABI();

      var tx = {
        from: accountPublicKey,
        to: mainAddress,
        gas: 2000000,
        data: encodedABI,
      };

      web3.eth.accounts.signTransaction(tx, privateKey).then((signed) => {
        var tran = web3.eth.sendSignedTransaction(signed.rawTransaction);

        tran.on("transactionHash", (hash) => {
          console.log("hash");
          console.log(hash);
        });

        tran.on("receipt", (receipt) => {
          console.log("reciept");
          resolve(receipt);
        });

        tran.on("error", (err) => resolve(err));
      });
    });
  };

  return (
    <div className="App">
      <button disabled={isProgress} onClick={automateDeposit}>
        Deposit
      </button>
      <button onClick={withdraw}>Withdraw</button>
    </div>
  );
}

export default App;
