import React, { Component } from "react";
import Blocks from '../../abis/Blocks';
const Web3 = require("web3");
const { create } = require("ipfs-http-client");

const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    //this.uploadFile
    //this.captureFile
  }

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Non-Ethereum browser detected");
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const networkId = await web3.eth.net.getId();
    const networkData = Blocks.networks[networkId];
    if (networkData) {
      const blocks = new web3.eth.Contract(Blocks.abi, networkData.address);
      this.setState({ blocks });
      const filesCount = await blocks.methods.fileCount().call();
      this.setState({ filesCount });
      for (let i = filesCount; i >= 1; i--) {
        const file = await blocks.methods.files(i).call();
        this.setState({
          files: [...this.state.files, file],
        });
      }
    } else {
      window.alert("DStorage contract not deployed to detected network");
    }
  }

  render() {
    return (
      <div>
        <h1>Filler text here</h1>
      </div>
    );
  }
}
