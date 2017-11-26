import React, { Component } from "react";
import { Group, Circle, Text } from "react-konva";
import Konva from "konva";
import WebFont from 'webfontloader';

WebFont.load({
  google: {
    families: ['Patrick Hand']
  }
});

export default class Photo extends Component {
    constructor(props) {
      super(props);
      this.state = {
        xLeft: 5,
        yTop: 5,
        xRight: 280,
        yBottom: 280,
        draggable: true,
        fill: 'transparent',
        fontSize: 60,
        wrap: 'word'
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
    const { x, y } =
      e.target instanceof Konva.Circle
        ? e.target.attrs // circle
        : e.target.children[1].attrs; // image
    this.setState({
      xLeft: (x >= this.state.xRight) ? this.state.xRight : x,
      yTop: (y >= this.state.yBottom) ? this.state.yBottom : y
    });
    this.anchor.moveToTop();
  }

  handleDragMoveTopRight(e) {
    const { x, y } =
      e.target instanceof Konva.Circle
        ? e.target.attrs
        : e.target.children[1].attrs;
    this.setState({
      xRight: (x <= this.state.xLeft) ? this.state.xLeft : x,
      yTop: (y >= this.state.yBottom) ? this.state.yBottom : y
    });
    this.anchor.moveToTop();
  }

  handleDragMoveBottomLeft(e) {
    const { x, y } =
      e.target instanceof Konva.Circle
        ? e.target.attrs
        : e.target.children[1].attrs;
    this.setState({
      xLeft: (x >= this.state.xRight) ? this.state.xRight : x,
      yBottom: (y <= this.state.yTop) ? this.state.yTop : y
    });
    this.anchor.moveToTop();
  }

  handleDragMoveBottomRight(e) {
    const { x, y } =
      e.target instanceof Konva.Circle
        ? e.target.attrs
        : e.target.children[1].attrs;
    this.setState({
      xRight: (x <= this.state.xLeft) ? this.state.xLeft : x,
      yBottom: (y <= this.state.yTop) ? this.state.yTop : y
    });
    this.anchor.moveToTop();
  }

  //Toggling Show/Hide resize circle guides
  circleShow() {
    this.setState({ fill: "grey" });
  }

  circleHide() {
    this.setState({ fill: "transparent" });
  }

  render() {

    return (
    <Group draggable={this.state.draggable} >
      <Circle //bottom-right resize guide
        fill={this.state.fill}
        onDragMove={this.handleDragMoveBottomRight}
        onMouseOver={this.circleShow}
        onMouseOut={this.circleHide}
        x={this.state.xRight}
        y={this.state.yBottom}
        ref={anchor => { this.anchor = anchor; }}
        radius={10}
        draggable
      />
      <Circle //bottom-left resize guide
        fill={this.state.fill}
        onDragMove={this.handleDragMoveBottomLeft}
        onMouseOver={this.circleShow}
        onMouseOut={this.circleHide}
        x={this.state.xLeft}
        y={this.state.yBottom}
        ref={anchor => { this.anchor = anchor; }}
        radius={10}
        draggable
      />
      <Circle //top-right resize guide
        fill={this.state.fill}
        onDragMove={this.handleDragMoveTopRight}
        onMouseOver={this.circleShow}
        onMouseOut={this.circleHide}
        x={this.state.xRight}
        y={this.state.yTop}
        ref={anchor => { this.anchor = anchor; }}
        radius={10}
        draggable
      />
      <Circle //top-left resize guide
        fill={this.state.fill}
        onDragMove={this.handleDragMoveTopLeft}
        onMouseOver={this.circleShow}
        onMouseOut={this.circleHide}
        x={this.state.xLeft}
        y={this.state.yTop}
        ref={anchor => { this.anchor = anchor; }}
        radius={10}
        draggable
      />
      <Text
        text={this.props.text}
        fontSize={this.state.fontSize}
        wrap={this.state.wrap}
        fontFamily="Patrick Hand"
        fill="black"
        onMouseOver={this.circleShow}
        onMouseOut={this.circleHide}
        x={this.state.xLeft}
        y={this.state.yTop}
        width={Math.abs(this.state.xRight - this.state.xLeft)}
        height={Math.abs(this.state.yBottom - this.state.yTop)}
      />
    </Group>
  )}
}
