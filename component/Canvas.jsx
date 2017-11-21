import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Layer, Rect, Stage, Group, Image, Circle } from 'react-konva';
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
          canvasImages: nextProps.images
      })
    }
  
  
    render() {
        console.log(this.state.canvasImages)
      return (
        <Stage width={1000} height={500}>
        <Layer>
          {this.state.canvasImages && this.state.canvasImages.map(imageUrl => {
              return (
              <Photo key={imageUrl} imageUrl={imageUrl} /> )
          })}
        </Layer>
      </Stage>
      );
    }
  }
