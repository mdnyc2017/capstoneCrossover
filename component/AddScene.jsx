import React, { Component } from "react";
import Dropzone from "react-dropzone";
import superagent from "superagent";
import { db } from "../fire";
import { Redirect } from "react-router";
import sha1 from "sha1";
import Canvas from "./Canvas";
import "react-tabs/style/react-tabs.scss";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import WebFont from "webfontloader";
import createImageElement from '../lib/create-image-element'

//this is the component in which an image is modified to a users preference and then added to the canvas
const fonts = [
  "Patrick Hand",
  "Gloria Hallelujah",
  "Coming Soon",
  "Annie Use Your Telescope",
  "Schoolbell",
  "Patrick Hand SC",
  "Walter Turncoat",
  "Short Stack",
  "Pangolin",
  "Sriracha",
  "Dekko",
  "Kavivanar"
];

WebFont.load({
  google: {
    families: fonts
  }
});

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
      canvasImages: [],
      typedText: "",
      fontFamily: "Patrick Hand",
      fontSize: 40,
      canvasText: [],
      background: "#ffffff"
    };
    this.handleSubmitPreview = this.handleSubmitPreview.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAddOverlay = this.handleAddOverlay.bind(this);
    this.changeBackgroundColor = this.changeBackgroundColor.bind(this);
    this.handleAddText = this.handleAddText.bind(this);
    this.handleTyping = this.handleTyping.bind(this);
    this.handleFontFamily = this.handleFontFamily.bind(this);
    this.handleFontSize = this.handleFontSize.bind(this);
    this.updateCanvasImages = this.updateCanvasImages.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.state,
      user: nextProps.currentUser,
      storyId: this.props.match.params.id
    });
  }

  changeBackgroundColor(event) {
    this.setState({ ...this.state, background: event.target.value });
  }

  uploadFile(files) {
    const url = "https://us-central1-crossover-cf663.cloudfunctions.net/api/uploadImage/";
    //const url = "http://localhost:5001/crossover-cf663/us-central1/api/uploadImage/";
    let uploadRequest = superagent.post(url);
    uploadRequest.attach("file", files[0]);
    uploadRequest.end((err, resp) => {
      if (err) {
        console.log(err, null);
        return;
      }
      const uploadUrl = resp.body.secure_url;
      const ind = uploadUrl.indexOf("upload/");
      const newUrl = `${uploadUrl.slice(0, ind + 7)}w_500/e_cartoonify:${
        this.state.lineStrength
        }:${this.state.colorReduction}${uploadUrl.slice(ind + 7)}`;
      this.setState({
        ...this.state,
        imageUrl: uploadUrl,
        previewUrl: newUrl
      });
    });
  }

  // delay in loading image in chrome and firefox but not in safari
  handleSubmitPreview(evt) {
    evt.preventDefault();
    createImageElement(this.state.previewUrl, this.updateCanvasImages)
  }

  updateCanvasImages(image) {
    this.setState({
      ...this.state,
      canvasImages: [...this.state.canvasImages, image]
    })
  }

  handleAddOverlay(imageUrl) {
    createImageElement(imageUrl, this.updateCanvasImages)
  }


  handleTyping(event) {
    this.setState({
      ...this.state,
      typedText: event.target.value
    });
  }

  handleFontFamily(event) {
    this.setState({
      ...this.state,
      fontFamily: event.target.value
    });
  }

  handleFontSize(event) {
    this.setState({
      ...this.state,
      fontSize: event.target.value
    });
  }

  handleAddText(event) {
    event.preventDefault();
    this.setState({
      ...this.state,
      canvasText: [
        ...this.state.canvasText,
        {
          text: event.target.typedText.value,
          fontFamily: this.state.fontFamily,
          fontSize: this.state.fontSize
        }
      ]
    });
  }

  handleChange(evt) {
    const url = this.state.imageUrl;
    const ind = url.indexOf("upload/");
    this.setState({
      ...this.state,
      [evt.target.name]: evt.target.value,
      previewUrl: `${url.slice(0, ind + 7)}w_500/e_cartoonify:${
        this.state.lineStrength
        }:${this.state.colorReduction}${url.slice(ind + 7)}`
    });
  }

  render() {
    const image = this.state.previewUrl; // If there is a previewUrl we will render it below and supply a form to edit degree of cartoonify effect

    return (
      <div className="addscene">
        <div className="addscene-edit">
          <div className="addscene-edit-dropzone">
            <Dropzone onDrop={this.uploadFile.bind(this)}>
              <h2 className="addscene-edit-dropzone-text">Add an Image</h2>
            </Dropzone>
          </div>

          <div className="addscene-edit-preview">
            {image ? <h3>Preview:</h3> : <span />}
            <img src={image} />
          </div>

          {image ? (
            <div className="addscene-edit-cartoonify">
              <form onSubmit={this.handleSubmitPreview}>
                <div className="addscene-edit-cartoonify-fields">
                  <div>
                    <span>Line Strength</span>
                    <input
                      className="form-field"
                      type="number"
                      min="0"
                      max="100"
                      value={this.state.lineStrength}
                      name="lineStrength"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div>
                    <span>Color Reduction</span>
                    <input
                      className="form-field"
                      type="number"
                      min="0"
                      max="100"
                      value={this.state.colorReduction}
                      name="colorReduction"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <button
                  className="addscene-edit-cartoonify-button"
                  type="submit"
                >
                  Add to Canvas
                </button>
              </form>
            </div>
          ) : (
              <span />
            )}

          <div className="addscene-edit-canvas">
            <Tabs className="addscene-edit-canvas-tabs">
              <TabList className="addscene-edit-canvas-tabs-list">
                <Tab className="addscene-edit-canvas-tabs-title">
                  Background
                </Tab>
                <Tab className="addscene-edit-canvas-tabs-title">Bubbles</Tab>
                <Tab className="addscene-edit-canvas-tabs-title">Text</Tab>
              </TabList>

              <TabPanel className="addscene-edit-canvas-tabs-panel">
                <div className="background-panel">
                  <input
                    type="color"
                    value={this.state.background}
                    onChange={this.changeBackgroundColor}
                  />
                  <span>Select a background color</span>
                </div>
              </TabPanel>
              <TabPanel className="addscene-edit-canvas-tabs-panel">
                <div className="addscene-edit-canvas-tabs-overlay">
                  <img
                    src="/captionbox.png"
                    onClick={() => this.handleAddOverlay("/captionbox.png")}
                  />
                  <img
                    src="/quote1.png"
                    onClick={() => this.handleAddOverlay("/quote1.png")}
                  />
                  <img
                    src="/quote2.png"
                    onClick={() => this.handleAddOverlay("/quote2.png")}
                  />
                  <img
                    src="/quote3.png"
                    onClick={() => this.handleAddOverlay("/quote3.png")}
                  />
                  <img
                    src="/quote4.png"
                    onClick={() => this.handleAddOverlay("/quote4.png")}
                  />
                  <img
                    src="/quote5.png"
                    onClick={() => this.handleAddOverlay("/quote5.png")}
                  />
                  <img
                    src="/quote6.png"
                    onClick={() => this.handleAddOverlay("/quote6.png")}
                  />
                  <img
                    src="/quote7.png"
                    onClick={() => this.handleAddOverlay("/quote7.png")}
                  />
                  <img
                    src="/quote8.png"
                    onClick={() => this.handleAddOverlay("/quote8.png")}
                  />
                  <img
                    src="/quote9.png"
                    onClick={() => this.handleAddOverlay("/quote9.png")}
                  />
                  <img
                    src="/quote10.png"
                    onClick={() => this.handleAddOverlay("/quote10.png")}
                  />
                  <img
                    src="/quote11.png"
                    onClick={() => this.handleAddOverlay("/quote11.png")}
                  />
                </div>
              </TabPanel>
              <TabPanel className="addscene-edit-canvas-tabs-panel">
                <h4>Size:</h4>
                <input
                  type="number"
                  min="0"
                  value={this.state.fontSize}
                  onChange={this.handleFontSize}
                />
                <h4>Font:</h4>
                <form onSubmit={this.handleAddText}>
                  <select
                    defaultValue="Patrick Hand"
                    onChange={this.handleFontFamily}
                  >
                    <option value="Annie Use Your Telescope">
                      Annie Use Your Telescope
                    </option>
                    <option value="Coming Soon">Coming Soon</option>
                    <option value="Dekko">Dekko</option>
                    <option value="Gloria Hallelujah">Gloria Hallelujah</option>
                    <option value="Kavivanar">Kavivanar</option>
                    <option value="Pangolin">Pangolin</option>
                    <option value="Patrick Hand">Patrick Hand</option>
                    <option value="Patrick Hand SC">Patrick Hand SC</option>
                    <option value="Schoolbell">Schoolbell</option>
                    <option value="Short Stack">Short Stack</option>
                    <option value="Sriracha">Sriracha</option>
                    <option value="Walter Turncoat">Walter Turncoat</option>
                  </select>
                  <textarea
                    placeholder="Enter text here"
                    rows="4"
                    cols="50"
                    //value={this.state.typedText}
                    name="typedText"
                  //onChange={this.handleTyping}
                  />
                  <div>
                    <button type="submit">Submit</button>
                  </div>
                </form>
                <div className="text-preview">
                  <p
                    style={{
                      fontSize: `${this.state.fontSize}px`,
                      fontFamily: this.state.fontFamily
                    }}
                  >
                    {this.state.typedText || "Preview"}
                  </p>
                </div>
              </TabPanel>
            </Tabs>
          </div>
        </div>

        <div className="addscene-canvas">
          <div className="addscene-canvas-container">
            <Canvas
              images={this.state.canvasImages}
              text={this.state.canvasText}
              currentUser={this.state.user}
              storyId={this.state.storyId}
              background={this.state.background}
            />
          </div>
          <p className="addscene-canvas-remover">
            To remove an item from the canvas, simply drag it out of view!
          </p>
        </div>
      </div>
    );
  }
}
