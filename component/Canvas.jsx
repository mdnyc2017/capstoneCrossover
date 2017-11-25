import React, { Component } from "react";
import { Layer, Stage, Image } from "react-konva";
import Konva from "konva";
import Photo from "./Photo";
import axios from "axios";
import { db } from "../fire";

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvasImages: [],
      canvasUrl: "",
      user: {},
      storyId: ""
    };
    this.uploadToCloudinary = this.uploadToCloudinary.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      canvasImages: nextProps.images, //these are images URLs
      user: nextProps.currentUser,
      storyId: nextProps.storyId
    });
  }

  uploadFile(dataUrl) {
    const user = this.state.user;
    const key = `${user.user.uid}${Date.now()}`;
    const storyId = this.state.storyId;
    const imageUrl = this.state.canvasUrl;
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
      .then(response =>
        this.setState({
          canvasUrl: response.data.url
        })
      )
      .then(() =>
        db
          .collection("scenes")
          .doc(key)
          .set({ imageUrl: this.state.canvasUrl })
      )
      .then(() =>
        db
          .collection("stories")
          .doc(storyId)
          .collection("scenes")
          .doc(key)
          .set({ imageUrl: this.state.canvasUrl, id: key, random: "check" })
      )
      .then(() =>
        db
          .collection("stories")
          .doc(storyId)
          .update({ thumbnail: this.state.canvasUrl })
      )
      .catch(error => console.error("Error creating scene: ", error));
  }

  uploadToCloudinary() {
    const image = this.stageRef.getStage().toDataURL("image/png");
    this.uploadFile(image);
  }

  //stage and layer are part of react-konva library. creates a canvas to use in react.
  render() {
    // console.log(
    //   "from render",
    //   this.state.currentUser,
    //   this.state.storyId,
    //   this.props
    // );
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

// db.collection('scenes').doc(key).set({
//     imageUrl
// })
// .then(() => db.collection('stories').doc(storyId).collection('scenes').doc(key).set({
//         imageUrl,
//         id: key
//     })
// )
// .then(() => db.collection('stories').doc(storyId).update({thumbnail: imageUrl}))
// .then(() => this.setState({fireRedirect: true, id: key}))
// .catch((error) => console.error('Error creating scene: ', error));

// db
// .collection("scenes")
// .doc(key)
// .set({ imageUrl })
// .then(() =>
//   db
//     .collection("stories")
//     .doc(storyId)
//     .collection("scenes")
//     .doc(key)
//     .set({
//       imageUrl,
//       id: key,
//       random: "check"
//     })
// )
// .then(() =>
//   db
//     .collection("stories")
//     .doc(storyId)
//     .update({ thumbnail: imageUrl })
// )
// .catch(error => console.error("Error creating scene: ", error));
