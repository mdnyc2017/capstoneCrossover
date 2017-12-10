import React, { Component } from "react";
import { Layer, Stage, Image, Rect } from "react-konva";
import Konva from "konva";
import Photo from "./Photo";
import TextField from "./TextField";
import superagent from "superagent";
import { db } from "../fire";
import { Redirect } from "react-router";
import axios from "axios";

//this component saves the canvas image
function dataURItoBlob(dataURI) {
  //format of dataURI is data:[<mime type>][;charset=<charset>][;base64],<encoded data>
  //'mime' is the type of file - in our case is it an image/png - default is plain/text
  //charset omitted for images
  //base64 -- our data is grouped into numeric base64 digits

  // convert base64 to raw binary data held in a string
  // asci binary --- converts base64 to ascii
  // atob is function available on the window object
  var byteString = atob(dataURI.split(",")[1]);

  // separate out the mime component
  var mimeString = dataURI
    .split(",")[0]
    .split(":")[1]
    .split(";")[0];

  // write the bytes of the string to an ArrayBuffer
  // array of buffers to hold in memory value
  // buffer is raw binary data
  // a size has to be given to araybuffer - length of byte string
  var ab = new ArrayBuffer(byteString.length);

  // cannot be manipulated directly
  // so we create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob
  var blob = new Blob([ab], { type: mimeString });
  return blob;
}

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
    const url =
      "https://us-central1-crossover-cf663.cloudfunctions.net/api/uploadImage/"; //cloud func location - it acts
    //const url ="http://localhost:5001/crossover-cf663/us-central1/api/uploadImage/";

    let uploadRequest = superagent.post(url);
    uploadRequest.attach("file", dataURItoBlob(dataUrl)); //Cloudinary requirement to name the file 'file
    uploadRequest.end((err, response) => {
      // 'ends' -- request sent
      this.setState({
        canvasUrl: response.body.secure_url // cloudniary sends back a url
      });
      db //the canvas image is stored in the scenes collection with a unique key (userId + date now)
        .collection("scenes")
        .doc(key)
        .set({ imageUrl: this.state.canvasUrl })
        .then(() =>
          db //image is also stored in 'stories'
            .collection("stories")
            .doc(storyId)
            .collection("scenes")
            .doc(key)
            .set({ imageUrl: this.state.canvasUrl, id: key })
        )
        .then(() =>
          db
            .collection("stories")
            .doc(storyId)
            .update({ thumbnail: this.state.canvasUrl })
        )
        .then(() => this.setState({ fireRedirect: true }))
        .catch(error => console.error("Error creating scene: ", error));
    });
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
                const image = new window.Image(); //image object
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
