import React, { Component } from 'react';
import { Layer, Stage, Image, Rect } from 'react-konva';
import Konva from 'konva';
import Photo from './Photo';
import TextField from './TextField';
import axios from 'axios';
import { db } from '../fire';
import { Redirect } from 'react-router';

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvasImages: [],
      canvasText: [],
      canvasUrl: '',
      user: {},
      storyId: '',
      background: '#ffffff',
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

  // componentWillReceiveProps(nextProps) {
  //   let imageUrl = nextProps.images[nextProps.images.length]
  //   const img = new window.Image();
  //   img.crossOrigin = "Anonymous";
  //   img.onload = () =>
  //       this.setState({
  //         canvasImages: [...this.state.canvasImages, img]
  //       });
  //   img.src = imageUrl;
  //   this.setState({
  //     user: nextProps.currentUser,
  //     storyId: nextProps.storyId
  //   });
  // }

  uploadFile(dataUrl) {
    const user = this.state.user;
    const key = `${user.user.uid}${Date.now()}`;
    const storyId = this.state.storyId;
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
      .then(() => this.setState({ fireRedirect: true }))
      .catch(error => console.error("Error creating scene: ", error));
  }

  uploadToCloudinary() {
    const image = this.stageRef.getStage().toDataURL("image/png");
    this.uploadFile(image);
  }

  render() {
    const { fireRedirect } = this.state;
    return (
      <div>
        <Stage
          width={1000}
          height={500}
          className={this.state.background}
          ref={node => {
            this.stageRef = node;
          }}
        >
          <Layer>
            <Rect
              width={1000}
              height={500}
              zindex={-1}
              fill={this.props.background} />
            {this.state.canvasImages &&
              this.state.canvasImages.map((imageUrl, index) => {
                const image = new window.Image();
                const arrIndex = index;
                image.crossOrigin = "Anonymous"; //causing async issues. //must use otherwise tainted canvas error.
                image.src = imageUrl;
                return (<Photo
                  key={`${image.src}${arrIndex}`}
                  imageUrl={image.src}
                  image={image}
                  zindex={index}
                   />)
            })}
            {this.state.canvasText &&
              this.state.canvasText.map((text, index) => {
                const arrIndex = index;
                return (<TextField
                  key={`${text}${arrIndex}`}
                  text={text}
                   />)
            })}
          </Layer>
        </Stage>
        <button type="submit" onClick={this.uploadToCloudinary}>
          Submit Image!
        </button>
        {fireRedirect && <Redirect to={`/stories/${this.state.storyId}`} />}
      </div>
    );
  }
}

