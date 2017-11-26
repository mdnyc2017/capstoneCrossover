import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import sha1 from 'sha1';
import superagent from 'superagent';
import Canvas from './Canvas';
import 'react-tabs/style/react-tabs.scss';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import WebFont from 'webfontloader';

WebFont.load({
  google: {
    families: ['Patrick Hand', 'Gloria Hallelujah', 'Coming Soon', 'Annie Use Your Telescope', 'Schoolbell', 'Patrick Hand SC', 'Walter Turncoat', 'Short Stack', 'Pangolin', 'Sriracha', 'Dekko', 'Kavivanar']
  }
});


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
      canvasImages: [],
      typedText: '',
      fontFamily: 'Patrick Hand',
      fontSize: 40,
      canvasText: [],
      background: '#ffffff'
    };
    this.handleSubmitPreview = this.handleSubmitPreview.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAddOverlay = this.handleAddOverlay.bind(this);
    this.changeBackgroundColor = this.changeBackgroundColor.bind(this);
    this.handleAddText = this.handleAddText.bind(this);
    this.handleTyping = this.handleTyping.bind(this);
    this.handleFontFamily = this.handleFontFamily.bind(this);
    this.handleFontSize = this.handleFontSize.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      user: nextProps.currentUser,
      storyId: this.props.match.params.id
    });
  }

  changeBackgroundColor(event) {
    this.setState({background: event.target.value})
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
        })
    }, 10);
  }

  handleTyping(event) {
    this.setState({
      typedText: event.target.value
    })
  }

  handleFontFamily(event) {
    this.setState({
      fontFamily: event.target.value
    })
  }

  handleFontSize(event) {
    this.setState({
      fontSize: event.target.value
    })
  }

  handleAddText(event) {
    event.preventDefault();
    this.setState({
        canvasText: [...this.state.canvasText, {text: this.state.typedText, fontFamily: this.state.fontFamily, fontSize: this.state.fontSize}]
    })
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
    console.log(this.state.fontSize)
    return (
      <div className="addscene">
        <div className="addscene-dropzone">
          <h1>Image goes here!</h1>
          <Dropzone onDrop={this.uploadFile.bind(this)} />
        </div>

        <div className="addscene-preview">
          <img src={image} />
        </div>

        {image ? (
          <div className="addscene-editpreview">
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
        <div className="addscene-editcanvas">
          <div className="addscene-canvas">
            <Canvas
              images={this.state.canvasImages}
              text={this.state.canvasText}
              currentUser={this.state.user}
              storyId={this.state.storyId}
              background={this.state.background}
            />
          </div>

          <Tabs className="addscene-tabs">
            <TabList className="tabs-list">
              <Tab className="tabs-title">Background</Tab>
              <Tab className="tabs-title">Quote & Caption Bubbles</Tab>
              <Tab className="tabs-title">Text</Tab>
            </TabList>
      
            <TabPanel className="addscene-tabs-panel">
              <input type="color" value={this.state.background} onChange={this.changeBackgroundColor} />
            </TabPanel>
            <TabPanel className="addscene-tabs-panel">
              <div className="overlay-options">
                <img src="/captionbox.png" onClick={() => this.handleAddOverlay('/captionbox.png')} />
                <img src="/quote1.png" onClick={() => this.handleAddOverlay('/quote1.png')} />
                <img src="/quote2.png" onClick={() => this.handleAddOverlay('/quote2.png')} />
                <img src="/quote3.png" onClick={() => this.handleAddOverlay('/quote3.png')} />
                <img src="/quote4.png" onClick={() => this.handleAddOverlay('/quote4.png')} />
                <img src="/quote5.png" onClick={() => this.handleAddOverlay('/quote5.png')} />
                <img src="/quote6.png" onClick={() => this.handleAddOverlay('/quote6.png')} />
                <img src="/quote7.png" onClick={() => this.handleAddOverlay('/quote7.png')} />
                <img src="/quote8.png" onClick={() => this.handleAddOverlay('/quote8.png')} />
                <img src="/quote9.png" onClick={() => this.handleAddOverlay('/quote9.png')} />
                <img src="/quote10.png" onClick={() => this.handleAddOverlay('/quote10.png')} />
                <img src="/quote11.png" onClick={() => this.handleAddOverlay('/quote11.png')} />
              </div>
            </TabPanel>
            <TabPanel className="addscene-tabs-panel">
              <h4>Size:</h4>
              <input type="number" min="0" value={this.state.fontSize} onChange={this.handleFontSize} />
              <h4>Font:</h4>
              <form onSubmit={this.handleAddText}>
                <select defaultValue="Patrick Hand" onChange={this.handleFontFamily}>
                  <option value="Annie Use Your Telescope">Annie Use Your Telescope</option>
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
                <textarea placeholder="Enter text here" rows="4" cols="50" value={this.state.typedText} onChange={this.handleTyping} />
                <button type="submit">Submit</button>
              </form>
              <div className="text-preview"><p style={{fontSize: `${this.state.fontSize}px`, fontFamily: this.state.fontFamily}}>{this.state.typedText || 'Preview'}</p></div>
          </TabPanel>
          </Tabs>
        </div>
      </div>
    );
  }
}
