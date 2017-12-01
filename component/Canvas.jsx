import React, { Component } from "react";
import { Layer, Stage, Image, Rect } from "react-konva";
import Konva from "konva";
import Photo from "./Photo";
import TextField from "./TextField";
import superagent from "superagent";
import { db } from "../fire";
import { Redirect } from "react-router";
import axios from "axios";

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvasUrl: "",
      background: "#ffffff",
      fireRedirect: false
    };
    this.uploadToCloudinary = this.uploadToCloudinary.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  uploadFile(dataUrl) {
    const user = this.props.currentUser;
    const key = `${user.uid}${Date.now()}`;
    const storyId = this.props.storyId;
    const cloudName = "noorulain";
    const preset = "pvfhdtk2";
    //const url = "https://us-central1-crossover-cf663.cloudfunctions.net/uploadCanvas";
    const url =
      "https://api.cloudinary.com/v1_1/" + cloudName + "/image/upload";

    const fd = new FormData();
    fd.append("upload_preset", preset);
    fd.append("api_key", "493184569883823");
    fd.append("file", dataUrl);

    return axios
      .post(url, fd, {
        headers: { "x-requested-with": "XMLHttpRequest" }
      })
      .then(response => {
        this.setState({
          canvasUrl: response.data.secure_url
        });
      })
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
      .then(() => this.setState({ fireRedirect: true }))
      .catch(error => console.error("Error creating scene: ", error));
  }

  uploadToCloudinary() {
    let confirmation = confirm("Are you sure you're ready to add your scene?");
    const image = this.stageRef.getStage().toDataURL("image/png");
    if (confirmation) {
      this.uploadFile(image);
    }
  }

  render() {
    const { fireRedirect } = this.state;
    return (
      <div>
        <button
          className="canvas-button"
          type="submit"
          onClick={this.uploadToCloudinary}
        >
          + Add Scene to Story
        </button>
        <Stage
          width={900}
          height={450}
          className={this.state.background}
          ref={node => {
            this.stageRef = node;
          }}
        >
          <Layer>
            <Rect
              width={950}
              height={450}
              zindex={-1}
              fill={this.props.background}
            />
            {this.props.images &&
              this.props.images.map((imageUrl, index) => {
                const image = new window.Image();
                const arrIndex = index;
                image.crossOrigin = "Anonymous"; //causing async issues. //must use otherwise tainted canvas error.
                image.src = imageUrl;
                return (
                  <Photo
                    key={`${image.src}${arrIndex}`}
                    imageUrl={image.src}
                    image={image}
                    zindex={index}
                  />
                );
              })}
            {this.props.text &&
              this.props.text.map((text, index) => {
                const arrIndex = index;
                return <TextField key={`${text}${arrIndex}`} text={text} />;
              })}
          </Layer>
        </Stage>
        {fireRedirect && <Redirect to={`/stories/${this.props.storyId}`} />}
      </div>
    );
  }
}
