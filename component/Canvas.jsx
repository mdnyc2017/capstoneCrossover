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
      canvasImages: [],
      canvasText: [],
      canvasUrl: "",
      user: {},
      storyId: "",
      background: "#ffffff",
      fireRedirect: false
    };
    this.uploadToCloudinary = this.uploadToCloudinary.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      canvasText: nextProps.text,
      canvasImages: nextProps.images, //these are images URLs
      user: nextProps.currentUser,
      storyId: nextProps.storyId
    });
  }

  uploadFile(dataUrl) {
    const user = this.state.user;
    const key = `${user.uid}${Date.now()}`;
    const storyId = this.state.storyId;

    const url =
      "http://localhost:5001/crossover-cf663/us-central1/uploadCanvas";

    //construct a set of key/value pairs representing form fields and their values -- which can then be easily sent
    //with the request.
    const fd = new FormData();
    fd.append("file", dataUrl);

    return axios
      .post(url, fd, {
        headers: { "X-Requested-With": "XMLHttpRequest" }
      })
      .then(response => {
        console.log(response);
        this.setState({
          canvasUrl: response.data
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
    let confirmation = confirm("Are you sure you're ready to add your scene?")
    const image = this.stageRef.getStage().toDataURL("image/png");
    if (confirmation) {
      this.uploadFile(image);
    }
  }

  render() {
    const { fireRedirect } = this.state;
    return (
      <div>
        <button className="canvas-button" type="submit" onClick={this.uploadToCloudinary}>
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
            {this.state.canvasImages &&
              this.state.canvasImages.map((imageUrl, index) => {
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
            {this.state.canvasText &&
              this.state.canvasText.map((text, index) => {
                const arrIndex = index;
                return <TextField key={`${text}${arrIndex}`} text={text} />;
              })}
          </Layer>
        </Stage>
        {fireRedirect && <Redirect to={`/stories/${this.state.storyId}`} />}
      </div>
    );
  }
}
