import React, { Component } from 'react';
import { Layer, Stage, Image } from 'react-konva';
import Konva from 'konva';
import Photo from './Photo';
import axios from 'axios';
import { db } from '../fire';
import { Redirect } from 'react-router';

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvasImages: [],
      canvasUrl: '',
      user: {},
      storyId: '',
      background: 'canvas-white',
      fireRedirect: false
    }
    this.uploadToCloudinary = this.uploadToCloudinary.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.changeBackgroundColor = this.changeBackgroundColor.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      canvasImages: nextProps.images, //these are images URLs
      user: nextProps.currentUser,
      storyId: nextProps.storyId
    });
  }

  changeBackgroundColor(e) {
    this.setState({background: e.target.value})
  }

  uploadFile(dataUrl) {
    const user = this.state.user;
    const key = `${user.user.uid}${Date.now()}`;
    const storyId = this.state.storyId;
    // const imageUrl = this.state.canvasUrl;
    //this function uploads image to cloudinary
    const cloudName = 'noorulain';
    const cloudPreset = 'pvfhdtk2';
    var url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    //construct a set of key/value pairs representing form fields and their values -- which can then be easily sent
    //with the request.
    const fd = new FormData();
    fd.append('upload_preset', cloudPreset);
    fd.append('file', dataUrl);
    return axios
      .post(url, fd, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      })
      .then(response =>
        this.setState({
          canvasUrl: response.data.url
        })
      )
      .then(() =>
        db
          .collection('scenes')
          .doc(key)
          .set({ imageUrl: this.state.canvasUrl })
      )
      .then(() =>
        db
          .collection('stories')
          .doc(storyId)
          .collection('scenes')
          .doc(key)
          .set({ imageUrl: this.state.canvasUrl, id: key, random: 'check' })
      )
      .then(() =>
        db
          .collection('stories')
          .doc(storyId)
          .update({ thumbnail: this.state.canvasUrl })
      )
      .then(() => this.setState({ fireRedirect: true }))
      .catch(error => console.error('Error creating scene: ', error));
  }

  uploadToCloudinary() {
    const image = this.stageRef.getStage().toDataURL('image/png');
    console.log(image);
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
            {this.state.canvasImages &&
              this.state.canvasImages.map((imageUrl, index) => {
                const image = new window.Image();
                image.crossOrigin = "Anonymous"; //causing async issues. //must use otherwise tainted canvas error.
                image.src = imageUrl;
                return (<Photo
                  key={`${imageUrl}${index}`}
                  imageUrl={imageUrl}
                  image={image}
                  zindex={index}
                   />)
            })}
          </Layer>
        </Stage>
        <select defaultValue="canvas-white" onChange={this.changeBackgroundColor}>
          <option value="canvas-white">White</option>
          <option value="canvas-pinkdots">Pink Dots</option>
          <option value="canvas-bluedots">Blue Dots</option>
          <option value="canvas-orangedots">Orange Dots</option>
          <option value="canvas-purpledots">Purple Dots</option>
          <option value="canvas-redyellowdots">Red & Yellow Dots</option>
          <option value="canvas-crazy">Crazy Pattern</option>
        </select>
        <button type="submit" onClick={this.uploadToCloudinary}>
          Submit Image!
        </button>
        {fireRedirect && <Redirect to={`/stories/${this.state.storyId}`} />}
      </div>
    );
  }
}
