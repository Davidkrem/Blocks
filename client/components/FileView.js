import React, { Component, useCallback } from "react";
import Blocks from "../../abis/Blocks.json"; //remove?
import StyledDropzone from "./Drag&Drop"; // remove?
import { loadWeb3, loadBlockchainData } from "../store/blockchain";
import Share from "./SharePopUp";
const Web3 = require("web3");
const { create } = require("ipfs-http-client");

const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

export default class FileView extends Component {
  constructor() {
    super();
    this.state = {
      id: 0,
      blocks: null,
      fileCount: 0,
      userFiles: [],
      seen: false,
      selected: null
    };

    this.handleClick = this.handleClick.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
  }

  async componentDidMount() {
    await loadWeb3();
    let bcData = await loadBlockchainData();
    let userId = this.props.userId;
    this.setState({ id: userId, blocks: bcData.contract });
    await this.getUserData(userId);
    await this.getUserFiles(userId);
  }

  getUserData = async (userId) => {
    console.log("Retrieving user information from Blockchain");

    let user = await this.state.blocks.methods.getUser(userId).call();

    if (parseInt(user.fileCount) > 0) {
      this.setState({ fileCount: parseInt(user.fileCount) });
    }
  };

  getUserFiles = async (userId) => {
    let files = [];

    console.log("Retrieving user files from Blockchain");

    for (let i = 1; i <= this.state.fileCount; i++) {
      let file = await this.state.blocks.methods.getUserFile(userId, i).call();
      if (file.fileHash.length > 0) {
        files.push(file);
      }
    }

    this.setState({ userFiles: files });
  };

  handleClick(event, num){
    const name = event.target.name;
    console.log(name, num);
    if (name === 'share'){
      this.setState({
        selected: num
      })
      this.togglePopup();
    }
  }

  togglePopup(){
    this.setState({
      seen: !this.state.seen
    })
  }

  render() {
    
    const seen = false;
    
    return (
      <div className="fileView-flex">
        {this.state.seen ? <div id='opaque' style={{display: 'block'}}></div> : <div id='opaque' style={{display: 'none'}}></div>}
          <h3 id="heading">Uploaded Files</h3>
          <table className="fileTable">
            <thead>
              <tr>
                <th>File</th>
                <th>CID</th>
                <th>Type</th>
                <th>Encryption Key</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              {this.state.userFiles.map((file) => (
                <tr key={file.fileNumber}>
                  <td>{file.description}</td>
                  <td>
                    <a
                      href={"https://ipfs.io/ipfs/" + `${file.fileHash}`}
                      target="_blank"
                    >
                      {file.fileHash}
                    </a>
                  </td>
                  <td>{file.type}</td>
                  <td>File Encryption</td>
                  <td>
                    <button className="share_button" name='share' onClick={(event, num = file.fileNumber) => this.handleClick(event, num)}>Share</button>
                    <Share seen={this.state.seen} fileSeen={file.fileNumber} fileSelected={this.state.selected} toggle={this.togglePopup} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    );
  }
}
