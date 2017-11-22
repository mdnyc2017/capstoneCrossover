import React, {Component} from 'react';
import {Group, Image, Circle } from 'react-konva';
import Konva from 'konva'

export default class Photo extends Component {
    constructor(props) {
      super(props);
      this.state = {
        xTop: 5,
        yTop: 5,
        xBottom: 80,
        yBottom: 80,
        draggable: true,
        fill: 'transparent'
      }

      this.handleDragMoveTopLeft = this.handleDragMoveTopLeft.bind(this);
      this.handleDragMoveTopRight = this.handleDragMoveTopRight.bind(this);
      this.handleDragMoveBottomLeft = this.handleDragMoveBottomLeft.bind(this);
      this.handleDragMoveBottomRight = this.handleDragMoveBottomRight.bind(this);
      this.circleShow = this.circleShow.bind(this);
      this.circleHide = this.circleHide.bind(this);
    }

    //Resizing Options:
    handleDragMoveTopLeft(e) {
      const { x, y } = (e.target instanceof Konva.Circle) ?
        e.target.attrs : // circle
        e.target.children[1].attrs; // image
      this.setState({
        xTop: x,
        yTop: y
      });
      this.anchor.moveToTop();
    }

    handleDragMoveTopRight(e) {
      const { x, y } = (e.target instanceof Konva.Circle) ?
        e.target.attrs :
        e.target.children[1].attrs;
      this.setState({
        xBottom: x,
        yTop: y
      });
      this.anchor.moveToTop();
    }

    handleDragMoveBottomLeft(e) {
      const { x, y } = (e.target instanceof Konva.Circle) ?
        e.target.attrs :
        e.target.children[1].attrs;
      this.setState({
        xTop: x,
        yBottom: y
      });
      this.anchor.moveToTop();
    }
  
    handleDragMoveBottomRight(e) {
      const { x, y } = (e.target instanceof Konva.Circle) ?
        e.target.attrs :
        e.target.children[1].attrs;
      this.setState({
        xBottom: x,
        yBottom: y
      });
      this.anchor.moveToTop();
    }

    //Toggling Show/Hide resize circle guides
    circleShow() {
      this.setState({fill: 'grey'})
    }

    circleHide() {
      this.setState({fill: 'transparent'})
    }
  
    render() {
      const image = new window.Image();
      image.src = this.props.imageUrl;

      return (
        <Group draggable={this.state.draggable}>
          <Circle //bottom-right resize guide
            fill={this.state.fill}
            onDragMove={this.handleDragMoveBottomRight}
            onMouseOver={this.circleShow}
            onMouseOut={this.circleHide}
            x={this.state.xBottom}
            y={this.state.yBottom}
            ref={anchor => { this.anchor = anchor; }}
            radius={10}
            zIndex={1}
            draggable
          />
          <Circle //bottom-left resize guide
            fill={this.state.fill}
            onDragMove={this.handleDragMoveBottomLeft}
            onMouseOver={this.circleShow}
            onMouseOut={this.circleHide}
            x={this.state.xTop}
            y={this.state.yBottom}
            ref={anchor => { this.anchor = anchor; }}
            radius={10}
            zIndex={1}
            draggable
          />
          <Circle //top-right resize guide
            fill={this.state.fill}
            onDragMove={this.handleDragMoveTopRight}
            onMouseOver={this.circleShow}
            onMouseOut={this.circleHide}
            x={this.state.xBottom}
            y={this.state.yTop}
            ref={anchor => { this.anchor = anchor; }}
            radius={10}
            zIndex={1}
            draggable
          />
          <Circle //top-left resize guide
            fill={this.state.fill}
            onDragMove={this.handleDragMoveTopLeft}
            onMouseOver={this.circleShow}
            onMouseOut={this.circleHide}
            x={this.state.xTop}
            y={this.state.yTop}
            ref={anchor => { this.anchor = anchor; }}
            radius={10}
            zIndex={1}
            draggable
          />
          <Image //image added by user
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
