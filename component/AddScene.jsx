import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import sha1 from 'sha1';
import superagent from 'superagent';
import { db } from '../fire';
import { Redirect } from 'react-router';
import Canvas from './Canvas';

export default class AddScene extends Component {
  constructor(props) {
    super();
    this.state = {
      storyId: '',
      imageUrl: '',
      previewUrl: '',
      lineStrength: 20,
      colorReduction: 50,
      id: '',
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
    //Plural files
    const image = files[0]; //Assuming we are uploading one file at a time;

    //Normally, an upload str is requested for authentication, but cloudinary deviates from the standard of doing so.

    //cloudName, url, timestamp, uploadPreset will all be packaged into the upload request
    const cloudName = 'noorulain'; //uniquely identifies account

    //Constant string for uploading resource type can be many. image/pdf/video
    const url =
      'https://api.cloudinary.com/v1_1/' + cloudName + '/image/upload';

    //Requires a timestamp in seconds, so it's necessary to divide by 1000
    const timestamp = Date.now() / 1000;

    //Found in settings as well
    const uploadPreset = 'pvfhdtk2';

    //Next create a parameter string
    //Everything is in key:value pairs - it is a url param
    const paramStr =
      'timestamp=' +
      timestamp +
      '&upload_preset=' +
      uploadPreset +
      'ZoD3Vr3GEPRLq3dZdZCaiJbuwCY';

    //Next encrypt using sha1 encryption --sha1 is a function
    //This converts paramStr to sha1 signature --encrypted str is what goes to cloudinary
    //It is their form of security
    const signature = sha1(paramStr);

    //Prepare JSON with params
    const params = {
      api_key: '493184569883823',
      timestamp: timestamp,
      upload_preset: 'pvfhdtk2',
      signature: signature
    };

    //********************READY TO UPLOAD FILE USING ABOVE INFORMATION **********************/
    //Superagent documentation:
    //https://visionmedia.github.io/superagent/

    let uploadRequest = superagent.post(url); //Request made
    //Cloudinary requirement to name the file 'file'
    //Key has to be file and the value is an image
    uploadRequest.attach('file', image); // Upload file, attach is specific to superagent

    //For every upload request, we are sending the key:value from params; loop created in the event we decide to allow users to upload multiple images.
    Object.keys(params).forEach(key => {
      uploadRequest.field(key, params[key]); //Rield is specific to superagent
    });

    uploadRequest.end((err, resp) => {
      //'end' sends the request
      if (err) {
        return;
      }
      const uploadUrl = resp.body.url;
      const ind = uploadUrl.indexOf('upload/');
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
    // setTimeout(() => {
      this.setState({
        canvasImages: [...this.state.canvasImages, this.state.previewUrl]
      });
    // }, 1000);
  }

  handleAddOverlay(image) {
    let self = this;
    // setTimeout(() => {
        this.setState({
            canvasImages: [...this.state.canvasImages, image]
        })
    // }, 1000);
  }

  handleChange(evt) {
    // evt.preventDefault();
    const url = this.state.imageUrl;
    const ind = url.indexOf('upload/');
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
            <img src="/captionbox.png" onClick={() => this.handleAddOverlay('/captionbox.png')} width="100px" />
            <img src="/quote1.png" onClick={() => this.handleAddOverlay('/quote1.png')} width="100px" />
            <img src="/quote2.png" onClick={() => this.handleAddOverlay('/quote2.png')} width="100px" />
            <img src="/quote3.png" onClick={() => this.handleAddOverlay('/quote3.png')} width="100px" />
            <img src="/quote4.png" onClick={() => this.handleAddOverlay('/quote4.png')} width="100px" />
            <img src="/quote5.png" onClick={() => this.handleAddOverlay('/quote5.png')} width="100px" />
            <img src="/quote6.png" onClick={() => this.handleAddOverlay('/quote6.png')} width="100px" />
            <img src="/quote7.png" onClick={() => this.handleAddOverlay('/quote7.png')} width="100px" />
            <img src="/quote8.png" onClick={() => this.handleAddOverlay('/quote8.png')} width="100px" />
            <img src="/quote9.png" onClick={() => this.handleAddOverlay('/quote9.png')} width="100px" />
            <img src="/quote10.png" onClick={() => this.handleAddOverlay('/quote10.png')} width="100px" />
            <img src="/quote11.png" onClick={() => this.handleAddOverlay('/quote11.png')} width="100px" />
        </div>
      </div>
    );
  }
}
