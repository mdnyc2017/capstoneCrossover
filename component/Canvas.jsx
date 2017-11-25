import React, {Component} from 'react';
import {Layer, Stage} from 'react-konva';
import Konva from 'konva';
import Photo from './Photo';

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvasImages: [],
      background: 'canvas-white'
    }
    this.changeBackgroundColor = this.changeBackgroundColor.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
        canvasImages: nextProps.images //Receives from AddScene component
    })
  }

  changeBackgroundColor(e) {
    this.setState({background: e.target.value})
  }

  render() {
    return (
      <div>
        <Stage width={1000} height={500} className={this.state.background} >
          <Layer>
            {this.state.canvasImages && this.state.canvasImages.map((imageUrl, index) => <Photo key={imageUrl} imageUrl={imageUrl} zIndex={index} /> ) //New Photo component for each user-uploaded image
            }
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
    </div>
    );
  }
}
