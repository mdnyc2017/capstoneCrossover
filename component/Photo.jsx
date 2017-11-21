import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Layer, Rect, Stage, Group, Image, Circle } from 'react-konva';
import Konva from 'konva'

export default class Photo extends Component {
    constructor(props) {
      super(props);
      this.state = {
        xTop: 5,
        yTop: 5,
        xBottom: 80,
        yBottom: 80,
        draggable: true
      }
      this.handleDragEnd = this.handleDragEnd.bind(this);
      this.handleDragMove = this.handleDragMove.bind(this);
      this.handleMouseOver = this.handleMouseOver.bind(this);
      this.anchorHandleMouseDownTouchStartStart = this.anchorHandleMouseDownTouchStartStart.bind(this);
      this.anchorHandleDragEnd = this.anchorHandleDragEnd.bind(this);

    }

    // componentWillReceiveProps() {
    //     this.setState({imageUrl: this.props.imageUrl})
    // }
  
    handleDragMove(e) {
      const { x, y } = (e.target instanceof Konva.Circle) ?
        e.target.attrs : // circle
        e.target.children[1].attrs; // rect
      this.setState({
        xBottom: x,
        yBottom: y
      });
      this.anchor.moveToTop();
    }

    handleDragEnd(e) {
    }
  
  
    handleMouseOver(e) {
      //console.log('mouseover', e);
    }
  
    anchorHandleMouseDownTouchStartStart(e) {
      //console.log('anchorHandleMouseDownTouchStartStart');
      // this.setState({draggable: false});
    }
  
    anchorHandleDragEnd(e) {
      //console.log('anchorHandleDragEnd');
      // this.setState({draggable: true});
    }
  
    render() {
        const image = new window.Image();
        image.src = this.props.imageUrl;
        return (
          <Group
          onDragEnd={this.handleDragEnd}
          onDragMove={this.handleDragMove}
          onMouseOver={this.handleMouseOver}
          draggable={this.state.draggable}
        >
          <Circle
            fill="black"
            x={this.state.xBottom}
            y={this.state.yBottom}
            ref={anchor => { this.anchor = anchor; }}
            onMouseDown={this.anchorHandleMouseDownTouchStartStart}
            onTouchStart={this.anchorHandleMouseDownTouchStartStart}
            radius={10}
            zIndex={1}
            draggable
          />
            <Image
                image={image}
                x={this.state.xTop}
                y={this.state.yTop}
                width={Math.abs(this.state.xTop - this.state.xBottom)}
                height={Math.abs(this.state.yTop - this.state.yBottom)}
                zIndex={0}
            />
          </Group>
        )
    }
  }
