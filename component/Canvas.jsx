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
      this.convertImg =this.convertImg.bind(this)
    }

   
    componentWillReceiveProps(nextProps) {
      this.setState({
          canvasImages: nextProps.images
      })
    }

    convertImg(e) {
      e.preventDefault();
      console.log(this)
    }
  
    render() {
      return (
        <div id="konva">
        <form onSubmit={this.convertImg}>
        <Stage width={1000} height={500} >
        <Layer>
          {this.state.canvasImages && this.state.canvasImages.map(imageUrl => {
              return (
              <Photo key={imageUrl} imageUrl={imageUrl} /> )
          })}
        </Layer>
      </Stage>
      <button type='submit'>Submit Image!</button>
      </form>
      </div>
      );
    }
  }
