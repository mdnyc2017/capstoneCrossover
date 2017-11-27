import React, { Component } from "react";
import Dropzone from "react-dropzone";

import superagent from "superagent";
import { db } from "../fire";
import { Redirect } from "react-router";
import Canvas from "./Canvas";

export default class AddScene extends Component {
  constructor(props) {
    super();
    this.state = {
      storyId: "",
      imageUrl: "",
      previewUrl: "",
      lineStrength: 20,
      colorReduction: 50,
      id: "",
      user: {},
      canvasImages: []
    };
    this.handleSubmitPreview = this.handleSubmitPreview.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAddOverlay = this.handleAddOverlay.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      user: nextProps.currentUser,
      storyId: this.props.match.params.id
    });
  }

  uploadFile(files) {
    const image = files[0];

    const url = "http://localhost:5001/crossover-cf663/us-central1/helloWorld"; //cloud func location

    let uploadRequest = superagent.post(url);
    uploadRequest.attach("file", image);

    uploadRequest.end((err, resp) => {
      //'end' sends the request to the firebase function which is the backend -- located in index.js
      if (err) {
        return;
      }
      const uploadUrl = JSON.parse(resp.body.text).url;
      const ind = uploadUrl.indexOf("upload/");
      const newUrl = `${uploadUrl.slice(0, ind + 7)}w_500/e_cartoonify:${
        this.state.lineStrength
      }:${this.state.colorReduction}${uploadUrl.slice(ind + 7)}`;
      this.setState({
        imageUrl: uploadUrl,
        previewUrl: newUrl
      });
    });
  }

  //delay in loading image in chrome and firefox but not in safari
  handleSubmitPreview(evt) {
    evt.preventDefault();
    let self = this;
    setTimeout(() => {
      self.setState({
        canvasImages: [...self.state.canvasImages, self.state.previewUrl]
      });
    }, 10);
  }

  handleAddOverlay(image) {
    let self = this;
    setTimeout(() => {
      self.setState({
        canvasImages: [...self.state.canvasImages, image]
      });
    }, 10);
  }

  handleChange(evt) {
    // evt.preventDefault();
    const url = this.state.imageUrl;
    const ind = url.indexOf("upload/");
    this.setState({
      [evt.target.name]: evt.target.value,
      previewUrl: `${url.slice(0, ind + 7)}w_500/e_cartoonify:${
        this.state.lineStrength
      }:${this.state.colorReduction}${url.slice(ind + 7)}`
    });
  }

  render() {
    const image = this.state.previewUrl; //If there is a previewUrl we will render it below and supply a form to edit degree of cartoonify effect

    return (
      <div>
        <div>
          <h1>Image goes here!</h1>
          <Dropzone onDrop={this.uploadFile.bind(this)} />
        </div>
        <div>
          <img src={image} />
        </div>
        {image ? (
          <div>
            <form onSubmit={this.handleSubmitPreview}>
              <input
                className="form-field"
                type="number"
                min="0"
                max="100"
                value={this.state.lineStrength}
                name="lineStrength"
                onChange={this.handleChange}
              />
              <input
                className="form-field"
                type="number"
                min="0"
                max="100"
                value={this.state.colorReduction}
                name="colorReduction"
                onChange={this.handleChange}
              />
              <button type="submit">Add to Canvas</button>
            </form>
          </div>
        ) : (
          <span />
        )}
        <Canvas
          images={this.state.canvasImages}
          currentUser={this.state.user}
          storyId={this.state.storyId}
        />
        <div className="overlay-options">
          <img
            src="/captionbox.png"
            onClick={() => this.handleAddOverlay("/captionbox.png")}
            width="100px"
          />
          <img
            src="/quote1.png"
            onClick={() => this.handleAddOverlay("/quote1.png")}
            width="100px"
          />
          <img
            src="/quote2.png"
            onClick={() => this.handleAddOverlay("/quote2.png")}
            width="100px"
          />
          <img
            src="/quote3.png"
            onClick={() => this.handleAddOverlay("/quote3.png")}
            width="100px"
          />
          <img
            src="/quote4.png"
            onClick={() => this.handleAddOverlay("/quote4.png")}
            width="100px"
          />
          <img
            src="/quote5.png"
            onClick={() => this.handleAddOverlay("/quote5.png")}
            width="100px"
          />
          <img
            src="/quote6.png"
            onClick={() => this.handleAddOverlay("/quote6.png")}
            width="100px"
          />
          <img
            src="/quote7.png"
            onClick={() => this.handleAddOverlay("/quote7.png")}
            width="100px"
          />
          <img
            src="/quote8.png"
            onClick={() => this.handleAddOverlay("/quote8.png")}
            width="100px"
          />
          <img
            src="/quote9.png"
            onClick={() => this.handleAddOverlay("/quote9.png")}
            width="100px"
          />
          <img
            src="/quote10.png"
            onClick={() => this.handleAddOverlay("/quote10.png")}
            width="100px"
          />
          <img
            src="/quote11.png"
            onClick={() => this.handleAddOverlay("/quote11.png")}
            width="100px"
          />
        </div>
      </div>
    );
  }
}
