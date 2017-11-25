import React, { Component } from "react";
import { Layer, Stage, Image } from "react-konva";
import Konva from "konva";
import Photo from "./Photo";
import axios from "axios";

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvasImages: []
    };
    this.uploadToCloudinary = this.uploadToCloudinary.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      canvasImages: nextProps.images //these are images URLs
    });
  }

  uploadFile(dataUrl) {
    //this function uploads image to cloudinary
    const cloudName = "noorulain";
    const cloudPreset = "pvfhdtk2";
    var url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    //construct a set of key/value pairs representing form fields and their values -- which can then be easily sent
    //with the request.
    const fd = new FormData();
    fd.append("upload_preset", cloudPreset);
    fd.append("file", dataUrl);
    return axios
      .post(url, fd, {
        headers: { "X-Requested-With": "XMLHttpRequest" }
      })
      .then(response => console.log(response.data.url));
  }

  uploadToCloudinary() {
    const image = this.stageRef.getStage().toDataURL("image/png");
    this.uploadFile(image);
  }

  //stage and layer are part of react-konva library. creates a canvas to use in react.
  render() {
    return (
      <div id="konva">
        <Stage
          width={1000}
          height={500}
          ref={node => {
            this.stageRef = node;
          }}
        >
          <Layer>
            {this.props.images &&
              this.props.images.map(imageUrl => {
                const image = new window.Image();
                image.crossOrigin = "Anonymous"; //causing async issues. //must use otherwise tained canvas error.
                image.src = imageUrl;
                return (
                  <Photo key={imageUrl} imageUrl={imageUrl} image={image} />
                );
              })}
          </Layer>
        </Stage>
        <button type="submit" onClick={this.uploadToCloudinary}>
          Submit Image!
        </button>
      </div>
    );
  }
}
