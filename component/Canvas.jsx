import React, {Component} from 'react';
import {Layer, Stage} from 'react-konva';
import Konva from 'konva';
import Photo from './Photo';

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvasImages: []
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
        canvasImages: nextProps.images //Receives from AddScene component
    })
  }

  render() {
    return (
      <Stage width={1000} height={500}>
      <Layer>
        {this.state.canvasImages && this.state.canvasImages.map(imageUrl => <Photo key={imageUrl} imageUrl={imageUrl} /> ) //New Photo component for each user-uploaded image
        }
      </Layer>
    </Stage>
    );
  }
}
