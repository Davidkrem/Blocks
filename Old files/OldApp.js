import React, { Component } from "react";
import Blocks from "../../abis/Blocks";
import StyledDropzone from "./Drag&Drop";
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
    this.state = {
      account: "",
      blocks: null,
      files: [],
      loading: false,
      type: null,
      name: null,
      description: "",
      user: "",
    };
    //this.uploadFile
    this.captureFile = this.captureFile.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.eth_requestAccounts;
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
      // const user = await blocks.methods.getUser(1).call();
      // this.setState({ user: user });
      // console.log(user); // const filesCount = await blocks.methods.fileCount().call();
      // this.setState({ filesCount });
      // for (let i = filesCount; i >= 1; i--) {
      //   const file = await blocks.methods.files(i).call();
      //   this.setState({
      //     files: [...this.state.files, file],
      //   });
      // }
    } else {
      window.alert("Blocks contract not deployed to detected network");
    }
  }

  handleChange = (evt) => {
    const target = evt.target.value;
    this.setState({ description: target });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    // const description = this.fileDescription.value;
    const description = this.state.description;
    this.uploadFile(description);
  };

  captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();

    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({
        buffer: Buffer(reader.result),
        type: file.type,
        name: file.name,
      });
      // console.log("buffer", this.state);
    };
    // console.log(event);
  };

  uploadFile = async (description) => {
    // console.log("Submitting file to IPFS...");
    // const result = await ipfs.add(this.state.buffer);
    // console.info(result);

    // console.log(this.state);

    // ipfs.add(this.state.buffer, (error, result) => {
    //   console.log("IPFS result", result.size);
    //   if (error) {
    //     console.error(error);
    //     return;
    //   }

    // this.setState({ loading: true });

    //   if (this.state.type === "") {
    //     this.setState({ type: "none" });
    //   }

    // .send({ from: this.state.account });
    // .on("transactionHash", (hash) => {
    //   this.setState({
    //     loading: false,
    //   });

    // const id = bytes32(uint256(1));
    await this.state.blocks.methods.newUser(1, "testName");
    const user = await this.state.blocks.methods.getUser(1);
    console.log("USER:", user);

    // window.location.reload();
    // })
    // .on("error", (e) => {
    //   window.alert("Error!");
    //   this.setState({ loading: false });
    // });
    console.log("success?");

    // this.state.blocks.methods

    //   this.state.blocks.methods
    //     .uploadFile(
    //       result[0].hash,
    //       result[0].size,
    //       this.state.type,
    //       this.state.name,
    //       description
    //     )
    //     .send({ from: this.state.account })
    //     .on("transactionHash", (hash) => {
    //       this.setState({
    //         loading: false,
    //         type: null,
    //         name: null,
    //       });

    //       window.location.reload();
    //     })
    //     .on("error", (e) => {
    //       window.alert("Error");
    //       this.setState({ loading: false });
    //     });
    // });
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <StyledDropzone />
          <label>
            Name:
            <input type="file" onChange={this.captureFile} />
          </label>
          <input type="text" onChange={this.handleChange} />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}
